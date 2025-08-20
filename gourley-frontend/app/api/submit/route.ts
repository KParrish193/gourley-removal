import type { NextApiRequest, NextApiResponse } from "next";
import { appendToSheet } from "../../lib/gsheet";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      timestamp,
      firstName,
      lastName,
      phone,
      email,
      jobType,
      description,
    } = req.body;

    if (!firstName || !lastName || !email || !jobType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Append to Google Sheet
    await appendToSheet(
      [timestamp, firstName, lastName, phone, email, jobType, description],
    );

    // Send notification email
    // await sendContactEmail({
    //   timestamp,
    //   firstName,
    //   lastName,
    //   phone,
    //   email,
    //   jobType,
    //   description,
    // });

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
