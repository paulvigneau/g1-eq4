Feature : Fonctionnalité de la page project
    cf(US)
    Fonctionnalités diverse et variées de la page project de l'application.

    #displayProject
    Scenario : L'utilisateur arrive sur la page de gestion d'un projet et voit toutes les informations importantes du projet
        Given l'utilisateur est sur la page d'acceuil
        When il clique sur un projet
        Then la page de gestion du projet s'affiche
        And l'utilisateur peut visualiser les données du projet soit :
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
    
