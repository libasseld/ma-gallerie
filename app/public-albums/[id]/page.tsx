"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { albums } from '@/lib/api';
import { Album, Image } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function PublicAlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAlbumAndImages() {
      try {
        if (typeof id !== 'string') return;
        
        const [albumData, imagesData] = await Promise.all([
          albums.get(id),
          albums.getImages(id)
        ]);
        
        setAlbum(albumData);
        setImages(imagesData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'album:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAlbumAndImages();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold">Album non trouvé</h1>
        <p className="text-muted-foreground mt-2">
          L'album que vous recherchez n'existe pas ou n'est pas public.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{album.title}</h1>
        {album.description && (
          <p className="text-muted-foreground mt-2">{album.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-4">
          Créé le {format(new Date(album.created_at), 'dd MMMM yyyy', { locale: fr })}
        </p>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">Aucune image</h3>
          <p className="text-muted-foreground">
            Cet album ne contient pas encore d'images.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={image.url}
                  alt={image.title || 'Image sans titre'}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium">{image.title || 'Sans titre'}</h3>
                  {image.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {image.description}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
