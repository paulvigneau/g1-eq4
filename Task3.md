# Task 3

Il y a 3 Definition Of Done :

- GEN :
  - La tâche a été implémentée. `I`
  - La tâche a été revue par les pairs. `R`
  - L’ensemble des ajouts ont été push sur le dépôt de développement. `P`
- DEV :
  - L’ensemble des fonctionnalités a été implémenté. `I`
  - L’ensemble des fonctionnalités a été revu par les pairs. `R`
  - L’ensemble des tests a été implémenté pour vérifier les différents scénarios d’utilisation et sont passés. `T`
  - L’ensemble des fichiers de code a été push sur le dépôt de développement. `P`
- TEST :
  - Le scénario de test a été rédigé. `S`
  - Le scénario de test a été revu par les pairs. `SR`
  - Le test a été implémenté. `I`
  - Le test a été exécuté et est passé. `T`
  - Le test a été revu par les pairs. `TR`
  - Le test a été push sur le dépôt de développement. `P`
  - Le résultat du test a été archivé. `A`

Chaque tâche a une de ces trois DOD qui lui est attribuée. Pour suivre l'évolution d'une tâche, on écrit dans la colonne DOD le nom de la DOD ainsi que les lettres de la checklist qui ont été réalisées.

Il y a 3 types de commit différents :

- TEST
- DEV
- GEN
- KANBAN

Chaque type de commit suivi des IDs des tâches concernées.

Exemples :

- [KANBAN #50, #89] Maj tasks
- [TEST #58] Test create sprint OK
- [DEV #84][TEST #58] review createSprint services + test create sprint OK

| ID | Description | Coût (durée/homme) | US liées | Dépendances | Phase d’avancement | DOD | Développeur |
|:-:|-|-|:-:|:-:|:-:|:-:|:-:|
| #107 | Ajouter un bouton “fermer l’US” pour chaque US dans les fichiers sprint.ejs et backlog.ejs. Quand on clique dessus, une requête PUT /projects/:id/backlog/:sprintId/:uId/close est envoyée. La page est rechargée si le status code de la réponse est 200. Dans le cas où le status code de la réponse est 400, une alerte s’affiche avec le message d’erreur récupéré dans la réponse. | 30min | US47 | #53, #56 | DONE | DEV I-P-R-T | Alexandre |
| #108 | Créer la route PUT /projects/:id/backlog/:sprintId/:uId/close dans le fichier routes/backlog-routes.js qui appelle la fonction closeUserStory du fichier /services/user-story. En cas d’erreur le status code 400 est envoyé avec un message d’erreur. Sinon c’est le status code 200 qui est envoyé. | 30min | US47 | #1 | DONE | DEV I-P-R-T | Alexandre |
| #109 | Créer une fonction closeUserStory dans le fichier /services/user-story qui attribue le statut “Closed” à une US à condition qu'elle ne soit pas dans la section backlog. | 1h | US47 | #108, #107 | DONE | DEV I-P-R-T | Alexandre |
| #110 | Dans la fonction closeUserStory, ajouter le fait qu'il faille vérifier que toutes les tâches potentionnellement liées à l'US soient à DONE avant de pouvoir rendre la fermeture de l'US effective. Si ce n'est pas le cas, afficher un message d'erreur expliquant qu'il est impossible de fermer l'US tant que X tâches n'ont pas été basculés à DONE. | 1h | US47 | #109 | TODO | DEV | / |
| #111 | Ajouter un bouton "Modifier" dans le fichier backlog.ejs et dans le fichier sprint.ejs pour le dropdown de chaque US afin d'ouvrir une pop-up de modification contenant la description et la difficulté actuelles de l'US à modifier. Un bouton "Appliquer les modifications" sera également à créer. | 1h | US14 | / | TODO | DEV | / |
| #112 | Ajouter un attribut "parent" au fichier model des user stories. | 10min | US14 | / | TODO | DEV | / |
| #113 | Ajouter une fonction modifyUS(USid, description, difficulty) dans services/user-story.ejs permettant de créer une user story dans la base de données dont le "parent" serait l'US avec l'id en paramètre. Cette dernière, d'ailleurs, est gelée, et aucune action n'est possible dessus. | 30min | US14 | / | TODO | DEV | / |
| #114 | Dans le fichier routes/backlog-routes.js, ajouter une route /:USid/modify permettant d'appeler la fonction modifyUS. | 30min | US14 | / | TODO | DEV | / |
| #115 | Ajouter dans les fichiers sprint.ejs et backlog.ejs le fait qu'il soit possible d'afficher les US filles à la suite d'une modification sous forme d'escalier de successeurs. | 30min | US14 | / | TODO | DEV | / |
| #116 | Ajouter un test sélénium dans backlog.test.js permettant de lancer le scénario de modification d'une US. Il faut avoir une US créée au préalable, cliquer sur le bouton "Modifier" du dropdown, rentrer les nouvelles modifications (description et difficulté), puis vérifier sur le backlog qu'on a bien une nouvelle US créée, liée à l'US gelée qu'on a modifié car il s'agit de son parent. | 30min | US14 | / | TODO | TEST | / |
| #117 | Créer un fichier dod.js dans model afin de pouvoir inclure les types de DOD suivantes : GEN, DEV, et TEST. Chaque type de DOD contiendra un squelette prédéfini d'ores et déjà dans la base de données dès la création d'un projet. Modifier en conséquence model/project.js pour inclure les types de DOD. | 1h | US19 | / | TODO | DEV | / |
| #118 | Créer un fichier model/task.js permettant d'avoir dans la base de données des tâches. Une tâche contient les éléments suivants : sa description (String), cost (number), type (String enum GEN DEV TEST), member (ID ?), dependencies(String [ ]), usLinked (String [ ]), status(String enum TODO WIP DONE). Modifier le fichier model/project.js pour ajouter en conséquence dans "management" la partie task. | 30min | US19 | / | TODO | DEV | / |
| #119 | Modifier le fichier tasks.ejs afin d'inclure un bouton d'ajout de tâche dans la phase d'avancement TODO qui permet d'afficher une pop-up de création d'une tâche (new-task.ejs). Elle contiendra les éléments suivants : 
         • La description de la tâche 
         • Le coût estimé de la tache 
         • Le type de la tâche (GEN, DEV ou TEST dans une liste déroulante)
         • Il est possible, ou non d'assigner un développeur uniquement si le type de la tâche a été choisi (donc si DEV choisi, liste déroulante des membres avec le rôle "Développeur").
         • Ajouter des dépendances de tâches.
         • Ajouter des US. | 30min | US19 | / | TODO | DEV | / |
| #120 | Dans le fichier services/tasks.js, ajouter la fonction addTask(projectId, description, type, cost, member, dependancies[ ], usLinked [ ]) permettant d'ajouter une tâche dans la base de données et ce dans la phase d'avancement TODO. | 30min | US19 | / | TODO | DEV | / |
| #121 | Dans le fichier routes/tasks-routes.js, ajouter une route /tasks/add-task appelant la fonction addTask. | 30min | US19 | / | TODO | DEV | / |
| #122 | Créer un test sélénium dans le fichier E2E/tasks.test.js permettant, depuis la page des tasks, de créer une task en cliquant sur le bouton "Ajouter une tâche" depuis la phase d'avancement TODO. Remplir les différents éléments de la création de la tâche, et vérifier si la création s'est bien effectuée par la suite par rapport à l'affichage. | 30min | US19 | / | TODO | TEST | / |
| #123 | Dans les fichiers new-task.ejs et view-task.ejs, inclure une pop-up qui s'affiche dès lors qu'on appuie sur un bouton "Ajouter des US". Elle contient l'ensemble des US du projet, et il est possible de sélectionner les US que l'on veut lier à la tâche qui s'apprête à être créer/qui a été choisie. Si sélectionnée, une US est simplement surlignée. Puis cliquer sur Valider et vérifier que les US sont bien liées à la tâche. | 30min | US20 | / | TODO | DEV | / |
| #124 | Dans le fichier services/tasks.js, ajouter une fonction linkUsToTask(taskID, USList) permettant d'ajouter des US dans la base de données à la liste des US d'une tâche. | 30min | US20 | / | TODO | DEV | / |
| #125 | Dans le fichier routes/tasks-routes.js, ajouter une route tasks/:taskId/linkUs appelant la fonction linkUsToTask. | 30min | US20 | / | TODO | DEV | / |
