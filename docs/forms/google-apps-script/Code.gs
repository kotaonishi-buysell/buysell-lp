/**
 * REWORTH inquiry form -> this spreadsheet (Google Apps Script web app).
 *
 * The site's function (src/server/sheets.ts, appendViaScript) POSTs { secret, row } here, and this script adds
 * the row at the bottom of the tab. Setup: docs/forms/contact-form.md ("Google スプレッドシートに保存する").
 *
 * Needs one script property: SECRET (Project Settings > Script properties), the same text as Netlify's
 * GOOGLE_SCRIPT_SECRET. Deploy as a web app: Execute as "Me", Who has access "Anyone".
 */
// The tab the rows go to. The tab is found by its id first (the number after "gid=" in the sheet's address, so
// renaming the tab does not break this), then by its name. Set TAB_GID to null to use the name only.
const TAB_GID = 2116123203;
const TAB = 'Inquiries';
const MAX_CELLS = 40;
const MAX_CELL_LENGTH = 5000;

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('SECRET');
    if (!secret || body.secret !== secret) return reply({ ok: false, error: 'unauthorized' });

    const row = body.row;
    if (!Array.isArray(row) || row.length === 0 || row.length > MAX_CELLS ||
        row.some(function (cell) { return typeof cell !== 'string' || cell.length > MAX_CELL_LENGTH; })) {
      return reply({ ok: false, error: 'bad_row' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000); // two inquiries at the same moment must not write to the same row
    try {
      const sheet = findTab();
      if (!sheet) return reply({ ok: false, error: 'no_tab' });
      const target = sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length);
      target.setNumberFormat('@'); // plain text first, so "=..." stays text and a phone number keeps its digits
      target.setValues([row]);
    } finally {
      lock.releaseLock();
    }
    return reply({ ok: true });
  } catch (error) {
    return reply({ ok: false, error: 'exception' });
  }
}

function findTab() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (TAB_GID !== null) {
    const byId = spreadsheet.getSheets().filter(function (sheet) { return sheet.getSheetId() === TAB_GID; })[0];
    if (byId) return byId;
  }
  return spreadsheet.getSheetByName(TAB);
}

// A visit to the address in a browser: say nothing about the sheet.
function doGet() {
  return reply({ ok: false, error: 'post_only' });
}

function reply(object) {
  return ContentService.createTextOutput(JSON.stringify(object)).setMimeType(ContentService.MimeType.JSON);
}
