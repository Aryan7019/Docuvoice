// app/api/consultations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's consultations - limit to recent 50 for speed
    // Only select necessary fields to reduce data transfer
    const consultations = await db
      .select({
        id: SessionChatTable.id,
        sessionId: SessionChatTable.sessionId,
        createdBy: SessionChatTable.createdBy,
        notes: SessionChatTable.notes,
        selectedDoctor: SessionChatTable.selectedDoctor,
        report: SessionChatTable.report,
        createdOn: SessionChatTable.createdOn,
        consultationDuration: SessionChatTable.consultationDuration,
        callStartedAt: SessionChatTable.callStartedAt,
        callEndedAt: SessionChatTable.callEndedAt,
        // Exclude conversation field - it's large and not needed for list view
      })
      .from(SessionChatTable)
      .where(eq(SessionChatTable.createdBy, user.id))
      .orderBy(desc(SessionChatTable.createdOn))
      .limit(50);

    return NextResponse.json(
      { consultations },
      {
        headers: {
          'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        },
      }
    );

  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}