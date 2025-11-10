import { NextRequest, NextResponse } from "next/server";
import { gemini } from "@/config/GeminiModel";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";

// The system prompt
const systemInstruction = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:
1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}
Only include valid fields. Respond with nothing else.
`;

// Define the type for the incoming messages
type Message = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isComplete?: boolean;
}

export async function POST(req: NextRequest) {
  let messages, sessionDetails, sessionId;
  
  try {
    const body = await req.json();
    messages = body.messages;
    sessionDetails = body.sessionDetails;
    sessionId = body.sessionId;
  } catch (error) {
    console.error('Failed to parse request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // --- 1. Input Validation ---
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
  }
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }
  if (!sessionDetails || !sessionDetails.selectedDoctor || !sessionDetails.selectedDoctor.specialist) {
    return NextResponse.json({ error: 'Valid session details with a selected doctor are required' }, { status: 400 });
  }

  // --- 2. Format Transcript ---
  const transcript = messages
    .map((msg: Message) => `${msg.role === 'user' ? 'Patient' : 'Agent'}: ${msg.content}`)
    .join('\n');

  // --- 3. Prepare User Prompt ---
  const userPrompt = `
Here is the conversation transcript:
---
${transcript}
---

Please generate the JSON report based on this transcript.
Use the following exact values for these fields:
- "sessionId": "${sessionId}"
- "agent": "${sessionDetails.selectedDoctor.specialist}"
- "timestamp": "${new Date().toISOString()}"

Analyze the transcript to fill in the remaining fields (user, chiefComplaint, summary, symptoms, etc.).
`;

  try {
    // --- 4. Call Gemini API with correct model ---
    const completion = await gemini.models.generateContent({
      model: 'gemini-2.5-flash', // FIXED: Use same model as doctor route
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const rawResponse = completion.text;
    if (!rawResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }

    // --- 5. Parse JSON Response ---
    const cleanedResponse = rawResponse.trim().replace(/```json\s?/g, '').replace(/```/g, '');
    let reportJson: any; 
    try {
      reportJson = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError, rawResponse);
      return NextResponse.json({
        error: 'AI returned invalid JSON format.',
        rawResponse: rawResponse
      }, { status: 500 });
    }

    // --- 6. Save Report to Database (Drizzle) ---
    try {
      await db.update(SessionChatTable)
        .set({
          report: reportJson,
          conversation: messages
        })
        .where(eq(SessionChatTable.sessionId, sessionId));

    } catch (dbError) {
      console.error("Failed to save report to database:", dbError);
    }

    // --- 7. Return Successful Response ---
    return NextResponse.json(reportJson);

  } catch (e) {
    console.error('Error in AI medical report generation:', e);
    return NextResponse.json({
      error: 'Failed to process your request due to an external API error.',
      details: e instanceof Error ? e.message : 'Unknown error during API call'
    }, { status: 500 });
  }
}