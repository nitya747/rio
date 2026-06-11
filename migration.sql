-- Database migration script
-- Execute this SQL code in your Supabase SQL Editor to update your database.

ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS icon_name text DEFAULT 'Home01Icon',
ADD COLUMN IF NOT EXISTS privacy text DEFAULT 'public',
ADD COLUMN IF NOT EXISTS owner text;
