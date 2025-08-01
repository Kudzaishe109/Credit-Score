-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('user', 'bank_official', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  bank TEXT
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
CREATE POLICY "Users can view own role" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own role" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup and role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  user_email TEXT;
  user_role app_role;
  user_bank TEXT := NULL;
BEGIN
  user_email := NEW.email;
  
  -- Determine role based on email domain
  IF user_email LIKE '%@scorly.io' THEN
    user_role := 'admin';
  ELSIF user_email LIKE '%.co.zw' THEN
    user_role := 'bank_official';
    -- Extract bank name from email domain
    user_bank := UPPER(REPLACE(SPLIT_PART(SPLIT_PART(user_email, '@', 2), '.co.zw', 1), '-', ' '));
  ELSE
    user_role := 'user';
  END IF;
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (id, role, bank)
  VALUES (NEW.id, user_role, user_bank);
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign roles on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();