import { NextRequest, NextResponse } from "next/server";
// Assuming this file correctly initializes the GoogleGenAI client
import { gemini } from "@/config/GeminiModel"; 
import { AIDoctorAgents } from "@/app/(routes)/dashboard/components/list";

export async function POST(req: NextRequest) {
    const { notes } = await req.json();
    
    // Validate input
    if (!notes || notes.trim().length === 0) {
      return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
    }
    
    try {
        // --- FIX: systemInstruction moved inside the config object ---
        const completion = await gemini.models.generateContent({
            model: 'gemini-2.5-flash', 
            
            // REMOVED: systemInstruction: "...", 

            contents: [
                {
                    role: 'user',
                    parts: [
                        // Provide the list of available agents in the context
                        { text: `Available Doctors: ${JSON.stringify(AIDoctorAgents)}` },
                        // Provide the user query
                        { text: `I have the following symptoms and details: ${notes}. Based on these, suggest all suitable doctors or specialists I should consult with. Only return the final JSON array of matched doctor objects.` }
                    ]
                }
            ],
            
            config: {
                // CORRECTED LOCATION for older or specific SDK versions
                systemInstruction: "You are an expert medical triage assistant. Your task is to analyze the user's symptoms and match them to the most suitable specialist(s) from the provided list. You MUST respond with valid JSON containing an array of the matched DoctorAgent objects only.",
                responseMimeType: "application/json", 
            }
        });

        // The rest of your logic remains the same.
        const rawResponse = completion.text;
        
        if (!rawResponse) {
            return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
        }
        
        const cleanedResponse = rawResponse.trim().replace(/```json\s?/g, '').replace(/```/g, '');
        
        let JSONResp;
        try {
            JSONResp = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            return NextResponse.json({ 
                error: 'AI returned invalid JSON format.', 
                rawResponse: rawResponse 
            }, { status: 500 });
        }
        
        return NextResponse.json(JSONResp);
        
    } catch(e) {
        console.error('Error in AI doctor recommendation:', e);
        return NextResponse.json({ 
            error: 'Failed to process your request due to an external API error.', 
            details: e instanceof Error ? e.message : 'Unknown error during API call'
        }, { status: 500 });
    }
}