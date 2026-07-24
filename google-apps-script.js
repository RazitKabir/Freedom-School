const SHEET_NAME = 'Mailing List';

function doPost(e) {
  const sheet = getSheet_();
  const data = e.parameter;

  sheet.appendRow([
    new Date(),
    data.first_name || '',
    data.last_name || '',
    data.zip_code || '',
    data.mobile_number || '',
    data.email || '',
    data.local_updates || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Timestamp',
      'First Name',
      'Last Name',
      'Zip Code',
      'Mobile Number',
      'Personal Email',
      'Local Office Updates'
    ]);
  }

  return sheet;
}
