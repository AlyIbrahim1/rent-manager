-- Run this in the Supabase SQL Editor extension to clean up expired isolated dev sessions.
-- This removes the tenant, and cascade deletes associated renters/leases/payments/receipts.

-- Preview affected sessions
SELECT session_id, tenant_id, created_at, expires_at
FROM dev_sessions
WHERE expires_at <= NOW()
ORDER BY expires_at ASC;

-- Delete expired sessions and tenants
BEGIN;
WITH expired AS (
  SELECT session_id, tenant_id
  FROM dev_sessions
  WHERE expires_at <= NOW()
)
DELETE FROM tenants t
USING expired e
WHERE t.id = e.tenant_id;
COMMIT;
