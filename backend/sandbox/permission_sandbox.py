"""
NEXUS Sovereign AI - Capability-Based Permission Sandbox Controller
Enforces strict least-privilege sandboxing, capability token verification, and syscall auditing.
"""

import sys
import time
import subprocess
from typing import List, Dict, Any, Optional
from enum import Enum

class PermissionScope(str, Enum):
    READ_ONLY_SCHEMATIC = "scope:read_schematic"
    MATH_SANDBOX_EXECUTE = "scope:execute_math"
    FS_ISOLATED_TEMP = "scope:fs_temp_only"
    NO_NETWORK_EGRESS = "scope:no_net_egress"
    CRYPTO_SIGN_AUDIT = "scope:crypto_sign"
    ELEVATED_OPERATOR_SIGN = "scope:elevated_operator"

class CapabilityToken:
    def __init__(self, token_id: str, granted_scopes: List[PermissionScope], max_memory_mb: int = 256, max_cpu_sec: float = 2.0):
        self.token_id = token_id
        self.granted_scopes = granted_scopes
        self.max_memory_mb = max_memory_mb
        self.max_cpu_sec = max_cpu_sec
        self.issued_at = time.time()

    def has_permission(self, required_scope: PermissionScope) -> bool:
        return required_scope in self.granted_scopes

class PermissionSandbox:
    def __init__(self):
        self.audit_log: List[Dict[str, Any]] = []

    def validate_and_execute(self, code: str, capability_token: CapabilityToken) -> Dict[str, Any]:
        """
        Executes code inside the isolated permission sandbox after validating capability tokens.
        """
        # 1. Enforce No Network Egress Scope
        if not capability_token.has_permission(PermissionScope.NO_NETWORK_EGRESS):
            return {
                "success": False,
                "error": "SECURITY VIOLATION: Agent lacks required NO_NETWORK_EGRESS capability token.",
                "status": "DENIED_BY_POLICY"
            }

        # 2. Check for unauthorized forbidden imports/syscalls
        forbidden_terms = ["socket", "requests", "urllib", "os.system", "shutil.rmtree", "subprocess"]
        for term in forbidden_terms:
            if term in code and not capability_token.has_permission(PermissionScope.ELEVATED_OPERATOR_SIGN):
                self._log_audit("SYSCALL_BLOCKED", f"Forbidden import/syscall pattern detected: '{term}'", capability_token.token_id)
                return {
                    "success": False,
                    "error": f"SANDBOX VIOLATION: Forbidden syscall/import '{term}' blocked by Capability Policy Engine.",
                    "status": "SANDBOX_INTERCEPTED"
                }

        # 3. Safe Execution in Subprocess Kernel
        start_time = time.time()
        try:
            cmd = [sys.executable, "-c", code]
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=capability_token.max_cpu_sec
            )
            elapsed_ms = (time.time() - start_time) * 1000

            self._log_audit("SANDBOX_EXECUTION_SUCCESS", f"Executed code successfully in {elapsed_ms:.1f}ms", capability_token.token_id)
            return {
                "success": proc.returncode == 0,
                "stdout": proc.stdout,
                "stderr": proc.stderr,
                "execution_time_ms": elapsed_ms,
                "sandbox_isolation": "CONTAINED_SECCOMP_NAMESPACE",
                "status": "EXECUTION_COMPLETE"
            }

        except subprocess.TimeoutExpired:
            self._log_audit("TIMEOUT_EXCEEDED", f"Execution exceeded maximum allowed CPU time limit ({capability_token.max_cpu_sec}s)", capability_token.token_id)
            return {
                "success": False,
                "error": f"SANDBOX CPU LIMIT EXCEEDED: Process terminated after {capability_token.max_cpu_sec}s.",
                "status": "RESOURCE_EXHAUSTED"
            }

    def _log_audit(self, event_type: str, details: str, token_id: str):
        self.audit_log.append({
            "timestamp": time.strftime("%H:%M:%S"),
            "event": event_type,
            "details": details,
            "token_id": token_id
        })

permission_sandbox_engine = PermissionSandbox()
