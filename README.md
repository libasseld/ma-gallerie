# Ma Galerie - Documentation API

## Configuration de l'API

L'API backend est accessible à l'adresse `http://localhost:8000/api`.

## Points d'accès (Endpoints)

### Authentification

- **POST** `/api/auth/signup` - Inscription d'un nouvel utilisateur 
    - Payloads : 
      ```json
      {
        "name": "Nom Utilisateur",
        "email": "utilisateur@exemple.com",
        "password": "motdepasse"
      }
      ```
    - Réponse :
      ```json
      {
        "message": "Inscription réussie",
        "user": {
          "id": 1,
          "name": "Nom Utilisateur",
          "email": "utilisateur@exemple.com",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      }
      ```
- **POST** `/api/auth/login` - Connexion d'un utilisateur
    - Payloads : 
      ```json
      {
        "email": "utilisateur@exemple.com",
        "password": "motdepasse"
      }
      ```
    - Réponse : 
      ```json
      {
        "message": "Connexion réussie",
        "user": {
          "id": 1,
          "name": "Nom Utilisateur",
          "email": "utilisateur@exemple.com",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        },
        "token": "1|abcdefghijklmnopqrstuvwxyz123456789"
      }
      ```
### Albums

- **GET** `/api/albums` - Récupération de tous les albums
    - Réponse :
      ```json
      [
        {
          "id": 1,
          "title": "Mon Album",
          "description": "Description de l'album",
          "isPublic": true,
          "user_id": 1,
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z",
          "nbre_images": 5
        }
      ]
      ```
- **GET** `/api/albums/{id}` - Récupération d'un album spécifique
    - Réponse :
      ```json
      {
        "id": 1,
        "title": "Mon Album",
        "description": "Description de l'album",
        "isPublic": true,
        "user_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **GET** `/api/albums/my-albums` - Récupération des albums de l'utilisateur connecté (authentification requise)
    - Réponse :
      ```json
      [
        {
          "id": 1,
          "title": "Mon Album",
          "description": "Description de l'album",
          "isPublic": true,
          "user_id": 1,
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      ]
      ```
- **GET** `/api/albums/public-albums` - Récupération des albums publics (authentification requise)
- **POST** `/api/albums` - Création d'un nouvel album (authentification requise)
    - Payload :
      ```json
      {
        "title": "Mon Album",
        "description": "Description de l'album",
        "isPublic": true
      }
      ```
    - Réponse (201) :
      ```json
      {
        "id": 1,
        "title": "Mon Album",
        "description": "Description de l'album",
        "isPublic": true,
        "user_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **PUT** `/api/albums/{id}` - Mise à jour d'un album (authentification requise)
    - Payload :
      ```json
      {
        "title": "Nouveau titre",
        "description": "Nouvelle description",
        "isPublic": false
      }
      ```
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "title": "Nouveau titre",
        "description": "Nouvelle description",
        "isPublic": false,
        "user_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **DELETE** `/api/albums/{id}` - Suppression d'un album (authentification requise)
    - Réponse (204) : Pas de contenu
- **POST** `/api/albums/{id}/publish` - Publication d'un album (authentification requise)
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "title": "Mon Album",
        "description": "Description de l'album",
        "isPublic": true,
        "user_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **POST** `/api/albums/{id}/unpublish` - Masquage d'un album (authentification requise)
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "title": "Mon Album",
        "description": "Description de l'album",
        "isPublic": false,
        "user_id": 1,
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```

### Images

- **GET** `/api/albums/{album_id}/images` - Récupération des images d'un album
    - Réponse (200) :
      ```json
      [
        {
          "id": 1,
          "album_id": 1,
          "url": "http://localhost:8000/storage/images/example.jpg",
          "title": "Titre de l'image",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      ]
      ```
- **GET** `/api/images/{image_id}` - Récupération d'une image spécifique
    - Réponse (200) :
      ```json
      {
        "id": 1,
        "album_id": 1,
        "url": "http://localhost:8000/storage/images/example.jpg",
        "title": "Titre de l'image",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
      ```
- **POST** `/api/images` - Ajout d'une nouvelle image (authentification requise)
    - Requête (multipart/form-data) :
      ```
      image: [fichier image] (max: 2048 KB)
      album_id: 1
      title: "Titre de l'image" (optionnel)
      ```
    - Réponse (201) :
      ```json
      {
        "message": "Image téléchargée avec succès",
        "image": {
          "id": 1,
          "album_id": 1,
          "url": "http://localhost:8000/storage/images/example.jpg",
          "title": "Titre de l'image",
          "created_at": "2023-01-01T00:00:00.000000Z",
          "updated_at": "2023-01-01T00:00:00.000000Z"
        }
      }
      ```
- **DELETE** `/api/images/{image_id}` - Suppression d'une image (authentification requise)
    - Réponse (200) :
      ```json
      {
        "message": "Image supprimée avec succès"
      }
      ```
    - Réponse (403) si non autorisé :
      ```json
      {
        "message": "Vous n'avez pas les droits pour supprimer cette image"
      }
      ```

### Statistiques

- **GET** `/api/stats` - Récupération des statistiques
    - Réponse (200) :
      ```json
      {
        "total_albums": 1,
        "total_images": 4,
        "albums_public": 0,
        "albums_private": 1
      }
      ```

## Authentification

L'API utilise Sanctum pour laravel et JWT pour Express pour l'authentification par token. Pour les routes protégées, incluez le token d'authentification dans l'en-tête de la requête :

