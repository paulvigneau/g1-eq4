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