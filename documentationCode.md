# Documentation Code

## Version 

L'architecture de notre projet se base sur les packages suivants :

- errors, ayant des fichiers .js permettant de définir les types d'erreurs qu'il est possible de rencontrer dans une mauvaise utilisation de l'application.
- model, contenant tous les fichiers .js représentant chacun un élément dans la base de données (en guise d'exemple, 
taskModel représentant une tâche, et ses attributs dans la base de données).
- node_modules, contenant tous les modules npm utilisés par notre projet pour le faire fonctionner.
- public :
    - javascript, contenant les fichiers .js permettant d'ajouter des fonctionnalités dans le Front.
    - jquery-ui, permettant d'utiliser la bibliothèque jquery.
    - stylesheets, l'ensemble des fichiers .css permettant de changer le style pour chaque page.
- routes, permettant d'assurer le lien entre la couche service et la couche view, régissant par conséquent les actions effectuées pour un url donné
(render de la page + fonction(s) service(s) exécutée(s)). 
- services, ou "couche de service", établit un ensemble d'opérations disponibles et coordonne la réponse de l'application à chaque opération.
- test :
    - E2E, l'ensemble des tests "End-To-End" servant à tester notre projet depuis la partie Front.
    - Gherkins, l'ensemble des scénarios d'utilisation reflétant nos tests E2E.
    - Unit, l'ensemble des test "Unitaire", testant si chaque fonction du package service remplit bien son rôle.
- views : Tous les fichiers .ejs qui représentent le contenu html que l'on verra en lançant l'application.

Ensuite à la racine de notre projets, nous avons les fichiers importants suivants :

- app.js, en quelque sorte "l'Entrypoint" de notre application, le premier point d'entrée/accès quand on lance notre projet.
- .eslintrc, le fichier ESLint régissant les conventions de codage sur lesquelles se sont accordés les membres de l'équipe du projet, afin que 
chacun puisse réaliser un code à l'aspect similaire pendant le développement du projet.
- docker-compose.yml et Dockerfile, les fichiers permettant d'intégrer Docker pour l'application (container app) 
et la base de données (ici container scrumProject utilisant l'image mongo).

Toujours à la racine du projet, nous avons les fichiers .md suivants :

- Organisation.md régissant l'ensemble des conventions de nommage de fichiers, le type de commit et donc le format attendu pour chaque commit, et pour finir 
la méthode d'organisation de développement utilisée par rapport à Git.
- Chaque fichier SprintX.md représente les User Stories planifiées pour le sprint X.
- Chaque fichier TaskX.md représente les tâches qui doivent être réalisées pour le sprint X.
- README.md, l'ensemble des User Stories rédigées au début du projet.