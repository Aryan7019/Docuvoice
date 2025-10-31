// app/api/debug/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all consultations with report analysis
    const consultations = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.createdBy, user.id))
      .orderBy(desc(SessionChatTable.createdOn))
      .limit(10);

    const analysis = consultations.map(consultation => ({
      id: consultation.id,
      sessionId: consultation.sessionId,
      hasReport: !!consultation.report,
      reportType: typeof consultation.report,
      reportSample: consultation.report ? 
        (typeof consultation.report === 'string' ? 
          consultation.report.substring(0, 100) + '...' : 
          JSON.stringify(consultation.report).substring(0, 100) + '...') :
        null,
      createdOn: consultation.createdOn
    }));

    return NextResponse.json({ 
      user: user.id,
      totalConsultations: consultations.length,
      consultationsWithReports: consultations.filter(c => c.report).length,
      analysis 
    });

  } catch (error) {
    console.error("Error in debug endpoint:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}