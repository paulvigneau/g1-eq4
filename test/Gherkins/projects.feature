Feature : Fonctionnalité de la page d'accueil
    cf(US)
    Fonctionnalités diverse et variées de la page d'acceuil de l'application.

    #displayProjects
    Scenario : L'utilisateur arrive sur la page d'accueil et voit tous les projets créés
        Given un certains nombre de projets ont été créés (zéro ou plus)
        When un utilisateur va sur la page d'acceuil de l'application
        Then il doit pouvoir visualiser tous les projets crées au préalable
        And il doit y avoir autant de projets sur la page que de projet stockés en base de données

    #createProject
    Scenario : L'utilisateur crée un nouveau projet
        Given l'utilisateur est sur la page d'accueil de l'application
        When l'utilisateur clique sur le bouton "Créer un nouveau projet"
        And un formulaire apparait
        And l'utilisateur rempli tous les champs
        And il clique sur le bouton "Créer"
        Then il y a une redirection vers la page d'acceuil
        And le nouveau projet est visible sur la page d'acueil 
        And ses informations correspondent a celle entré par l'utilisateur plus tôt

    #displayNonexistentProject
    Scenario : Une requête GET /projects/:id avec un id invalide est envoyée
        When une requête GET est envoyé à l'url /projects/:id
        And l'id du projet n'existe pas
        Then il y a une redirection vers la page /404