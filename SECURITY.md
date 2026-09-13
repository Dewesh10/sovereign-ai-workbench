# Security Policy

## 🛡️ Sovereign Air-Gap Security Model

NEXUS Sovereign AI is designed for high-consequence, air-gapped industrial facilities. All model weights, embeddings, vector stores, and evaluation kernels run locally with **zero external outbound network calls**.

---

## 🔒 Supported Versions

Only the latest release versions receive security patches and threat updates.

| Version | Supported | Security Maintenance |
| ------- | --------- | -------------------- |
| 2.0.x   | ✅ Yes     | Active               |
| 1.1.x   | ⚠️ Critical Only | Maintenance      |
| < 1.0   | ❌ No      | End of Life          |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, sandbox escape vector, or policy bypass within NEXUS Sovereign AI:

1. **Do NOT open a public GitHub issue.**
2. Submit a security advisory report directly to the repository maintainer **[@Dewesh10](https://github.com/Dewesh10)**.
3. Include detailed steps to reproduce the threat vector, sandbox syscall trace, or prompt injection payload.

### Response Timeline
- **Initial Acknowledgment**: Within 24 hours.
- **Triage & Threat Assessment**: Within 48 hours.
- **Patch Release**: Critical sandbox escapes patched within 5 business days.
