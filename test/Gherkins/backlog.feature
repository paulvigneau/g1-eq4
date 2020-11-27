Feature : Fonctionnalités de la page backlog d'un projet
    cf(US)
    Fonctionnalités diverses et variées de la page backlog d'un projet de l'application.

    #labelAfterSprintDeletion
    Scenario : L'utilisateur supprime un sprint qui contenait des user stories
        Given L'utilisateur est sur la page backlog d'un projet
        And Sur la page il y a un sprint à venir
        And Ce sprint contient des user stories
        When Il clique sur le bouton "Surpprimer" à côté du sprint
        Then Le sprint disparaît de la page
        And Toutes les user stories que contenait le sprint sont dans la section backlog
        And Toutes ces user stories ont un label "sprint supprimé"

    #deleteLabelWhenMovingUS
    Scenario : L'utilisateur ajoute une user story ayant un label a un sprint
        Given L'utilisateur est sur la page backlog d'un projet
        And Il y a une user story avec un label "sprint supprimé" dans la section backlog
        And Il y a au moins un sprint à venir sur la page
        When Il drag and drop l'user story avec le label dans un sprint à venir
        Then Le label de l'user story disparaît
