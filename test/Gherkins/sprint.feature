Feature : Fonctionnalités liées aux sprints
    cf(US)
    Fonctionnalités diverses et variées liées à la gestion des sprints.

    #slideUS
    Scenario : L'utilisateur déplace un sprint avec un drag and drop
        Given L'utilisateur est sur la page backlog d'un projet
        When Il "drag" une US depuis un sprint
        And Il "drop" cette US dans un autre sprint ou dans le backlog
        Then Le sprint n'est plus dans le sprint dans lequel il était au départ de l'action
        And Il est à présent là où l'utilisateur l'a déposé

    #deleteSprintSuccess
    Scenario : L'utilisateur supprime un sprint à venir
        Given L'utilisateur est sur la page backlog d'un projet
        And Sur la page il y a des sprints à venir avec un bouton supprimé à côté
        When Il clique sur le bouton supprimé à côté d'un sprint à venir
        And Une pop-up s'affiche lui demandant une confirmation
        And Il clique sur le bouton "confirmer"
        Then La pop-up se ferme
        And Le sprint a disparu de la page
        And Toutes les user stories que contenait le sprint sont désormais dans la section backlog

    #sprintOrder
    Scenario : L'utilisateur voit tous les sprints triés par date
        Given L'utilisateur est sur la page backlog d'un projet
        When Des sprints sont créés
        Then Les sprints doivent être triés par date de début, de la plus proche à la plus lointaine

    #createSprint
    Scenario : L'utilisateur crée un nouveau sprint
        Given L'utilisateur est sur la page backlog d'un projet
        When Des il clique sur le bouton "Ajouter un sprint"
        And Une fenêtre de saisie s'affiche
        And Il rempli les champs avec des dates valides
        And Il clique sur "Valider"
        Then Un nouveau sprint s'affiche sur la page backlog
        And Les dates de ce sprint correspondent à celles entrées par l'utilisateur dans le formulaire