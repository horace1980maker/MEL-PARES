"""Import MEL Proyecto indicators from the project proposal Excel file.

Usage:
  python import_mel_proyecto.py --xlsx /app/mel-proyecto.xlsx
  python import_mel_proyecto.py --xlsx /app/mel-proyecto.xlsx --reset
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

parser = argparse.ArgumentParser(description="Import MEL Proyecto xlsx into MEL-PARES database")
parser.add_argument(
    "--xlsx",
    default=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "MEL PROPOSAL V6.xlsx"),
    help="Path to the MEL Proyecto xlsx file",
)
parser.add_argument("--db", default=None, help="Database URL override")
parser.add_argument("--reset", action="store_true", help="Clear only MEL Proyecto indicators before importing")
args = parser.parse_args()

if args.db:
    os.environ["DATABASE_URL"] = args.db

from database import Base, SessionLocal, engine
from models import *  # noqa: F401,F403 - register models
from routes.mel_proyecto import import_mel_proyecto_xlsx


def main():
    if not os.path.exists(args.xlsx):
        print(f"ERROR: xlsx file not found: {args.xlsx}")
        sys.exit(1)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = import_mel_proyecto_xlsx(db, args.xlsx, reset=args.reset)
        print(f"Imported {count} MEL Proyecto indicators.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
