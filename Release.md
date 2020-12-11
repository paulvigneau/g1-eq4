# Release

## Version 0.3.0

> 11/12/2020 18h00

US réalisées : 14, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 47.
- En tant que Product Owner, je souhaite avoir un bouton de modification à côté de chaque US (•••) faisant apparaître une popup me permettant de modifier la description et la difficulté de l’US en question. Il y a un bouton pour annuler et un bouton “Valider” afin d’effectuer les modifications de l’US. Une US ne peut-être modifiée que si aucune tâche n'est liée à cette dernière.
- En tant que membre d’un projet, je souhaite - depuis la page de gestion des user-stories du projet - avoir accès à un bouton “fermer” à côté de chaque US encore ouverte. En cliquant dessus, si toutes les tasks reliées à cette US ne sont pas considérées comme “DONE”, une pop-up s’affiche avec un message d’erreur. Dans le cas où toutes les tasks sont “DONE”, l’US est grisée et il n’est plus possible d’effectuer une quelconque action sur elle. Tout ceci afin de pouvoir fermer une US et qu’elle soit considérée comme validée.
- En tant que membre d’un projet, je souhaite pouvoir cliquer sur un bouton “Ajouter une tâche” depuis la page de gestion des tâches et à partir de la phase d’avancement TODO. Une fenêtre de saisie s’affiche alors avec les champs suivants : la description de la tâche, son type ("GEN, “DEV” ou “TEST”), la ou les US liées en cliquant sur le bouton “Ajouter des US”, les tâches dont elle dépend avec le bouton “Ajouter des dépendances”, le coût estimé en heure. Je peux alors cliquer sur un bouton “Valider la création de la tâche” après avoir rempli ces champs afin de pouvoir ajouter cette tâche à la phase d’avancement TODO. La DOD de la tâche est ajoutée automatiquement sous forme de checklist par rapport au type de tâche choisi, puisque la DOD est liée au type de la tâche.
- En tant que membre du projet, je souhaite pouvoir lier des US à des tâches depuis la page de création ou de détails d’une tâche en cliquant sur le bouton “US liées”. Cela ouvre une popup avec la liste de toutes les US et en cliquant sur une US elle devient surlignée. Il est possible de cliquer sur une US surlignée pour la désélectionner. Une fois toutes les US choisies, il reste à cliquer sur “Valider” et la popup se referme afin d’afficher les US choisies dans la fenêtre de création ou de détails de la tâche.
- En tant que membre du projet, je souhaite pouvoir ajouter des dépendances à des tâches depuis la page de création ou de détails d’une tâche en cliquant sur le bouton “Gestion des dépendances”. Cela ouvre une popup avec la liste de toutes les tâches et en cliquant sur une tâche elle est surlignée. Il est possible de cliquer sur une tâche surlignée pour la désélectionner. Une fois toutes les tâches choisies, il reste à cliquer sur “Valider” et la popup se referme afin d’afficher les dépendances dans la fenêtre de création ou de détails de la tâche.
- En tant que membre d’un projet, je souhaite pouvoir visualiser à partir de la page de gestion des tâches du projet l’ensemble des tâches du projet sous forme de liste arrangées en dessous de leur phase d’avancement respectives (TODO, WORK IN PROGRESS, DONE), avec leur description et un pourcentage des éléments de DOD réalisés afin d’accéder à la page de détails d’une tâche en cliquant sur son bloc.
- En tant que membre d’un projet, je souhaite pouvoir cliquer sur une tâche depuis la page de gestion des tâches pour visualiser la page de détails d’une tâche, et par conséquent les champs suivants : son type (GEN, DEV ou TEST), sa description, sa DOD - checklist, la barre d’avancement de la DOD (pourcentage de réalisation), les dépendances sous forme de liste pour une tâche (avec leur description et l’état d’avancement dans lequel elles sont), les US liées sous forme de liste, ainsi que son coût afin de pouvoir consulter les informations de la tâche et/ou simplement les modifier.
- En tant que Product Owner, je souhaite avoir une liste déroulante de tous les membres à assigner à une tâche à partir de la page de détail d’une tâche. Il ne peut y avoir qu’un membre assigné à une tâche et un membre ne peut être assigné qu’à une seule tâche à la fois. La liste déroulante ne propose donc que les membres disponibles. De plus, un membre avec le rôle “Développeur” ne peut être assigné qu’à une tâche de type “DEV” et de même pour un “Testeur” avec une tâche de type “TEST”. Une tâche de type GEN est universelle. Il suffit de sélectionner le membre souhaité afin de l’attribuer ou de remplacer un membre déjà assigné à la réalisation de cette tâche et que la tâche soit transférée vers la phase d’avancement WORK IN PROGRESS.
- En tant que Product Owner, je souhaite avoir dans la liste déroulante des membres à assigner à un projet dans la page de détail d’une tâche, un champ - en plus des membres - intitulé “Non assignée” afin de désassigner un membre d’une tâche. Cette tâche reste néanmoins dans sa phase d’avancement mais ne peut plus être modifiée tant que qu’un nouveau membre n’est pas lié.
- En tant que membre du projet, je souhaite recevoir un mail dès que je suis assigné/désassigné d’une tâche, contenant le nom du projet, la date d’ajout et le nom de la tâche afin de m’informer que j’ai été lié/délié d’une tâche.
- En tant que développeur ou testeur assigné à une tâche, je souhaite pouvoir cocher/décocher une checkbox à côté d’un élément de la DOD - Checklist d’une tâche à partir de la page de détail de la tâche afin de pouvoir attester de la réussite/échec de cet élément et donc de l’avancement de la tâche.
- En tant que membre du projet, je souhaite que lorsque toutes les checkbox de la DOD d’une tâche sont cochées et que toutes les tâches dont elle dépend sont dans la phase d’avancement DONE, que la phase d’avancement de la tâche devienne DONE afin d’attester la réussite totale de la tâche.

### Installation

Cloner ce dépôt et lancer les commandes suivantes :

```
$> docker-compose build
$> docker-compose up
```

## Version 0.2.0

> 27/11/2020 18h00

US réalisées : 6, 7, 8, 9, 10, 11, 12, 13, 15, 16.
- En tant que nouveau membre du projet, je souhaite recevoir un mail une fois ajouté au projet contenant le nom du projet, la date d’ajout, le nom que l’on m’a donné ainsi que l’URL du projet afin de m’informer que j’ai été inclus dans le projet.
- En tant que Product Owner - dans la section "Membres du projet" de la page de gestion du projet - je souhaite que chaque élément de la liste des membres de mon projet soit accompagné d’un bouton “supprimer”. En cliquant dessus, je souhaite que si le membre correspondant n’est responsable d’aucune tâche, il soit retiré de la liste des membres de mon projet afin de le retirer de mon projet. Sinon, si des tâches lui sont assignées, je souhaite qu’un pop-up avec le message “attention ce membre est responsable d’une ou plusieurs tâches” s’affiche me demandant de confirmer la suppression de ce membre afin de ne retirer ce membre de mon projet qu’en mon âme et conscience des conséquences de cette action. Les tâches qui étaient liées à ce membre auront un label “membre supprimé”.
- En tant que membre d’un projet, je souhaite - depuis toutes les pages d’un projet, soit : “Gestion du projet”, “Backlog”, “Tâches”, “Tests”, “Documentation” et “Release” - disposer d’une barre de navigation contenant un bouton menant vers chaque page du projet afin de pouvoir aller d’une page à l’autre depuis n’importe quelle page du projet.
- En tant que membre du projet, je souhaite pouvoir - depuis la page de gestion des User Stories (US) - visualiser sous forme de liste l’ensemble de mes US avec leur ID apparent. Je souhaite que mes US soient groupées par sprint et que chaque groupe soit distinct avec en titre le nom du sprint. Je souhaite que les US n’ayant pas encore été ajoutées à un sprint soient regroupées dans un groupe générique “Backlog”. Enfin, je souhaite que les sprints soient triées par date (du premier au dernier). Tout cela afin d’avoir une vue globale sur mes US, de voir lesquelles n’ont pas encore été intégrées à des sprints, de voir l’homogénéité des sprints, etc.
- En tant que membre du projet, je souhaite pouvoir - depuis la page de gestion des User Stories (US) - cliquer sur un bouton “ajouter une US”. Une fenêtre de saisie s’affiche alors, et elle contient les champs : description et difficulté (liste déroulante avec le début de la suite de Fibonacci comme choix : 1, 2, 3 ou 5). Je peux alors cliquer sur un bouton “Valider”, afin de rajouter l’US définie par les champs que j’ai rempli à la liste de mes US qui ne sont pas encore associées à un sprint, donc dans la catégorie “Backlog”.
- En tant que membre du projet, je souhaite pouvoir - depuis la page de gestion des User Stories (US) - cliquer sur un bouton “Ajouter un sprint”. Une fenêtre de saisie s’affiche alors et contient les champs : date de début et date de fin. Je souhaite alors pouvoir cliquer sur un bouton “valider” - si l'intervalle spécifié dans les champs n’empiète pas sur l’intervalle d’un sprint déjà existant le sprint est créé sinon une fenêtre de pop-up m’informe que je ne peux pas créer de nouveau sprint dans l’intervalle choisi - afin de rajouter mon nouveau sprint sur la page de gestion des US de mon projet.
- En tant que membre du projet, - depuis la page de gestion des User Stories (US) - dans chaque groupe d’US, je souhaite pouvoir effectuer un cliquer-glisser sur les éléments de la liste d’US de ce groupe pour changer l’ordonnancement de cette liste. Je souhaite qu’une importance soit attribuée à chaque US en fonction de sa position dans la liste de sorte que plus on remonte vers le haut de la liste, plus l’importance des US est élevée. Tout cela afin d’établir un ordre de priorité entre mes US.
- En tant que membre du projet, je souhaite pouvoir - depuis la page de gestion des User Stories (US) - effectuer un glisser-déposer sur mes US pour les transférer d’une catégorie à une autre afin de pouvoir les intégrer dans un sprint. Exemple : je peux faire glisser un sprint de la catégorie “Backlog” générique (qui contient les US en attente d’être intégrée à un sprint) vers un sprint X, ou encore faire glisser une US d’un sprint à un autre pour modifier le sprint de mon US, etc.
- En tant que Product Owner, je souhaite avoir un bouton “Supprimer” à côté de chaque sprint afin de demander la suppression du sprint. S’il s’agit d’un sprint en cours ou déjà passé (référence aux dates de début et de fin du sprint), un message d’erreur s’affiche pour informer que ce n’est pas possible de supprimer. S’il s’agit d’un sprint à venir, une demande de confirmation d’affiche et si je réponds “Oui” le sprint disparaît et toutes tes US qu’il contenait se retrouve dans le Backlog (donc non assignées à un sprint) avec un label indiquant à quel sprint elles appartenaient pour les repérer.	
- En tant que Product Owner, je souhaite qu’il y ait un label à côté de chaque US ayant été placée dans le backlog suite à la suppression d’un sprint afin de pouvoir les repérer facilement et de les ré-assigner à des sprint. Ce label disparaît dès que l’US est à nouveau assignée dans un sprint.	

### Installation

Cloner ce dépôt et lancer les commandes suivantes :

```
$> docker-compose build
$> docker-compose up
```

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