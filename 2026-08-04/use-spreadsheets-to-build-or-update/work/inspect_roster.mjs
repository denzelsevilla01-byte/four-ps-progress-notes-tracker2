import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const wb = await SpreadsheetFile.importXlsx(await FileBlob.load("roster.xlsx"));
const summary = await wb.inspect({
  kind: "workbook,sheet,table,region",
  maxChars: 20000,
  tableMaxRows: 12,
  tableMaxCols: 30,
  tableMaxCellChars: 100,
});
console.log(summary.ndjson);
