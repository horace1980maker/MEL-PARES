#!/bin/bash
# Startup script: import xlsx data if DB is empty, then start the server.

echo "[MEL-PARES] Starting up..."

# Run import if the database is empty (no indicators yet)
INDICATOR_COUNT=$(python -c "
from database import engine
from sqlalchemy import text
try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT COUNT(*) FROM indicadores'))
        print(result.scalar())
except:
    print(0)
" 2>/dev/null)

echo "[MEL-PARES] Current indicators in DB: $INDICATOR_COUNT"

if [ "$INDICATOR_COUNT" = "0" ] || [ "$INDICATOR_COUNT" = "" ]; then
    echo "[MEL-PARES] Empty database detected. Importing xlsx data..."
    if [ -f /app/data.xlsx ]; then
        python import_xlsx.py --xlsx /app/data.xlsx --reset
        echo "[MEL-PARES] Import complete."
    else
        echo "[MEL-PARES] No xlsx file found at /app/data.xlsx. Running seed instead..."
        python seed.py
    fi
else
    echo "[MEL-PARES] Database already has data. Skipping import."
fi

# Start the server
echo "[MEL-PARES] Starting uvicorn..."
exec uvicorn main:app --host 0.0.0.0 --port 8000
