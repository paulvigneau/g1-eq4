Feature : Fonctionnalités de la page d'accueil
    cf(US)
    Fonctionnalités diverses et variées de la page d'accueil de l'application.

    #displayProjects
    Scenario : L'utilisateur arrive sur la page d'accueil et voit tous les projets créés
        Given Un certain nombre de projets ont été créés (un ou plus)
        When Un utilisateur va sur la page d'accueil de l'application
        Then Il doit pouvoir visualiser tous les projets créés au préalable
        And Il doit y avoir autant de projets sur la page que de projet stockés en base de données

    #displayNonexistentProject
    Scenario : Une requête GET /projects/:id avec un id invalide est envoyée
        When Une requête GET est envoyée à l'url /projects/:id
        And L'ID du projet n'existe pas
        Then Il y a une redirection vers la page /404
