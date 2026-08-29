from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import json

path = Path(r"C:\Users\WINDOWS\Downloads\MOO San Fabian - Family Roster as of 31 May 2026.xlsx")
ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main", "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
rel_ns = {"p": "http://schemas.openxmlformats.org/package/2006/relationships"}

with ZipFile(path) as z:
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall("m:si", ns):
            shared.append("".join(t.text or "" for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")))
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rels = ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))
    relmap = {r.attrib["Id"]: r.attrib["Target"] for r in rels.findall("p:Relationship", rel_ns)}
    out = []
    for s in wb.find("m:sheets", ns):
        name = s.attrib["name"]
        target = relmap[s.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
        if target.startswith("/"):
            sheet_path = target.lstrip("/")
        else:
            sheet_path = "xl/" + target.lstrip("./")
        root = ET.fromstring(z.read(sheet_path))
        dim = root.find("m:dimension", ns)
        rows = []
        data = root.find("m:sheetData", ns)
        if data is not None:
            for row in list(data)[:18]:
                vals = []
                for c in list(row)[:22]:
                    t = c.attrib.get("t")
                    v = c.find("m:v", ns)
                    inline = c.find("m:is", ns)
                    val = ""
                    if inline is not None:
                        val = "".join(x.text or "" for x in inline.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"))
                    elif v is not None:
                        val = v.text or ""
                        if t == "s" and val.isdigit() and int(val) < len(shared):
                            val = shared[int(val)]
                    vals.append({"cell": c.attrib.get("r"), "value": val[:120]})
                rows.append(vals)
        out.append({"name": name, "dimension": dim.attrib.get("ref") if dim is not None else None, "rows": rows})
print(json.dumps(out, ensure_ascii=False, indent=2))
