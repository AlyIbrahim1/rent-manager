-- Run this in the Supabase SQL Editor extension before enabling session-isolated dev login.

CREATE TABLE IF NOT EXISTS dev_sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  tenant_id VARCHAR(36) NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dev_sessions_expires_at ON dev_sessions (expires_at);
