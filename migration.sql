-- Migration: add fields for actual-time billing
ALTER TABLE orders
  ADD COLUMN start_time DATETIME NULL,
  ADD COLUMN expected_end_time DATETIME NULL,
  ADD COLUMN actual_end_time DATETIME NULL,
  ADD COLUMN total_fee DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN status VARCHAR(32) DEFAULT 'RESERVED';

-- Optional: track frozen/prepaid amount
ALTER TABLE orders
  ADD COLUMN hold_fee DECIMAL(10,2) DEFAULT 0;
