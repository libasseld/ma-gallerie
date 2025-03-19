"use client"

import { useState } from 'react';
import { images } from '@/lib/api';
import { Image } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon } from 'lucide-react';

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  albumId: string;
  onSuccess: (images: Image[]) => void;
}

export default function ImageUploadDialog({
  open,
  onOpenChange,
  albumId,
  onSuccess,
}: ImageUploadDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFiles?.length) return;

    setIsLoading(true);
    const uploadedImages: Image[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('image', selectedFiles[i]);
        formData.append('album_id', albumId);
        formData.append('title', selectedFiles[i].name);
        
        const image = await images.create(formData);
        uploadedImages.push(image);
      }

      toast({
        title: "Images ajoutées",
        description: `${uploadedImages.length} image(s) ont été ajoutées à l'album`,
      });
      
      onSuccess(uploadedImages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter les images",
      });
    } finally {
      setIsLoading(false);
      setSelectedFiles(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter des images</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="images">Sélectionner des images</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                required
              />
            </div>
            {selectedFiles && selectedFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedFiles.length} image(s) sélectionnée(s)
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !selectedFiles?.length}>
              {isLoading ? (
                "Téléchargement..."
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Télécharger
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}