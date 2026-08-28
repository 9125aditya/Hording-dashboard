-- Create flex_transactions table
CREATE TABLE IF NOT EXISTS public.flex_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('INWARD', 'OUTWARD')),
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.flex_transactions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view flex transactions
CREATE POLICY "Allow authenticated users to read flex_transactions"
    ON public.flex_transactions FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to insert flex transactions
CREATE POLICY "Allow authenticated users to insert flex_transactions"
    ON public.flex_transactions FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update flex transactions
CREATE POLICY "Allow authenticated users to update flex_transactions"
    ON public.flex_transactions FOR UPDATE
    TO authenticated
    USING (true);

-- Allow authenticated users to delete flex transactions
CREATE POLICY "Allow authenticated users to delete flex_transactions"
    ON public.flex_transactions FOR DELETE
    TO authenticated
    USING (true);
