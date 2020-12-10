# Documentation Utilisateur

## Version

Pour commencer, dirigez-vous sur votre navigateur favori, et écrivez l'URL suivante : http://localhost:3000/

A partir de la page que vous voyez, vous pouvez cliquer d'ores et déjà sur le bouton "Nouveau projet", et vous avez ensuite une pop-up affichée vous demandant les informations suivantes :

- Le nom du projet
- Sa description
- Sa date de début
- Sa date de fin

Deux éléments à prendre en compte :

- Vous ne pouvez créer un projet que si sa date de début se situe après la date d'aujourd'hui.
- Vous devez rester cohérent lorsque vous validez les champs date de début et date de fin (date de début avant date de fin, si on veut être logique).

Vous pouvez ensuite cliquer sur le bouton "valider" pour sauvegarder les informations que vous avez entré pour le projet, ou cliquer sur le bouton "retour" pour revenir sur la page.

Après création d'un projet, vous pouvez cliquer dessus, et accéder à la page de gestion spécifique à ce projet.

De là, vous avez accès à toutes les informations du projet que vous avez entré, y compris le sprint en cours (date d'aujourd'hui inclue dans la période du sprint en cours).
En cliquant sur un projet, vous avez également une barre de navigation, qui restera constamment effective pendant que vous serez sur votre projet.
Elle permet d'accéder aux pages suivantes :

- Accueil : http://localhost:3000/
- Projet : la page de gestion du projet actuel
- Backlog : la page des user stories du projet actuel
- Tâches : la page des tâches du projet actuel
- Tests : la page des tests du projet actuel
- Documentation : la page de la documentation du projet actuel
- Release : la page des releases du projet actuel

Seuls les 4 premiers éléments sont fonctionnels.

Depuis la page de gestion, vous avez accès à une liste de membres, que vous pourrez assigner à des tâches plus tard dans le projet. Vous pouvez donc ajouter un membre,
avec son nom, son adresse mail, et un des rôles suivants :

- Développeur, une personne pouvant être assigné qu'à des tâches de type "DEV" et "GEN".
- Testeur, une personne pouvant être assigné qu'à des tâches de type "TEST" et "GEN".
- Scrum Master.
- Product Owner.

Le membre ajouté sera notifié dans sa boîte mail qu'il a été ajouté au projet par rapport à l'adresse email que vous aurez entré.

Vous pouvez également supprimer un membre, tant qu'il n'est pas assigné actuellement à une tâche dans WIP (Work In Progress).

Ensuite, vous pouvez accéder à la page "Backlog". Depuis cette page, vous pouvez créer des User Stories, qui seront automatiquement ajoutés à la section Backlog par défaut.
Vous pouvez également créer des sprints, qui doivent par contre respecter les conditions suivantes :
- Leur période (début/fin) doit être inclue dans la période de son projet.
- Un sprint ne peut pas chevaucher la période d'un autre sprint.

Une user story créée peut ensuite être déplacée par action de glisser-déposer vers un sprint créé, afin de l'assigner à ce sprint.
Si une description est trop longue pour une user story, il est possible de laisser un temps son curseur dessus, afin de la visualiser entièrement.
L'importance d'une user story est déterminée par sa position par rapport à d'autres user stories dans un même sprint. De fait, une user story au début du listing des
user stories d'un sprint est considérée plus importante que celles en dessous d'elle, et ainsi de suite.

Une user story peut être soumise à deux actions différentes depuis la barre de paramètres (•••) à sa droite :
- Fermer l'US, uniquement si elle est dans un sprint, et uniquement si et seulement si, toutes les tâches affiliées à cette US sont à DONE.
- Modifier l'US, uniquement si aucune tâche n'est affiliée à cette US.

Pour chaque sprint futur (donc non passés, et pour un sprint qui n'est pas en cours), il est possible d'avoir un bouton "Supprimer" à droite de ce sprint. Si des user stories "normales"
sont à l'intérieur d'un sprint s'apprêtant à être supprimé, alors toutes ces user stories sont rappatriées vers la section Backlog par défaut. Chacune de ces user stories sont
annotées d'un label "Sprint supprimé" afin de les reconnaître d'autres user stories s'il y en avait déjà dans le Backlog. De fait, si on réalise une action de glisser-déposer pour une user
story annotée d'un tel label, et ce vers un autre sprint, le label disparaîtra.

Un sprint ne peut pas être supprimé si il contient une user story fermée.

Ensuite, vous pouvez accéder à la page "Tâches". Depuis cette page, vous avez accéder à trois états d'avancement différents : TODO, WIP, DONE, qui reflèteront l'état d'avancement d'une tâche.

Depuis la phase d'avancement TODO, j'ai accès à un bouton "Ajouter" permettant d'afficher une pop-up de création d'une tâche. Sur celle-ci je peux :
- Entrer la description de la tâche
- Entrer un coût de la tâche (en minutes)
- Le type de la tâche : GEN, DEV ou TEST correspondant respectivement à tâche générale, de développement ou de test. (La DOD "Definition of Done" de la task, est automatiquement
prévisualisée par rapport au type de la tâche).
- La liste des membres par rapport au type de la tâche (ou possibilité de mettre Non assigné).
- Ajouter des dépendances (de quelles tâches dépend ma tâche créée)
- Ajouter des user stories (ma tâche créée répond à quelle fonctionnalité)

Après création d'une tâche, il existe deux cas de figure :
- La tâche a un membre assigné, elle passe directement à la phase d'avancement WIP.
- La tâche n'a pas de membre assigné, elle est dans TODO.

Une tâche dans la phase d'avancement TODO est totalement modifiable. Tout est possible, hormis de pouvoir cocher la checklist de la DOD.

Une tâche dans la phase d'avancement WIP n'est plus modifiable, sauf :
- L'assignation d'un autre membre (remplacement, suppression de membre).
- Possibilité de cocher les éléments de la checklist.

Si tous les éléments de la checklist d'une tâche sont cochées, et si les tâches dont dépend la tâche sont à DONE, alors cette tâche est à DONE.

Un membre ne peut être assigné qu'à une seule tâche à la fois.