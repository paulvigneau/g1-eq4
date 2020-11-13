Feature : Fonctionnalité de la page d'accueil
    cf(US)
    Fonctionnalités diverses et variées de la page d'acceuil de l'application.

    #displayProjects
    Scenario : L'utilisateur arrive sur la page d'accueil et voit tous les projets créés
        Given Un certain nombre de projets ont été créés (zéro ou plus)
        When Un utilisateur va sur la page d'acceuil de l'application
        Then Il doit pouvoir visualiser tous les projets créés au préalable
        And Il doit y avoir autant de projets sur la page que de projet stockés en base de données

    #createProject
    Scenario : L'utilisateur crée un nouveau projet
        Given L'utilisateur est sur la page d'accueil de l'application
        When L'utilisateur clique sur le bouton "Créer un nouveau projet"
        And Un formulaire apparaît
        And L'utilisateur remplit tous les champs
        And Il clique sur le bouton "Créer"
        Then Il y a une redirection vers la page d'acceuil
        And Le nouveau projet est visible sur la page d'accueil
        And Ses informations correspondent a celles entrées par l'utilisateur plus tôt

    #displayNonexistentProject
    Scenario : Une requête GET /projects/:id avec un id invalide est envoyée
        When Une requête GET est envoyée à l'url /projects/:id
        And L'ID du projet n'existe pas
        Then Il y a une redirection vers la page /404