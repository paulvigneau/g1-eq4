Feature : Fonctionnalité de la page project
    cf(US)
    Fonctionnalités diverses et variées de la page project de l'application.

    #displayProject
    Scenario : L'utilisateur arrive sur la page de gestion d'un projet et voit toutes les informations importantes du projet
        Given L'utilisateur est sur la page d'accueil
        When Il clique sur un projet
        Then La page de gestion du projet s'affiche
        And L'utilisateur peut visualiser les données du projet soit :
            son nom
            sa description
            les dates de début et de fin
            le numéro du sprint en cours
            le pourcentage de tâches réalisées
            la liste des membres avec pour chacun :
                son nom
                son rôle
                son email
                sa couleur
    
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
    