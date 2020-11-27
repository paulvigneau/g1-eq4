Feature : Fonctionnalités liées aux user stories
    cf(US)
    Fonctionnalités diverses et variées liées à la gestion des user stories.

    #displayUS
    Scenario : L'utilisateur visualise les informations d'une user stories
        Given L'utilisateur est sur la page backlog d'un projet
        And Il y a au moins une user stories sur la page
        Then Il doit pouvoir voirl l'ID, la description et la difficulté de toute user story affichées sur la page.

    #addUserStory
    Scenario : L'utilisateur crée une nouvelle user story
        Given L'utilisateur est sur la page backlog d'un projet
        When Il clique sur le bouton "Ajouter une US"
        And Une fenêtre de saisie s'affiche
        And Il clique sur le bouton "Ajouter" sans remplir les champs
        Then Une pop-up s'affiche lui demandant de remplir les champs vides
        And Il peut remplir les champs
        And Il peut cliquer sur le bouton "Ajouter"
        And La pop-up se fermera
        And Une nouvelle user story correspondant aux champs qu'il a rempli se visible sur la page
        And Elle sera dans la section backlog
