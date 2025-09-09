import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Setup OAuth2 client
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    oAuth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Step 1: Append data to Google Sheets
    const sheets = google.sheets({ version: "v4", auth: oAuth2Client });
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Contact!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toLocaleString(),
            body.firstName,
            body.lastName,
            body.phone,
            body.email,
            body.jobType,
            body.description,
          ],
        ],
      },
    });

    //Step 2: Send email via Gmail API
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const rawMessage = createEmail(
      process.env.EMAIL_FROM!,
      process.env.EMAIL_TO!,
      "New Contact Form Submission",
      `
      New form submission:

      Name: ${body.firstName} ${body.lastName}
      Phone: ${body.phone}
      Email: ${body.email}
      Job Type: ${body.jobType}
      Description:
      ${body.description}
      `
    );

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw: rawMessage },
    });

    return NextResponse.json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  }
}

// Helper to encode email
function createEmail(
  from: string,
  to: string,
  subject: string,
  message: string
) {
  const email = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "",
    message,
  ].join("\n");

  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
