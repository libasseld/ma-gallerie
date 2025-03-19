// Types pour l'authentification
export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Types pour les albums
export interface Album {
  id: string;
  title: string;
  description: string;
  userId: string;
  created_at: string;
  isPublic: boolean;
  coverImage?: string;
  imageCount?: number;
  nbre_images?: number;
}

// Types pour les images
export interface Image {
  id: string;
  albumId: string;
  title: string;
  description: string;
  filePath: string;
  created_at: string;
}

// Types pour les statistiques
export interface Stats {
  views: number;
  downloads: number;
  users: number;
  albums: number;
  images: number;
}