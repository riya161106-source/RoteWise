# RouteWise – Cyber Security Audit & Threat Model

## 1. Cyber Security Overview

RouteWise integrates practical defense-in-depth principles across its presentation, application, and data access tiers to satisfy university engineering security standards.

---

## 2. OWASP Top 10 Vulnerabilities Mitigation Matrix

| OWASP Vulnerability | Risk | RouteWise Mitigation |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized viewing/deletion of other users' searches or settings. | Row-level authorization: all search queries enforce `WHERE user_id = ? AND search_id = ?`. Users cannot view or delete foreign records. |
| **A02: Cryptographic Failures** | Plain text passwords or sensitive token leakage. | Passwords hashed using `bcrypt` (10 salt rounds with unique per-password salts). Passwords and password hashes are never returned in API responses. Environment secrets kept in `.env`. |
| **A03: Injection (SQLi & XSS)** | Malicious SQL payloads injected via location or search fields. | 100% of SQL statements execute via `mysql2` parameterized query placeholders (`?`). String inputs sanitized using `express-validator` and `escape()`. |
| **A04: Insecure Design** | Uncontrolled route query spam draining server compute or external API quotas. | Strict rate limiting via `express-rate-limit` (20 attempts/15min on auth; 100 queries/15min on route calculations). |
| **A05: Security Misconfiguration** | Insecure default headers allowing clickjacking or MIME sniffing. | `helmet()` middleware enforces Content Security Policy (CSP), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Strict-Transport-Security (HSTS). |
| **A06: Vulnerable & Outdated Components** | Exploits in third-party npm packages. | Checked dependencies, zero known high vulnerabilities in backend build (`npm audit` verified). |
| **A07: Identification & Auth Failures** | Credential brute-forcing and session hijacking. | Stateless HMAC-SHA256 JSON Web Tokens (JWT) with 24-hour expiration. Strict email normalization and format verification. |
| **A08: Software & Data Integrity Failures** | Unvalidated API payloads corrupting database state. | Multi-stage schema validation using `express-validator` verifying data types, positive mileage, and valid fuel prices. |
| **A09: Security Logging & Monitoring Failures** | Undetected intrusion or crash events. | Uptime telemetry, error handling middleware logging without exposing database credentials or internal stack traces. |
| **A10: Server-Side Request Forgery (SSRF)** | Arbitrary URL requests executed by server. | Upstream external API requests restricted to hardcoded, validated endpoints (Photon API and OSRM API). |

---

## 3. Password Hashing Specification

- **Algorithm**: Blowfish-based crypt (`bcrypt`)
- **Salt Rounds**: 10 (1,024 hashing iterations per password)
- **Work Factor**: Balanced to prevent brute-force rainbow table attacks while executing in < 100ms on the application server.

---

## 4. JWT Authorization Lifecycle

1. **Issuance**: Upon successful login or registration, the server issues a signed JWT:
   ```json
   {
     "userId": 1,
     "email": "user@example.com",
     "name": "User Name",
     "iat": 1700000000,
     "exp": 1700086400
   }
   ```
2. **Transmission**: Sent via HTTP Authorization header: `Authorization: Bearer <token>`.
3. **Verification**: `authMiddleware.js` verifies signature using `JWT_SECRET`.
4. **Expiration Handling**: When the token expires, the client API interceptor captures the 401 response, automatically purges local storage, and prompts re-login.

---

## 5. Parameterized SQL Defense

RouteWise rejects string concatenation for SQL queries:
```javascript
// SECURE: Parameterized Query
const [users] = await db.query(
  'SELECT user_id, name, email FROM users WHERE email = ?',
  [email.toLowerCase()]
);
```
Inputs are never evaluated as SQL syntax, preventing boolean-based, union-based, and error-based SQL injection attacks.
