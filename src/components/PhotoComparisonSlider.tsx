import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ProgressPhoto {
  id: string;
  photo_url: string;
  label: string;
  taken_at: string;
}

function useProgressPhotos() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["progress-photos", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_photos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as ProgressPhoto[];
    },
    enabled: !!user,
  });
}

function useUploadProgressPhoto() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, label }: { file: File; label: "before" | "after" }) => {
      if (!user) throw new Error("Not authenticated");
      const fileName = `${user.id}/${label}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("progress-photos")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("progress-photos")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from("progress_photos")
        .insert({ user_id: user.id, photo_url: urlData.publicUrl, label });
      if (insertError) throw insertError;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress-photos"] }),
  });
}

function useDeleteProgressPhoto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("progress_photos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress-photos"] }),
  });
}

function UploadButton({ label, onUpload }: { label: "before" | "after"; onUpload: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/30 bg-secondary/30 p-6 hover:border-primary hover:bg-primary/5 transition-all btn-bounce w-full aspect-[3/4]"
      >
        <Camera className="h-8 w-8 text-muted-foreground" />
        <span className="text-xs font-bold text-muted-foreground capitalize">
          Upload {label}
        </span>
      </button>
    </>
  );
}

function ComparisonSlider({ beforeUrl, afterUrl }: { beforeUrl: string; afterUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border-2 border-border select-none touch-none cursor-col-resize"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After (full background) */}
      <img src={afterUrl} alt="After" className="absolute inset-0 w-full h-full object-cover" />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={beforeUrl}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ width: containerRef.current?.offsetWidth || "100%", maxWidth: "none" }}
        />
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        {/* Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg border-2 border-primary/30">
          <GripVertical className="h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-foreground/70 text-background text-[10px] font-bold backdrop-blur-sm z-20">
        Before
      </div>
      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-foreground/70 text-background text-[10px] font-bold backdrop-blur-sm z-20">
        After
      </div>
    </div>
  );
}

export function PhotoComparisonSection() {
  const { data: photos = [], isLoading } = useProgressPhotos();
  const upload = useUploadProgressPhoto();
  const deletePhoto = useDeleteProgressPhoto();

  const beforePhoto = photos.find((p) => p.label === "before");
  const afterPhoto = photos.find((p) => p.label === "after");

  const handleUpload = async (file: File, label: "before" | "after") => {
    try {
      await upload.mutateAsync({ file, label });
      toast.success(`${label === "before" ? "Before" : "After"} photo uploaded! 📸`);
    } catch {
      toast.error("Failed to upload photo.");
    }
  };

  const handleDelete = async (photo: ProgressPhoto) => {
    try {
      await deletePhoto.mutateAsync(photo.id);
      toast.success("Photo removed");
    } catch {
      toast.error("Failed to delete photo.");
    }
  };

  const hasBoth = beforePhoto && afterPhoto;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold text-foreground">Progress Photos 📸</h3>
        {hasBoth && (
          <span className="text-[10px] font-bold text-muted-foreground">← Drag to compare →</span>
        )}
      </div>

      {hasBoth ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <ComparisonSlider beforeUrl={beforePhoto.photo_url} afterUrl={afterPhoto.photo_url} />
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-bold rounded-full border-2 btn-bounce"
              onClick={() => handleDelete(beforePhoto)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Replace Before
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-bold rounded-full border-2 btn-bounce"
              onClick={() => handleDelete(afterPhoto)}
            >
              <Trash2 className="h-3 w-3 mr-1" /> Replace After
            </Button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div>
            {beforePhoto ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-border aspect-[3/4]">
                <img src={beforePhoto.photo_url} alt="Before" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-foreground/70 text-background text-[10px] font-bold">Before</div>
                <button
                  onClick={() => handleDelete(beforePhoto)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 border border-border btn-bounce"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <UploadButton label="before" onUpload={(f) => handleUpload(f, "before")} />
            )}
          </div>
          <div>
            {afterPhoto ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-border aspect-[3/4]">
                <img src={afterPhoto.photo_url} alt="After" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-foreground/70 text-background text-[10px] font-bold">After</div>
                <button
                  onClick={() => handleDelete(afterPhoto)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-card/80 border border-border btn-bounce"
                >
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ) : (
              <UploadButton label="after" onUpload={(f) => handleUpload(f, "after")} />
            )}
          </div>
        </div>
      )}

      {upload.isPending && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          Uploading...
        </div>
      )}
    </div>
  );
}
