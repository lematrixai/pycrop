import { neon } from "@neondatabase/serverless";

async function createUsersTable(sql: any) {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      clerk_id TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    await createUsersTable(sql);
    
    const { name, email, clerkId } = await request.json();

    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    try {
      const response = await sql`
        INSERT INTO users (
          name, 
          email, 
          clerk_id
        ) 
        VALUES (
          ${name}, 
          ${email},
          ${clerkId}
        );`;

      return new Response(JSON.stringify({ data: response }), {
        status: 201,
      });
    } catch (error: any) {
      // Handle duplicate email error
      if (error.code === '23505' && error.constraint === 'users_email_key') {
        return Response.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}