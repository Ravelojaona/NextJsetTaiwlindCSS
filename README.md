This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Description
Application de gestion de tâches (To-Do List) construite avec Next.js 14, Prisma, NextAuth v5 et shadcn/ui. Elle inclut un système d'authentification, la gestion des tâches avec priorités, dates d'échéance et catégories.

# Stack Technique
TechnologieVersionRôleNext.js14.2.35Framework React (App Router)TypeScript^5Typage statiqueTailwind CSS^3.4.1Stylingshadcn/uilatestComposants UIPrisma^5.22.0ORM base de donnéesNextAuthv5 betaAuthentificationZod^4.3.6Validation des formulairesReact Hook Form^7.71.1Gestion des formulairesbcryptjs^3.0.3Hashage des mots de passedate-fns^4.1.0Manipulation des dateslucide-react^0.569.0Icônes

# Prérequis

Node.js >= 18.17.0
npm >= 9
MySQL (base de données utilisée dans ce projet)
Un client MySQL : MySQL Workbench, TablePlus ou via terminal


# Préparer la base de données MySQL
Avant toute chose, créez la base de données MySQL qui sera utilisée par Prisma.
Via le terminal MySQL :
sqlCREATE DATABASE `todo-app`;
Via MySQL Workbench ou TablePlus :

# Créez une nouvelle base de données nommée todo-app.


# Installation depuis zéro (recréer le projet)

Ces commandes servent à recréer le projet from scratch.
Si vous clonez ce dépôt, allez directement à la section "Cloner et lancer le projet".


# Étape 1 — Créer le projet Next.js
# npx create-next-app@14 to-do-list-app

# Étape 2 — Naviguer dans le projet
# cd to-do-list-app

# Étape 3 — Installer les dépendances principales
# npm install @auth/prisma-adapter @prisma/client next-auth@beta zod react-hook-form @hookform/resolvers lucide-react date-fns clsx tailwind-merge

# Étape 4 — Installer les dépendances de développement
# npm install -D prisma

prisma (CLI) est une dépendance de développement. Elle sert à générer les migrations, le client et le schéma. En production, seul @prisma/client est nécessaire.


# Étape 5 — Initialiser Prisma
# npx prisma init

Cette commande :

Crée le dossier prisma/ avec le fichier schema.prisma
Ajoute un fichier .env avec la variable DATABASE_URL


# Étape 6 — Configurer les variables d'environnement
Modifier le fichier .env à la racine du projet :
# .env
DATABASE_URL="mysql://root:votre_mot_de_passe@localhost:3306/todo-app"
AUTH_SECRET="votre_secret_très_long_généré_aléatoirement"

# Remplacez root et votre_mot_de_passe par vos identifiants MySQL réels.

Générer AUTH_SECRET :
# openssl rand -base64 32

# Étape 7 — Configurer le provider MySQL dans Prisma

Dans prisma/schema.prisma, remplacez le provider par défaut (postgresql) par mysql :
prismadatasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}


# Étape 8 — Initialiser et configurer shadcn/ui

# npx shadcn@latest init

Cette commande génère le fichier components.json et configure automatiquement tailwind.config.ts et app/globals.css.


# Étape 9 — Installer les composants shadcn/ui
# npx shadcn@latest add button input label card badge dialog form select textarea toast dropdown-menu table tabs avatar

# Étape 10 — Créer et appliquer les migrations Prisma
# npx prisma migrate dev --name init
Cette commande :

# Lit le schema.prisma
Crée un fichier de migration SQL dans prisma/migrations/
Applique la migration à la base de données todo-app
Génère automatiquement le client Prisma


# Étape 11 — (Re)générer le client Prisma
# npx prisma generate

À relancer après chaque modification du fichier prisma/schema.prisma.


# Cloner et lancer le projet
1. Cloner le dépôt
# git clone https://github.com/Ravelojaona/NextJsetTaiwlindCSS.git

2. Installer toutes les dépendances
# npm install

3. Créer la base de données MySQL
# sqlCREATE DATABASE `todo-app`;

5. Configurer les variables d'environnement
# cp .env.example .env

Éditer .env :
DATABASE_URL="mysql://root:votre_mot_de_passe@localhost:3306/todo-app"
AUTH_SECRET="votre_secret_généré"

Générer AUTH_SECRET :
openssl rand -base64 32

6. Appliquer les migrations et générer le client Prisma
# npx prisma migrate dev
# npx prisma generate

7. Lancer le serveur de développement
# npm run dev
L'application est disponible sur http://localhost:3000.


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
