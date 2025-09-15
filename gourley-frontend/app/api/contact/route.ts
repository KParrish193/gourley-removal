import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();

  return new google.auth.GoogleAuth({
    credentials: {
      type: process.env.GOOGLE_TYPE,
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function POST(req: Request) {
  const auth = getSheetsClient();
  const sheets = google.sheets({ version: "v4", auth });

  const body = await req.json();
  let sheetStatus = `pending`;
  let emailStatus = "pending";

  // Step 1: Append data to Google Sheets
  try { 
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Contact!A:G",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
            new Date().toLocaleString(),
            body.firstName,
            body.lastName,
            body.phone,
            body.email,
            body.jobType,
            body.description,
        ]],
      },
    });

    sheetStatus = `success`;
  } catch (err: unknown) {
      sheetStatus = 
        err instanceof Error ? `error: ${err.message}` : 
      sheetStatus = "error: unknown error";
  }

  //Step 2: Send email with Resend
  try {
    console.log(process.env.EMAIL_TO)
    const { error } = await resend.emails.send({
      from: `Gourley Tree Removal Site <${process.env.EMAIL_FRO}>`,
      to: `${process.env.EMAIL_TO}`,
      subject: "New Contact Form Submission",
      text: `New submission:\n\n${JSON.stringify(body, null, 2)}`,
    });

    if (error) throw new Error(error.message);
    emailStatus = "success";
  } catch (err: unknown) {
    emailStatus =
      err instanceof Error ? `error: ${err.message}` : "error: unknown error";
  }

  return NextResponse.json({
    ok: sheetStatus === "success" && emailStatus === "success",
    sheetStatus,
    emailStatus,
  });
}
