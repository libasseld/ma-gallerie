"use client"

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, clearAuth } = useAuth();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ImageIcon className="h-6 w-6" />
            <span className="font-bold text-xl">Galerie</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/albums">
                  <Button variant="ghost">Mes Albums</Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => clearAuth()}
                >
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Connexion</Button>
                </Link>
                <Link href="/register">
                  <Button>S'inscrire</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}