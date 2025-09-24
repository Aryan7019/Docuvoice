import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid"; // Add this import

export async function POST(req: NextRequest) {
  try {
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate session ID using uuid
    const sessionId = uuidv4();

    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user.id,
        notes: notes || "",
        selectedDoctor: selectedDoctor || null,
        createdOn: new Date().toISOString(),
      })
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }

    const newSession = result[0];
    return NextResponse.json({ 
      sessionId: newSession.sessionId,
      success: true 
    });
    
  } catch (e) {
    console.error("Database operation failed:", e);
    return NextResponse.json({ 
      error: "Failed to create session",
      details: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 });
  }
}

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Correcting the logic to handle the sessionId
  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    // Correctly query the database using the sessionId
    const result = await db.select().from(SessionChatTable).where(eq(SessionChatTable.sessionId, sessionId));

    // Check if a session was found
    if (result.length === 0) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Return the first item from the result array
    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("Database operation failed:", e);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}