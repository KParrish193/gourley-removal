import { google } from "googleapis";

export type SheetRow = {
  [key: string]: string;
};

export function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Sheets credentials");
  }

  return new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: SCOPES,
  });
}

export async function fetchSheetData(
  tabName: string,
  range: string
): Promise<SheetRow[]> {
  const auth = getSheetsClient();
  const sheets = google.sheets({ version: "v4", auth });
  
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) throw new Error("Missing GOOGLE_SHEET_ID env variable");
  

  const tabRange = `${tabName}!${range}`;
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
