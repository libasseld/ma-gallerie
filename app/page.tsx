"use client"

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, ChevronRightIcon, ImagePlusIcon, UserIcon } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { albums } from '@/lib/api';
import { Album } from '@/lib/types';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Home() {
  const [publicAlbums, setPublicAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const albumsData = await albums.getAll();
        console.log("albumsData", albumsData);

        setPublicAlbums(albumsData.filter((album: Album) => album.isPublic));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 py-16">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 blur opacity-30 rounded-full" />
          <ImageIcon className="relative h-24 w-24" />
        </div>
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">
            Bienvenue sur Galerie
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Créez, partagez et découvrez des albums photos magnifiques. Une plateforme simple et élégante pour vos souvenirs.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              <ImagePlusIcon className="h-5 w-5" />
              Commencer
            </Button>
          </Link>
          <Link href="/albums">
            <Button variant="outline" size="lg" className="gap-2">
              <ChevronRightIcon className="h-5 w-5" />
              Ajouter un album
            </Button>
          </Link>
        </div>
      </div>

      

      {/* Public Albums Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Albums publics récents</h2>
          <Link href="/albums">
            <Button variant="ghost" className="gap-2">
              Ajouter un album
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted" />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="space-y-2 w-full">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : publicAlbums.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">Aucun album public</h3>
            <p className="text-muted-foreground">
              Soyez le premier à partager un album !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicAlbums.map((album) => (
              <Link key={album.id} href={`/public-albums/${album.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {album.coverImage ? (
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4">
                    <div className="space-y-1 w-full">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <div className='flex items-center justify-between gap-2 w-full'>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <UserIcon className="h-4 w-4" />
                        <span>
                          {format(new Date(album.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        <span>{album.nbre_images || 0} images</span>
                      </div>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}