"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
          setFileName(file.name);
          onImageSelect(file);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeImage = () => {
    setPreview(null);
    setFileName(null);
    onImageSelect(null);
  };

  if (preview) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-border">
        <div className="relative aspect-video w-full">
          <Image
            src={preview}
            alt="Upload preview"
            fill
            className="object-contain bg-muted/50"
          />
        </div>
        <div className="flex items-center justify-between border-t border-border bg-background p-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {fileName}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50 hover:bg-muted/50"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Upload className="h-7 w-7 text-primary" />
        </div>
        <p className="font-medium text-foreground">
          {isDragActive ? "Drop the image here" : "Drag and drop an image"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse files
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          Supports: JPEG, PNG, WebP (max 10MB)
        </p>
      </div>
    </div>
  );
}
