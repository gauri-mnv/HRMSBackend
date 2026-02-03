-- HRMS: Create missing tables and add missing/partial columns
-- Run with: psql -U <user> -d <dbname> -f migrations/001_gap_tables_and_columns.sql
-- Or paste into pgAdmin / any PostgreSQL client.

-- ============================================================
-- 1. ATTENDANCE (partial) – add missing columns
-- ============================================================
ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS device_type VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS overtime_minutes INT NOT NULL DEFAULT 0;

-- ============================================================
-- 2. LEAVE_APPLICATIONS (partial) – add approval tracking
-- ============================================================
ALTER TABLE leave_applications
  ADD COLUMN IF NOT EXISTS approved_by UUID NULL,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ NULL;

-- ============================================================
-- 3. LEAVE_BALANCES (missing table)
-- ============================================================
CREATE TABLE IF NOT EXISTS leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES leave_types(leave_type_id) ON DELETE CASCADE,
  year INT NOT NULL,
  balance DECIMAL(6,2) NOT NULL DEFAULT 0,
  used DECIMAL(6,2) NOT NULL DEFAULT 0,
  credited DECIMAL(6,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, leave_type_id, year)
);

CREATE INDEX IF NOT EXISTS idx_leave_balances_emp_year ON leave_balances(employee_id, year);

-- ============================================================
-- 4. PAYROLL (missing table – in case you run SQL before app)
-- ============================================================
CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  emp_id UUID NOT NULL REFERENCES employees(emp_id) ON DELETE CASCADE,
  base_salary DECIMAL(12,2) NOT NULL,
  pay_frequency VARCHAR(20) NOT NULL DEFAULT 'monthly',
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  effective_from DATE NOT NULL,
  effective_to DATE NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payroll_emp_id ON payroll(emp_id);
