import sys
import subprocess
import time
import tempfile
import os
from typing import Dict, Any

class PythonSandboxRunner:
    def __init__(self, timeout_seconds: int = 15):
        self.timeout_seconds = timeout_seconds

    def execute_code(self, code: str) -> Dict[str, Any]:
        start_time = time.time()
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
            tmp.write(code)
            tmp_path = tmp.name

        try:
            process = subprocess.Popen(
                [sys.executable, tmp_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )

            stdout, stderr = process.communicate(timeout=self.timeout_seconds)
            execution_time_ms = round((time.time() - start_time) * 1000, 2)

            return {
                "success": process.returncode == 0,
                "stdout": stdout,
                "stderr": stderr,
                "execution_time_ms": execution_time_ms,
                "exit_code": process.returncode
            }
        except subprocess.TimeoutExpired:
            process.kill()
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Execution timed out after {self.timeout_seconds} seconds.",
                "execution_time_ms": self.timeout_seconds * 1000,
                "exit_code": -1
            }
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

sandbox_runner = PythonSandboxRunner()
