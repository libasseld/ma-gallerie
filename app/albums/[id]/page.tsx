"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { albums, images } from "@/lib/api";
import { Album, Image } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  ImageIcon,
  UploadIcon,
  Trash2Icon,
  Globe2Icon,
  LockIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ImageUploadDialog from "@/components/image-upload-dialog";
import ImageViewDialog from "@/components/image-view-dialog";

export default function AlbumDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [album, setAlbum] = useState<Album | null>(null);
  const [albumImages, setAlbumImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDeleteImage, setIsConfirmDeleteImage] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadAlbumData();
  }, [isAuthenticated, params.id, router]);

  async function loadAlbumData() {
    try {
      const [albumData, imagesData] = await Promise.all([
        albums.get(params.id),
        albums.getImages(params.id),
      ]);
      setAlbum(albumData);
      setAlbumImages(imagesData);
    } catch (error: any) {
      let description = "Impossible de charger l'album";
      if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast({
        variant: "destructive",
        title: "Erreur",
        description: description,
      });
      router.push("/albums");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAlbum() {
    try {
      await albums.delete(params.id);
      toast({
        title: "Album supprimé",
        description: "L'album a été supprimé avec succès",
      });
      router.push("/albums");
    } catch (error: any) {
      let description = "Impossible de supprimer l'album";
      if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast({
        variant: "destructive",
        title: "Erreur",
        description: description,
      });
    }
  }

  async function handleDeleteImage(imageId: string) {
    try {
      await images.delete(imageId);
      setAlbumImages(albumImages.filter((img) => img.id !== imageId));
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée avec succès",
      });
    } catch (error: any) {
      let description = "Impossible de supprimer l'image";
      if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast({
        variant: "destructive",
        title: "Erreur",
        description: description,
      });
    }
  }

  async function togglePublicStatus() {
    if (!album) return;

    try {
      if (album.isPublic) {
        await albums.unpublish(params.id);
      } else {
        await albums.publish(params.id);
      }

      setAlbum({ ...album, isPublic: !album.isPublic });
      toast({
        title: album.isPublic ? "Album privé" : "Album public",
        description: `L'album est maintenant ${
          album.isPublic ? "privé" : "public"
        }`,
      });
    } catch (error: any) {
      let description = "Impossible de modifier le statut de l'album";
      if (error.response?.data?.message) {
        description = error.response.data.message;
      }
      toast({
        variant: "destructive",
        title: "Erreur",
        description: description,
      });
    }
  }

  if (!isAuthenticated || !album) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{album.title}</h1>
          <p className="text-muted-foreground">{album.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={togglePublicStatus}>
            {album.isPublic ? (
              <>
                <LockIcon className="h-4 w-4 mr-2" />
                Masquer
              </>
            ) : (
              <>
                <Globe2Icon className="h-4 w-4 mr-2" />
                Publier
              </>
            )}
          </Button>
          <Button onClick={() => setIsUploadDialogOpen(true)}>
            <UploadIcon className="h-4 w-4 mr-2" />
            Ajouter des images
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2Icon className="h-4 w-4 mr-2" />
            Supprimer l&apos;album
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-muted rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : albumImages.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Aucune image</h2>
          <p className="text-muted-foreground">
            Commencez par ajouter des images à votre album
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {albumImages.map((image) => (
            <Card
              key={image.id}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => {
                setSelectedImage(image);
                setIsViewDialogOpen(true);
              }}
            >
              <CardContent className="p-0">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(image);
                      setIsConfirmDeleteImage(true);
                    }}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                  <p className="text-white text-sm font-medium">
                    {image.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ImageUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        albumId={params.id}
        onSuccess={(newImages) => {
          loadAlbumData();
          setIsUploadDialogOpen(false);
        }}
      />

      {selectedImage && (
        <ImageViewDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          image={selectedImage}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les images de l&apos;album
              seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAlbum}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog
        open={isConfirmDeleteImage}
        onOpenChange={setIsConfirmDeleteImage}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;image sera supprimée
              définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteImage(selectedImage?.id || "")}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
