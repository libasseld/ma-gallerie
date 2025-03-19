"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { albums } from '@/lib/api';
import api from '@/lib/api';
import { Album } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { PlusIcon, ImageIcon } from 'lucide-react';
import CreateAlbumDialog from '@/components/create-album-dialog';

export default function AlbumsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [userAlbums, setUserAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{title: string, description: string, variant?: 'default' | 'destructive'} | null>(null);
  const [statistics, setStatistics] = useState<{
    total_albums: number;
    total_images: number;
    albums_public: number;
    albums_private: number;
  } | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadAlbums();
    loadStatistics();
  }, [isAuthenticated, router]);

  async function loadAlbums() {
    try {
      const data = await albums.getMyAlbums();
      setUserAlbums(data);
    } catch (error) {
      setToastMessage({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les albums",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function loadStatistics() {
    try {
      const data = await albums.getStats();
      setStatistics(data);
      setTimeout(() => {
        console.log("stats", data);
      }, 2000);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Statistics Section */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{statistics.total_albums}</p>
                <p className="text-muted-foreground">Albums créés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{statistics.albums_public}</p>
                <p className="text-muted-foreground">Albums partagés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{statistics.albums_private}</p>
                <p className="text-muted-foreground">Albums privés</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{statistics.total_images}</p>
                <p className="text-muted-foreground">Images téléchargées</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mes Albums</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Nouvel Album
        </Button>
      </div>

      {toastMessage && (
        <div className={`p-4 rounded-md ${toastMessage.variant === 'destructive' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
          <h3 className="font-bold">{toastMessage.title}</h3>
          <p>{toastMessage.description}</p>
          <button 
            className="mt-2 text-sm underline" 
            onClick={() => setToastMessage(null)}
          >
            Fermer
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-48 bg-muted rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : userAlbums.length === 0 ? (
        <div className="text-center py-12">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Aucun album</h2>
          <p className="text-muted-foreground">
            Commencez par créer votre premier album
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userAlbums.map((album) => (
            <Card key={album.id} className="overflow-hidden">
              <CardContent className="p-0">
                {album.coverImage ? (
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{album.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {album.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/albums/${album.id}`)}
                >
                  Voir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <CreateAlbumDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={() => {
          loadAlbums();
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}