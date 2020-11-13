Feature : Gestion des membres
    cf(US)
    Fonctionnalités liées à  la gestion des membres d'un projet.

    #addMember
    Scenario : L'utilisateur ajoute un nouveau membre
        Given L'utilisateur est sur la page de gestion d'un projet
        When Il clique sur le bouton "Nouveau membre"
        And Un formulaire s'affiche
        And Il rempli tous les champs du formulaire
        And Il clique sur "Ajouter"
        Then Il y a une redirection vers la page de gestion du projet
        And Il peut visualiser le nouveau membre qu'il vient d'ajouter sur la page du projet
        And Les informations du membre correspondent à celle qu'il a entré dans le formulaire

    #deleteMember
    Scenario : L'utilisateur supprime un membre
        Given L'utilisateur est sur la page de gestion d'un projet
        When Il clique sur le bouton "Supprimer le membre" à côté d'un membre
        And Une pop-up apparait avec un message demandant confirmation
        And L'utilisateur clique sur le bouton "confirmer"
        Then La pop-up se ferme
        And Le membre n'est plus visible dans la liste des membre de la page de gestion du projet
    
    

