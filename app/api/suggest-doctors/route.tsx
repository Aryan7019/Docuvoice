import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/config/OpenAiModel"
import { AIDoctorAgents } from "@/app/(routes)/dashboard/components/list";

export async function POST(req: NextRequest){
   const { notes } = await req.json();
   
   // Validate input
   if (!notes || notes.trim().length === 0) {
     return NextResponse.json({ error: 'Notes are required' }, { status: 400 });
   }
   
   try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-exp:free',
      messages: [
        {
          role: 'system',
          content: JSON.stringify(AIDoctorAgents),
        },
        {
          role: 'user',
          content: "I have the following symptoms and details: "+ notes +". Based on these, can you suggest all suitable doctors or specialists I should consult with and return the response in valid JSON format only."
        }
      ],
    });
  
    const rawResponse = completion.choices[0]?.message?.content;
    
    if (!rawResponse) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 });
    }
    
    // Clean and parse the response
    const cleanedResponse = rawResponse.trim().replace(/```json\s?/g, '').replace(/```/g, '');
    const JSONResp = JSON.parse(cleanedResponse);
    
    return NextResponse.json(JSONResp);
    
  } catch(e) {
      console.error('Error in AI doctor recommendation:', e);
      return NextResponse.json({ 
        error: 'Failed to process your request', 
        details: e instanceof Error ? e.message : 'Unknown error'
      }, { status: 500 });
  }
}