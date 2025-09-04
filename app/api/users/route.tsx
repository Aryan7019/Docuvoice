import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server"; // Server-side imports
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user from Clerk (server-side)
      const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the full user object to access email
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the primary email address
    const emailAddress = user.emailAddresses[0]?.emailAddress;
    
    if (!emailAddress) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    // Query the database
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, emailAddress));
   if(users.length === 0){
      const result  = await db.insert(usersTable).values({
         name: user?.username || "Guest",
         email: emailAddress,
         clerkID: userId,
         credits: 10
         //@ts-ignore
      }).returning({ usersTable })
      return NextResponse.json(result[0]?.usersTable);
   }

    return NextResponse.json({ users }, { status: 200 });

  } catch (err) {
    console.error("Error in POST endpoint:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}