# Release

## Version 0.1.0

> 13/11/2020 18h00

US réalisées : 1, 2, 3, 4, 5.
- En tant qu’utilisateur, je souhaite pouvoir visualiser - depuis la page d’accueil de l’application - mes projets sous forme de bloc avec leur nom afin de pouvoir accéder à la page de gestion d’un projet spécifique en cliquant sur son bloc.
- En tant qu’utilisateur, je souhaite pouvoir - depuis la page d’accueil de l’application - cliquer sur un bouton “créer un nouveau projet” pour ouvrir une fenêtre de création de projet. Cette fenêtre contient les champs : nom, description, date de début et date de fin. Je souhaite finalement pouvoir cliquer sur un bouton “Valider” afin de confirmer la création de mon nouveau projet et l’ajouter à l’ensemble de mes projets.
- En tant que membre d’un projet, je souhaite pouvoir - depuis la page d’accueil de l’application - cliquer sur mon projet afin d’accéder à sa page de gestion, d’où je pourrai visualiser les informations importantes de ce projet : son nom, ses membres, sa description, les dates de début et de fin du projet, le numéro du sprint en cours, le pourcentage de tâches réalisées.
- En tant que Product Owner, je souhaite pouvoir - depuis la page de gestion de ce projet - visualiser l'ensemble des membres du projet listé dans une section "Membres du projet" afin de pouvoir ajouter/supprimer des membres du projet.
- En tant que Product Owner, je souhaite pouvoir - depuis la section "Membres du projet" de la page de gestion du projet - cliquer sur un bouton “Ajouter un membre”. Une fenêtre de saisie apparaît alors avec les champs : nom, rôle (liste déroulante proposant les rôles : Product Owner, Testeur, Développeur), e-mail. Je souhaite ensuite pouvoir cliquer sur un bouton “valider” afin de confirmer l’ajout du membre (décrit dans les champs que j’ai rempli) au projet et de générer une couleur automatiquement qui lui sera associée.

### Installation

Cloner ce dépôt et lancer les commandes suivantes :

```
$> docker-compose build
$> docker-compose up
```
