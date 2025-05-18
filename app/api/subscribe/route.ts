import { NextRequest, NextResponse } from "next/server";
import { newsletterConfig } from "@/config";

export async function POST(req: NextRequest) {
  // Check if Brevo integration is enabled
  if (!newsletterConfig.brevo.enabled) {
    return NextResponse.json(
      { error: "Newsletter subscription is not configured" },
      { status: 503 }
    );
  }

  // Get API key and list ID from environment variables
  const BREVO_API_KEY = process.env.BREVO_API_KEY;
  const BREVO_LIST_ID = parseInt(process.env.BREVO_LIST_ID || "0", 10);

  // Validate API key and list ID
  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    return NextResponse.json(
      { error: "Newsletter service is not properly configured" },
      { status: 500 }
    );
  }

  try {
    // Get email from request body
    const body = await req.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Send request to Brevo API
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        listIds: [BREVO_LIST_ID],
        updateEnabled: true, // Update contact if it already exists
      }),
    });

    // Handle responses
    if (response.status === 201) {
      // Successfully created
      return NextResponse.json(
        { success: true, message: "Successfully subscribed" },
        { status: 201 }
      );
    } else if (response.status === 204) {
      // Contact updated (already exists)
      return NextResponse.json(
        { success: true, message: "Contact updated successfully" },
        { status: 200 }
      );
    } else {
      // Handle error responses from Brevo API
      const data = await response.json();

      // Handle specific error codes
      if (data.code === "duplicate_parameter") {
        return NextResponse.json(
          { error: "This email is already subscribed" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: data.message || "Error subscribing to newsletter" },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
