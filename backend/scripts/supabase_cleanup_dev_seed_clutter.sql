-- Run this in the Supabase SQL Editor extension.
-- It removes old clutter tenants created by repeated dev sample logins.
-- Safety: first query previews what will be deleted.

-- Preview candidate clutter tenants
WITH sample_tenants AS (
  SELECT r.tenant_id
  FROM renters r
  GROUP BY r.tenant_id
  HAVING COUNT(*) = 6
     AND COUNT(*) FILTER (WHERE r."appartmentNumber" IN (101, 102, 103, 201, 202, 301)) = 6
     AND COUNT(*) FILTER (WHERE r.name IN (
       'Ahmed Hassan',
       'Sarah Mohamed',
       'Omar Ali',
       'Nadia Khalil',
       'Tarek Ibrahim',
       'Laila Farouk'
     )) = 6
)
SELECT t.id, t.name, t.owner_user_id
FROM tenants t
JOIN sample_tenants s ON s.tenant_id = t.id
WHERE t.id <> '00000000-0000-0000-0000-000000000001'
ORDER BY t.id;

-- Delete candidate clutter tenants (children are removed by ON DELETE CASCADE)
BEGIN;
WITH sample_tenants AS (
  SELECT r.tenant_id
  FROM renters r
  GROUP BY r.tenant_id
  HAVING COUNT(*) = 6
     AND COUNT(*) FILTER (WHERE r."appartmentNumber" IN (101, 102, 103, 201, 202, 301)) = 6
     AND COUNT(*) FILTER (WHERE r.name IN (
       'Ahmed Hassan',
       'Sarah Mohamed',
       'Omar Ali',
       'Nadia Khalil',
       'Tarek Ibrahim',
       'Laila Farouk'
     )) = 6
)
DELETE FROM tenants t
USING sample_tenants s
WHERE t.id = s.tenant_id
  AND t.id <> '00000000-0000-0000-0000-000000000001'
RETURNING t.id;
COMMIT;
