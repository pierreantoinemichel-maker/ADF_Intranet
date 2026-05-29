# Intranet — Ateliers de France

Application intranet du groupe Ateliers de France, construite avec Next.js 14, Supabase et déployée sur Vercel.

## Stack technique

- **Frontend** : Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend / Auth / DB** : Supabase (PostgreSQL + Row Level Security)
- **Déploiement** : Vercel

## Fonctionnalités

- **Authentification** : Connexion sécurisée via Supabase Auth
- **Tableau de bord** : Actualités, statistiques, événements, accès rapide
- **Annuaire** : Répertoire des collaborateurs avec filtres par département
- **Documents** : Bibliothèque de documents par catégorie avec téléchargement

## Installation locale

```bash
npm install
cp .env.example .env.local
# Renseigner les variables Supabase dans .env.local
npm run dev
```

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `supabase/schema.sql` dans l'éditeur SQL Supabase
3. Copier l'URL et la clé anon dans `.env.local`

## Déploiement Vercel

1. Connecter le dépôt GitHub à Vercel
2. Ajouter les variables d'environnement :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Déployer

## Structure

```
src/
├── app/
│   ├── (app)/          # Pages protégées (dashboard, annuaire, documents)
│   ├── (auth)/login/   # Page de connexion
│   └── auth/callback/  # Callback Supabase OAuth
├── components/
│   └── layout/         # Sidebar, TopBar
└── lib/
    └── supabase/       # Client browser + server
supabase/
└── schema.sql          # Schéma de base de données
```
