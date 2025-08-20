import { google } from "googleapis";

export type SheetRow = {
  [key: string]: string;
};

const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const privateKey =  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const spreadsheetId = process.env.GOOGLE_SHEET_ID;
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: SCOPES,
});

const sheets = google.sheets({ version: "v4", auth });

export async function fetchSheetData(
  tabName: string,
  range: string
): Promise<SheetRow[]> {

  if (!spreadsheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID env variable');
  }

  const tabRange = `${tabName}!${range}`
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: tabRange,
  });

  const rows = res.data.values;
  if (!rows || rows.length === 0) return [];

  const headers = rows[0];
  const dataRows = rows.slice(1);

  return dataRows.map((row) => {
    const obj: SheetRow = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
}

// helper function to post data to GoogleSheets Contact tab
export async function appendToSheet(values: string[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: "Contact!A:G", // Adjust range based on your sheet layout
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });
}
