
from fastapi import APIRouter, UploadFile, File, HTTPException
from src.api.session import csvSession
from src.tools.pii_masker import maskCsv

router = APIRouter()

@router.post("/upload-csv")
async def uploadCsv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only .csv files are accepted")

    raw_bytes = await file.read()
    csv_text = raw_bytes.decode("utf-8")
    lines = [l for l in csv_text.splitlines() if l.strip()]
    row_count = max(len(lines) - 1, 0)

    masked_csv, lookup = maskCsv(csv_text)
    csvSession["csv_text"] = masked_csv
    csvSession["row_count"] = row_count
    csvSession["lookup"] = lookup

    return {"status": "ok", "rows": row_count, "masked": len(lookup)}