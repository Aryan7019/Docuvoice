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

    // Fetch user's consultations - limit to recent 20 for speed
    const consultations = await db
      .select()
      .from(SessionChatTable)
      .where(eq(SessionChatTable.createdBy, user.id))
      .orderBy(desc(SessionChatTable.createdOn))
      .limit(20);

    return NextResponse.json({ consultations });

  } catch (error) {
    console.error("Error fetching consultations:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations" },
      { status: 500 }
    );
  }
}