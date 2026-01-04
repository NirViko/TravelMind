-- Add new columns to profiles table
-- Run this in Supabase SQL Editor if you already created the profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS firstName TEXT,
ADD COLUMN IF NOT EXISTS lastName TEXT,
ADD COLUMN IF NOT EXISTS dateOfBirth DATE;

-- Update the trigger function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, firstName, lastName, dateOfBirth)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'firstName',
    NEW.raw_user_meta_data->>'lastName',
    (NEW.raw_user_meta_data->>'dateOfBirth')::DATE
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

