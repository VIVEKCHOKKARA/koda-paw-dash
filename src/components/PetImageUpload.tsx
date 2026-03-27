import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Loader2, Camera, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PetImageUploadProps {
  currentImageUrl: string;
  onImageUploaded: (url: string) => void;
}

export function PetImageUpload({ currentImageUrl, onImageUploaded }: PetImageUploadProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string>(currentImageUrl || "");
  const [uploadProgress, setUploadProgress] = useState(0);

  const generateFileName = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    return `${user?.id}/${timestamp}-${randomId}.${ext}`;
  };

  const uploadFile = useCallback(async (file: File) => {
    if (!user) {
      toast({ title: "Please sign in to upload images", variant: "destructive" });
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({ title: "Invalid file type", description: "Please upload a JPEG, PNG, WebP, or GIF image.", variant: "destructive" });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 5MB.", variant: "destructive" });
      return;
    }

    // Show local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    setUploading(true);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const fileName = generateFileName(file);

      // Delete old image if it exists in our bucket
      if (currentImageUrl && currentImageUrl.includes("pet-images")) {
        const oldPath = currentImageUrl.split("pet-images/")[1];
        if (oldPath) {
          await supabase.storage.from("pet-images").remove([oldPath]);
        }
      }

      const { data, error } = await supabase.storage
        .from("pet-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      clearInterval(progressInterval);

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("pet-images")
        .getPublicUrl(data.path);

      setUploadProgress(100);
      setPreview(urlData.publicUrl);
      onImageUploaded(urlData.publicUrl);

      // Small delay to show 100% before clearing
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 600);

      toast({ title: "Image uploaded! 📸" });
    } catch (err: any) {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      setPreview(currentImageUrl || "");
      URL.revokeObjectURL(localPreview);
      toast({
        title: "Upload failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, currentImageUrl, onImageUploaded]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    // Reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    } else {
      toast({ title: "Please drop an image file", variant: "destructive" });
    }
  }, [uploadFile]);

  const removeImage = () => {
    setPreview("");
    onImageUploaded("");
  };

  const hasImage = preview && preview.length > 0;

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground mb-1 block">
        Pet Photo
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
        id="pet-image-upload"
      />

      {hasImage ? (
        /* ─── Preview State ─── */
        <div className="relative group rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/30">
          <img
            src={preview}
            alt="Pet preview"
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-white/90">Photo uploaded</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-sm text-white text-xs font-medium hover:bg-white/30 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Change
                </button>
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/30 backdrop-blur-sm text-white text-xs font-medium hover:bg-red-500/50 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          </div>

          {/* Upload Progress Overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="w-48">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-foreground">Uploading...</span>
                  <span className="text-xs font-semibold text-primary">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── Dropzone State ─── */
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 py-8 px-4",
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02] shadow-lg shadow-primary/10"
              : "border-border/60 bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <div className="w-48">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Uploading...</span>
                  <span className="text-xs font-semibold text-primary">{Math.round(uploadProgress)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                dragActive
                  ? "bg-primary/15 text-primary scale-110"
                  : "bg-muted/60 text-muted-foreground"
              )}>
                {dragActive ? (
                  <Upload className="w-6 h-6 animate-bounce" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {dragActive ? "Drop your image here" : "Upload pet photo"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Drag & drop or <span className="text-primary font-medium">browse</span>
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  JPEG, PNG, WebP, GIF · Max 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* URL fallback input */}
      <div className="flex items-center gap-2 mt-2">
        <div className="h-px flex-1 bg-border/40" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">or paste URL</span>
        <div className="h-px flex-1 bg-border/40" />
      </div>
      <input
        type="text"
        value={preview}
        onChange={(e) => { setPreview(e.target.value); onImageUploaded(e.target.value); }}
        placeholder="https://example.com/pet-photo.jpg"
        className="w-full px-3 py-2 rounded-xl bg-muted/60 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
