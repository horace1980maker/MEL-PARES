import os
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
from database import engine  # noqa: E402
from main import app  # noqa: E402
from routes.mel_proyecto import build_mel_proyecto_records  # noqa: E402


class MelProyectoTestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        engine.dispose()
        try:
            os.remove(DB_PATH)
        except OSError:
            pass

    def test_seed_summary_and_incomplete_indicator(self):
        items = self.client.get("/api/mel-proyecto").json()
        summary = self.client.get("/api/mel-proyecto/resumen").json()
        expected = build_mel_proyecto_records(ROOT / "MEL PROPOSAL V6.xlsx")
        expected_outcomes = sum(1 for row in expected if row["tipo"] == "outcome")
        expected_outputs = sum(1 for row in expected if row["tipo"] == "output")
        expected_incomplete = sum(1 for row in expected if row["estado_fuente"] == "incompleto")

        self.assertEqual(len(items), len(expected))
        self.assertEqual(summary["total_indicadores"], len(expected))
        self.assertEqual(summary["outcomes"], expected_outcomes)
        self.assertEqual(summary["outputs"], expected_outputs)
        self.assertEqual(summary["incompletos"], expected_incomplete)
        self.assertTrue(any(item["estado_fuente"] == "incompleto" for item in items))
        self.assertIn("herramienta", items[0])
        self.assertIn("fuente_informacion", items[0])
        self.assertIn("notas", items[0])

    def test_admin_only_login_and_update(self):
        items = self.client.get("/api/mel-proyecto").json()
        indicator_id = items[0]["id"]

        bad_login = self.client.post(
            "/api/mel-proyecto/login",
            json={"username": "adel", "password": "bad"},
        )
        self.assertEqual(bad_login.status_code, 401)

        no_auth = self.client.patch(
            f"/api/mel-proyecto/{indicator_id}",
            json={"porcentaje_avance": 0.33},
        )
        self.assertEqual(no_auth.status_code, 401)

        login = self.client.post(
            "/api/mel-proyecto/login",
            json={"username": "admin", "password": "AdminPARES2026!"},
        )
        self.assertEqual(login.status_code, 200)
        self.assertEqual(login.json()["role"], "admin")

        token = login.json()["token"]
        update = self.client.patch(
            f"/api/mel-proyecto/{indicator_id}",
            json={"porcentaje_avance": 0.33, "notas": "Nota de prueba"},
            headers={"Authorization": f"Bearer {token}"},
        )
        self.assertEqual(update.status_code, 200)
        self.assertEqual(update.json()["porcentaje_avance"], 0.33)
        self.assertEqual(update.json()["notas"], "Nota de prueba")

    def test_filter_and_xlsx_export(self):
        outcomes = self.client.get("/api/mel-proyecto", params={"tipo": "outcome"}).json()
        export = self.client.get("/api/mel-proyecto/export", params={"tipo": "outcome"})
        expected = build_mel_proyecto_records(ROOT / "MEL PROPOSAL V6.xlsx")
        expected_outcomes = sum(1 for row in expected if row["tipo"] == "outcome")

        self.assertEqual(len(outcomes), expected_outcomes)
        self.assertEqual(export.status_code, 200)
        self.assertEqual(
            export.headers["content-type"],
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        self.assertEqual(export.content[:2], b"PK")


if __name__ == "__main__":
    unittest.main()
