Feature : Fonctionnalité de la page d'accueil
    cf(US)
    Fonctionnalités diverse et variées de la page d'acceuil de l'application.

    #visualiser tous les projets créés
    Scenario : L'utilisateur arrive sur la page d'accueil et voit tous les projets créés
        Given un certains nombre de projets ont été créés (zéro ou plus)
        When un utilisateur va sur la page d'acceuil de l'application
        Then il doit pouvoir visualiser tous les projets crées au préalable
        And il doit y avoir autant de projets sur la page que de projet stockés en base de données

    
