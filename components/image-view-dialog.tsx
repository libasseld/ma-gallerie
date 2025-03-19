"use client"

import { Image } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ImageViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image: Image;
}

export default function ImageViewDialog({
  open,
  onOpenChange,
  image,
}: ImageViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{image.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video">
            <img
              src={image.filePath}
              alt={image.title}
              className="w-full h-full object-contain"
            />
          </div>
          {image.description && (
            <p className="text-muted-foreground">{image.description}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Ajoutée le {format(new Date(image.created_at), 'dd MMMM yyyy', { locale: fr })}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}