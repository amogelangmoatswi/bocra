-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.complaints (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  category USER-DEFINED NOT NULL DEFAULT 'other'::complaint_category,
  provider text NOT NULL,
  subject text NOT NULL,
  description text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'submitted'::complaint_status,
  reference_number text NOT NULL DEFAULT ('CMP-'::text || upper(substr((gen_random_uuid())::text, 1, 8))) UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT complaints_pkey PRIMARY KEY (id),
  CONSTRAINT complaints_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.cyber_alerts (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  severity USER-DEFINED NOT NULL DEFAULT 'medium'::alert_severity,
  status USER-DEFINED NOT NULL DEFAULT 'published'::content_status,
  date_issued date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT cyber_alerts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.dashboard_datasets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  dataset_name text NOT NULL UNIQUE,
  data_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT dashboard_datasets_pkey PRIMARY KEY (id)
);
CREATE TABLE public.domain_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  domain_name text NOT NULL UNIQUE,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::domain_status,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT domain_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT domain_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.licence_applications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  licence_type USER-DEFINED NOT NULL,
  company_name text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::licence_status,
  reference_number text NOT NULL DEFAULT ('LIC-'::text || upper(substr((gen_random_uuid())::text, 1, 8))) UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT licence_applications_pkey PRIMARY KEY (id),
  CONSTRAINT licence_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.licence_types (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Infrastructure'::text,
  description text NOT NULL,
  examples text,
  icon_name text NOT NULL DEFAULT 'FileText'::text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT licence_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.news_articles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  excerpt text NOT NULL,
  content text,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::content_status,
  publish_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT news_articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  role USER-DEFINED NOT NULL DEFAULT 'user'::user_role,
  phone text,
  organisation text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.public_consultations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'published'::content_status,
  deadline date NOT NULL,
  document_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT public_consultations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.site_stats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  label text NOT NULL,
  value text NOT NULL,
  icon_name text NOT NULL DEFAULT 'FileText'::text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT site_stats_pkey PRIMARY KEY (id)
);