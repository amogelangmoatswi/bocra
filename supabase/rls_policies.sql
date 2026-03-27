-- ============================================
-- BOCRA Domain Registrations RLS Policies
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable Row Level Security (in case it's not enabled)
ALTER TABLE public.domain_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own domain registrations
DROP POLICY IF EXISTS "Users can view own domains" ON public.domain_registrations;
CREATE POLICY "Users can view own domains" 
ON public.domain_registrations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own domain registrations
DROP POLICY IF EXISTS "Users can insert own domains" ON public.domain_registrations;
CREATE POLICY "Users can insert own domains" 
ON public.domain_registrations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all domain registrations
DROP POLICY IF EXISTS "Admins can view all domains" ON public.domain_registrations;
CREATE POLICY "Admins can view all domains" 
ON public.domain_registrations 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Policy: Admins can update all domain registrations
DROP POLICY IF EXISTS "Admins can update all domains" ON public.domain_registrations;
CREATE POLICY "Admins can update all domains" 
ON public.domain_registrations 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
