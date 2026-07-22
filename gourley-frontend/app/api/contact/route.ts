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
  // generate unique submission ID per request
  const submissionId = `GTR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  
  // generate timestamp in Hawaii Time
  const timestamp = new Intl.DateTimeFormat("en-US", {
    timeZone: "Pacific/Honolulu",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
  const displayTimestamp = `${timestamp} HST`;

  const auth = getSheetsClient();
  const sheets = google.sheets({ version: "v4", auth });

  const body = await req.json();
  let sheetStatus = `pending`;
  let emailStatus = "pending";

  // Step 1: Append data to Google Sheets
  try { 
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: "Contact!A:H",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
            submissionId,
            displayTimestamp,
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
    const { error } = await resend.emails.send({
      from: `Gourley Tree Removal Site <${process.env.EMAIL_FROM}>`,
      to: `${process.env.EMAIL_TO}`,
      subject: `New Contact Form Submission: ${submissionId}`,
      replyTo: body.email,
      // TODO: format email template
      html: `
        <div style="width: 100%; padding: 4px; text-align: center;">A new inquiry has been submitted through the website</div>
        <div style="border: solid 2px black; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; min-width: 100%; border-bottom: solid 2px black;">
            <div style="width: 49%; padding: 4px;"><b>Submitted at: ${displayTimestamp}</b></div>
            <div style="width: 49%; padding: 4px; text-align: right;"><b>${submissionId}</b></div>
          </div>
          <div style="display: flex; justify-content: space-between; min-width: width: 100%">
            <div style="width: 49%; padding: 4px; border-right: 2px solid black;">E-mail: ${body.email}</div>
            <div style="width: 49%; padding: 4px;">Phone: ${body.phone}</div>
          </div>
          <div style="padding: 4px; border-top: solid 2px black; border-bottom: solid 2px black;">Customer Name: ${body.firstName} ${body.lastName}</div>
          <div style="padding: 4px;">Job Type: ${body.jobType}</div>
          <div style="padding: 4px; min-height: 300px; border-top: solid 2px black;">Description: ${body.description}</div>
        </div>`
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
