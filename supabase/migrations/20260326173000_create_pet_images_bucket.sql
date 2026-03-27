-- Create a storage bucket for pet images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pet-images',
  'pet-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload pet images
CREATE POLICY "Authenticated users can upload pet images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pet-images');

-- Allow anyone to view pet images (public bucket)
CREATE POLICY "Anyone can view pet images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pet-images');

-- Allow users to update their own pet images
CREATE POLICY "Users can update their own pet images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'pet-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Allow users to delete their own pet images
CREATE POLICY "Users can delete their own pet images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'pet-images' AND (storage.foldername(name))[1] = auth.uid()::text);
