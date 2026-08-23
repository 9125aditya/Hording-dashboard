-- Add 'Ignored' status to enquiry_status enum if not already present
ALTER TYPE enquiry_status ADD VALUE IF NOT EXISTS 'Ignored';
