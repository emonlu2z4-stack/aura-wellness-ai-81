-- Create progress-photos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('progress-photos', 'progress-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own photos
CREATE POLICY "Users can upload progress photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to view their own photos
CREATE POLICY "Users can view own progress photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete own progress photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create table to track before/after photo pairs
CREATE TABLE public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'before',
  taken_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress photos"
ON public.progress_photos FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress photos"
ON public.progress_photos FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress photos"
ON public.progress_photos FOR DELETE TO authenticated
USING (auth.uid() = user_id);