import { google } from "googleapis";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function getSheetsClient() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

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
    
  const body = await req.json();
  let sheetStatus = `pending`;
  let emailStatus = "pending";

  // Step 1: Append data to Google Sheets
  try { 
    const sheets = google.sheets({ version: "v4", auth });
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
    console.log("Sheet append success");
  } catch (err: unknown) {
    if (err instanceof Error) {
      sheetStatus = `error: ${err.message}`;
      console.error("Google Sheets POST error:", err);
    } else {
      sheetStatus = "error: unknown error";
      console.error("Google Sheets POST error:", err);
    }
  }

  //Step 2: Send email with Resend
  try {
    const emailFrom =  process.env.EMAIL_FROM;
    const emailTo =  process.env.EMAIL_TO
    const { error } = await resend.emails.send({
      from: `Gourley Tree Removal Site <${emailFrom}>`,
      to: `${emailTo}`,
      subject: "New Contact Form Submission",
      text: `New submission:\n\n${JSON.stringify(body, null, 2)}`,
    });

    if (error) {
      throw new Error(error.message);
    }
    emailStatus = "success";
    console.log("Email sent successfully");
  } catch (err: unknown) {
      if (err instanceof Error) {
        emailStatus = `error: ${err.message}`;
        console.error("Email send error:", err);
      } else {
        emailStatus = "error: unknown error";
        console.error("Email send error:", err);
      }
  }

  return NextResponse.json({
    ok: sheetStatus === "success" && emailStatus === "success",
    sheetStatus,
    emailStatus,
  });
}
