import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
BACKEND_DIR = ROOT / "backend"
DB_FD, DB_PATH = tempfile.mkstemp(suffix=".db")
os.close(DB_FD)
os.environ["DATABASE_URL"] = f"sqlite:///{Path(DB_PATH).as_posix()}"
sys.path.insert(0, str(BACKEND_DIR))

from fastapi.testclient import TestClient  # noqa: E402
from database import Base, engine  # noqa: E402
from main import app  # noqa: E402
from routes.ruta_timeline import build_ruta_timeline_records, _workbook_path  # noqa: E402


class RutaTimelineTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        Base.metadata.create_all(bind=engine)
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        engine.dispose()
        try:
            os.remove(DB_PATH)
        except OSError:
            pass

    def test_01_seed_timeline_from_workbook(self):
        items = self.client.get("/api/ruta/timeline").json()
        expected = build_ruta_timeline_records(ROOT / "MEL PROPOSAL V6.xlsx")

        self.assertEqual(len(items), len(expected))
        self.assertEqual(items[0]["codigo"], "D1.1.1.1")
        self.assertEqual(items[0]["output"], "1.1")
        self.assertEqual(items[0]["anio"], 2024)
        self.assertEqual(items[0]["mes"], "Noviembre")
        self.assertIn("entregable", items[0])
        self.assertIn("estado", items[0])

    def test_02_workbook_lookup_supports_deployed_filename(self):
        original = os.environ.get("RUTA_TIMELINE_XLSX")
        with tempfile.TemporaryDirectory() as tmp:
            deployed_path = Path(tmp) / "mel-proyecto.xlsx"
            shutil.copy2(ROOT / "MEL PROPOSAL V6.xlsx", deployed_path)
            os.environ["RUTA_TIMELINE_XLSX"] = str(deployed_path)
            try:
                self.assertEqual(Path(_workbook_path()), deployed_path)
                self.assertGreater(len(build_ruta_timeline_records(_workbook_path())), 0)
            finally:
                if original is None:
                    os.environ.pop("RUTA_TIMELINE_XLSX", None)
                else:
                    os.environ["RUTA_TIMELINE_XLSX"] = original

    def test_03_admin_only_update_all_timeline_fields(self):
        item = self.client.get("/api/ruta/timeline").json()[0]

        no_auth = self.client.patch(
            f"/api/ruta/timeline/{item['id']}",
            json={"estado": "En proceso"},
        )
        self.assertEqual(no_auth.status_code, 401)

        bad_login = self.client.post(
            "/api/ruta/login",
            json={"username": "admin", "password": "bad"},
        )
        self.assertEqual(bad_login.status_code, 401)

        login = self.client.post(
            "/api/ruta/login",
            json={"username": "admin", "password": "AdminPARES2026!"},
        )
        self.assertEqual(login.status_code, 200)
        token = login.json()["token"]

        payload = {
            "codigo": "D-TEST",
            "output": "9.9",
            "orden": 99,
            "anio": 2027,
            "mes": "Marzo",
            "entregable": "Entregable actualizado",
            "estado": "En proceso",
        }
        update = self.client.patch(
            f"/api/ruta/timeline/{item['id']}",
            json=payload,
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(update.status_code, 200)
        for key, value in payload.items():
            self.assertEqual(update.json()[key], value)
        self.assertEqual(update.json()["updated_by"], "admin")


if __name__ == "__main__":
    unittest.main()
