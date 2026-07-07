"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/app/admin/actions";
import Image from "next/image";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export function ImageUpload({ value, onChange, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadImage(formData);

        if (result.error) {
          toast.error(result.error);
        } else if (result.url) {
          onChange(result.url);
          toast.success("Image uploaded successfully");
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  return (
    <div className={className}>
      {value ? (
        <div className="relative aspect-video rounded-xl border border-border overflow-hidden bg-muted">
          <Image
            src={value}
            alt="Upload preview"
            fill
            className="object-contain"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            flex aspect-video cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors
            ${
              isDragOver
                ? "border-brand bg-brand/5"
                : "border-border hover:border-brand/50 hover:bg-muted/50"
            }
            ${isUploading ? "pointer-events-none opacity-60" : ""}
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 text-brand animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">
                Drop an image here or click to upload
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP up to 5MB
              </p>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
