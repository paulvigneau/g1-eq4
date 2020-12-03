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
| #108 | Créer la route PUT /projects/:id/backlog/:sprintId/:uId/close dans le fichier routes/backlog-routes.js qui appelle la fonction closeUserStory du fichier services/userStoryService.js. En cas d’erreur le status code 400 est envoyé avec un message d’erreur. Sinon c’est le status code 200 qui est envoyé. | 30min | US47 | #1 | DONE | DEV I-P-R-T | Alexandre |
| #109 | Créer une fonction closeUserStory dans le fichier services/userStoryService.js qui attribue le statut “Closed” à une US à condition qu'elle ne soit pas dans la section backlog. | 1h | US47 | #108, #107 | DONE | DEV I-P-R-T | Alexandre |
| #110 | Dans la fonction closeUserStory, ajouter le fait qu'il faille vérifier que toutes les tâches potentionnellement liées à l'US soient à DONE avant de pouvoir rendre la fermeture de l'US effective. Si ce n'est pas le cas, afficher un message d'erreur expliquant qu'il est impossible de fermer l'US tant que X tâches n'ont pas été basculés à DONE. | 1h | US47 | #109 | TODO | DEV | / |
| #111 | Ajouter un bouton "Modifier" dans le fichier backlog.ejs et dans le fichier sprint.ejs pour le dropdown de chaque US afin d'ouvrir une pop-up de modification contenant la description et la difficulté actuelles de l'US à modifier. Un bouton "Appliquer les modifications" sera également à créer. | 30min | US14 | / | WIP | DEV I-P | Alexandre |
| #112 | Ajouter un attribut "parent" au fichier model des user stories. | 10min | US14 | / | WIP | DEV I-P | Alexandre |
| #113 | Ajouter une fonction modifyUS(USid, description, difficulty) dans services/userStoryService.js permettant de créer une user story dans la base de données dont le "parent" serait l'US avec l'id en paramètre. Cette dernière, d'ailleurs, est gelée, et aucune action n'est possible dessus. | 30min | US14 | / | TODO | DEV | / |
| #114 | Dans le fichier routes/backlog-routes.js, ajouter une route /:USid/modify permettant d'appeler la fonction modifyUS. | 30min | US14 | / | TODO | DEV | / |
| #115 | Ajouter dans les fichiers sprint.ejs et backlog.ejs le fait qu'il soit possible d'afficher les US filles à la suite d'une modification sous forme d'escalier de successeurs. | 30min | US14 | / | TODO | DEV | / |
| #116 | Ajouter un test sélénium dans backlog.test.js permettant de lancer le scénario de modification d'une US. Il faut avoir une US créée au préalable, cliquer sur le bouton "Modifier" du dropdown, rentrer les nouvelles modifications (description et difficulté), puis vérifier sur le backlog qu'on a bien une nouvelle US créée, liée à l'US gelée qu'on a modifié car il s'agit de son parent. | 30min | US14 | / | TODO | TEST | / |
| #117 | Créer un fichier dodModel.js dans model afin de pouvoir inclure les types de DOD suivantes : GEN, DEV, et TEST. Chaque type de DOD contiendra un squelette prédéfini d'ores et déjà dans la base de données dès la création d'un projet. Modifier en conséquence model/projectModel.js pour inclure les types de DOD. | 1h | US19 | / | TODO | DEV | / |
| #118 | Créer un fichier model/task.js permettant d'avoir dans la base de données des tâches. Une tâche contient les éléments suivants : sa description (String), cost (number), type (String enum GEN DEV TEST), member (ID ?), dependencies(String [ ]), usLinked (String [ ]), status(String enum TODO WIP DONE). Modifier le fichier model/projectModel.js pour ajouter en conséquence dans "management" la partie task. | 30min | US19 | / | TODO | DEV | / |
| #119 | Modifier le fichier tasks.ejs afin d'inclure un bouton d'ajout de tâche dans la phase d'avancement TODO qui permet d'afficher une pop-up de création d'une tâche (new-task.ejs). Elle contiendra la description, le coût estimé, le type (GEN, DEV ou TEST dans une liste déroulante) | 30min | US19 | / | TODO | DEV | / |
| #120 | Dans le fichier services/taskService.js, ajouter la fonction addTask(projectId, description, type, cost) permettant d'ajouter une tâche dans la base de données et ce dans la phase d'avancement TODO. | 30min | US19 | / | TODO | DEV | / |
| #121 | Dans le fichier routes/tasks-routes.js, ajouter une route POST projects/:projectId/tasks appelant la fonction addTask. | 30min | US19 | / | TODO | DEV | / |G
| #122 | Créer un test sélénium dans le fichier E2E/tasks.test.js permettant, depuis la page des tasks, de créer une task en cliquant sur le bouton "Ajouter une tâche" depuis la phase d'avancement TODO. Remplir les différents éléments de la création de la tâche, et vérifier si la création s'est bien effectuée par la suite par rapport à l'affichage. | 30min | US19 | / | TODO | TEST | / |
| #123 | Dans les fichiers new-task.ejs et view-task.ejs, inclure une pop-up qui s'affiche dès lors qu'on appuie sur un bouton "Ajouter des US". Elle contient l'ensemble des US du projet, et il est possible de sélectionner les US que l'on veut lier à la tâche qui s'apprête à être créer/qui a été choisie. Si sélectionnée, une US est simplement surlignée. Puis cliquer sur Valider et vérifier que les US sont bien liées à la tâche. | 30min | US20 | / | TODO | DEV | / |
| #124 | Dans le fichier services/taskService.js, ajouter une fonction linkUsToTask(taskID, USList) permettant d'ajouter des US dans la base de données à la liste des US d'une tâche. | 30min | US20 | / | TODO | DEV | / |
| #125 | Dans le fichier routes/tasks-routes.js, ajouter une route tasks/:taskId/linkUs appelant la fonction linkUsToTask. | 30min | US20 | / | TODO | DEV | / |
| # | Ajouter dans le fichier new-task.ejs un bouton "Dépendances" qui lorsque l'on clique dessus, ouvre une popup avec le contenu du fichier add-dependencies.ejs. | 15min | US21 | / | TODO | DEV | / |
| # | Créer le fichier add-dependencies.ejs qui affiche la liste de toutes les tâches (avec description et état d'avancement). Cliquer sur une tâche la sélectionne, et la fait se surligner. Cliquer sur une tâche sélectionnée, la désélectionne. Ajouter un bouton "Annuler" qui ferme la popup et un bouton "Valider" qui va aussi fermer la popup mais en gardant en mémoire les tâches sélectionnées. | 1h | US21 | / | TODO | DEV | / |
| # | Ajouter dans la page new-task.ejs le fait que le bouton de validation de la tâche ajoute la liste des dépendances dans le corps dans l'appel de la route PUT/POST /projects/:projectId/tasks. | 15min | US21 | / | TODO | DEV | / |
| # | Ajouter dans la route POST /projects/:projectId/tasks (resp. PUT) le fait de récupérer dans le corps de la requête la liste des dépendances et de les transmettre au service addTask (resp. updateTask). | 15min | US21 | / | TODO | DEV | / |
| # | Ajouter dans les fonctions addTask et updateTask de services/taskService.js un paramètre correspondant à la liste des dépendances et ajouter à la tâche concernée cette liste. | 30min | US21 | / | TODO | DEV | / |
| # | Créer le fichier kanban-panel.ejs qui va afficher un titre et une liste de tâches les unes en dessous des autres, passés en paramètres. Chaque tâche affiche sa description ainsi que le pourcentage des éléments de DOD réalisés. | 30min | US22 | / | TODO | DEV | / |
| # | Afficher dans la page tasks.ejs trois fois le fichier kanban-panel.ejs avec les titres TODO, WIP et DONE. Ces trois phases d'avancement sont alignées horizontalement. | 15min | US22 | / | TODO | DEV | / |
| # | Ajouter au fichier kanban-panel.ejs que les tâches sont cliquables. Un clic aura pour effet d'ouvrir la page new-task.ejs avec les données de la tâche passées en paramètre. | 15min | US23 | / | TODO | DEV | / |
| # | Modifier la page new-task.ejs afin de lui passer une tâche en paramètre. Si aucune tâche n'est passée, garder le comportement habituel, mais s'il y a une tâche, alors préremplir les champs avec la tâche actuelle et modifier le comportement du bouton d'ajout de tâche par un bouton de modification envoyant une requête PUT /projects/:projectId/tasks avec dans les mêmes informations que normalement dans le corps de la requête. | 45min | US23 | / | TODO | DEV | / |
| # | Créer le service updateTask dans services/taskService.js qui au même titre de addTask (cf. #120) va prendre en paramètre les informations d'une tâche mais va cettre fois-ci modifier la tâche correspondante. Donc il faut aussi passer en paramètre l'id de la tâche à éditer. | 45min | US23 | / | TODO | DEV | / |
| # | Implémenter le test du service updateTask qui vérifie que la tâche passée en paramètre est bien modifiée avec les informations souhaitées. | 30min | US23 | / | TODO | TEST | / |
| # | Ajouter la route PUT /projects/:projectId/tasks dans le fichier routes/tasks-routes.js qui tout comme la route POST du même nom, récupère les informations du corps de la requête et appelle le service updateTask. En cas d'erreur, retourner le code d'erreur correspondant, sinon, retourner 200. | 30min | US23 | / | TODO | DEV | / |
| # | Implémenter les tests de la route PUT /projects/:projectId/tasks qui vont vérifier les différents codes de retour en fonction de si la requête est complète et si la modification a bien été effectuée. | 30min | US23 | / | TODO | TEST | / |
| # | Ajouter dans le fichier new-task.ejs un champ "Membre" qui affiche une liste déroulante quand on clique dessus. Cette liste déroulante ne va afficher que les membres correspondant au type de la tâche (ex. Développeur pour le type DEV). Le type GEN peut se voir associer n'importe quel type de membre. De plus, seuls les membres qui n'ont pas encore de tâche associée sont affichés dans la liste. | 30min | US24 | / | TODO | DEV | / |
| # | Ajouter le fait que lors du clic sur le bouton de validation de la popup d'ajout/modification de tâche, le membre assigné à une tâche soit passé dans le corps de la requête envoyée. | 15min | US24 | / | TODO | DEV | / |
| # | Ajouter dans la route POST /projects/:projectId/tasks (resp. PUT) le fait de récupérer dans le corps de la requête le membre assigné et de les transmettre au service addTask (resp. updateTask). | 15min | US24 | / | TODO | DEV | / |
| # | Ajouter dans les fonctions addTask et updateTask de services/taskService.js un paramètre correspondant au membre assigné et ajouter à la tâche concernée cette liste. | 30min | US24 | / | TODO | DEV | / |
