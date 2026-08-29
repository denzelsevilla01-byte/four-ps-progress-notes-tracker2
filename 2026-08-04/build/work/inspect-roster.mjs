import fs from "node:fs/promises";
import { FileBlob, SpreadsheetFile } from "file:///C:/Users/WINDOWS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const inputPath = "C:/Users/WINDOWS/Downloads/MOO San Fabian - Family Roster as of 31 May 2026.xlsx";
const input = await FileBlob.load(inputPath);
const workbook = await SpreadsheetFile.importXlsx(input);
const summary = await workbook.inspect({
  kind: "workbook,sheet,table,region",
  maxChars: 14000,
  tableMaxRows: 12,
  tableMaxCols: 18,
  tableMaxCellChars: 80,
});
console.log(summary.ndjson);
const sheets = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 3000 });
console.log(sheets.ndjson);
for (const name of ["Family Roster", "Sheet1"]) {
  try {
    const render = await workbook.render({ sheetName: name, autoCrop: "all", scale: 0.8, format: "png" });
    await fs.writeFile(`work/${name.replaceAll(" ", "-")}.png`, new Uint8Array(await render.arrayBuffer()));
    console.log(`RENDERED:${name}`);
    break;
  } catch {}
}
