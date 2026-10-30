/**
 * AqarMath — PDF requests → Google Sheet (free).
 * Open the sheet "AqarMath — PDF requests" > Extensions > Apps Script, paste this, then
 * Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone > Deploy.
 * Copy the Web app URL and set it as LEAD_URL in app.js.
 */
function doPost(e) {
  var d = JSON.parse(e.postData.contents || '{}');
  var clip = function (v, n) { return String(v == null ? '' : v).slice(0, n || 200); };
  SpreadsheetApp.getActiveSpreadsheet().getSheets()[0].appendRow([
    new Date(), clip(d.name, 60), "'" + clip(d.phone, 20), clip(d.company, 80), clip(d.title, 60),
    clip(d.lang, 4), clip(d.unit), clip(d.real, 12), clip(d.cert, 12), clip(d.exit, 6), clip(d.hold, 10), clip(d.link, 2000)
  ]);
  return ContentService.createTextOutput('ok');
}
