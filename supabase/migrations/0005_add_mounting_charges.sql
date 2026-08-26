-- Add mounting_charges column to sites table
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS mounting_charges NUMERIC DEFAULT 0;
