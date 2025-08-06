import { google } from "googleapis";

export type SheetRow = {
  [key: string]: string;
};

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: SCOPES,
});

export async function fetchSheetData(
  tabName: string,
  range: string
): Promise<SheetRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID env variable');
  }

  const sheets = google.sheets({ version: "v4", auth });
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
