// app/api/consultations/route.ts
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

    console.log("🔍 Fetching consultations for user:", user.id);

    // Fetch user's consultations with ALL fields including report
    const consultations = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.createdBy, user.id))
      .orderBy(desc(SessionChatTable.createdOn))
      .limit(50);

    // Log what we're getting from the database
    console.log(`📊 Found ${consultations.length} consultations`);
    consultations.forEach((consultation, index) => {
      console.log(`Consultation ${index + 1}:`, {
        id: consultation.id,
        sessionId: consultation.sessionId,
        hasReport: !!consultation.report,
        reportType: typeof consultation.report,
        reportData: consultation.report
      });
    });

    return NextResponse.json({ 
      consultations,
      total: consultations.length 
    });

  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}