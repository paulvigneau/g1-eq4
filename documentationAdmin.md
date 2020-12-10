# Documentation Administrateur

## Version 

### Installation de l'application

#### Prérequis nécessaires à l'installation :

- Installer docker par rapport à votre système d'exploitation :
    - Windows : https://docs.docker.com/docker-for-windows/install/
    - Linux : https://docs.docker.com/engine/install/ubuntu/
    - Mac : https://docs.docker.com/docker-for-mac/install/
- Installer Nodejs par rapport à votre système d'exploitation : https://nodejs.org/fr/download/
- Dans le root du projet (g1-eq4-dev), installez les dépendances avec la commande : npm install

#### Processus d'installation :

Toujours dans le root, lancez la commande suivante dans le terminal : docker-compose build

#### Vérification de l'installation :

Sur le terminal, lancez les commandes suivantes successivement :
- docker start app
- docker start scrumProject
    
Si vous ne rencontrez pas d'erreur jusque-là, vérifiez si les containers que l'on a supposément lancés sont bien en état de marche, et ce avec la commande docker ps.
Vous devriez ainsi obtenir les éléments suivants sur le terminal :
- g1-eq4-dev_app (IMAGE) "docker-entrypoint.s…" (COMMAND) 0.0.0.0:3000->3000/tcp (PORTS) app (NAMES)
- mongo (IMAGE) "docker-entrypoint.s…" (COMMAND) 0.0.0.0:27017->27017/tcp (PORTS) scrumProject (NAMES)
    
Si vous avez bien les informations précédentes, vous venez de démontrer que le docker-compose build a fait son travail, et de fait, nous avons les 
containers disponibles pour mener à bien le lancement de l'application. Soit app le container représentant l'application, et scrumProject la base de données utilisant mongo.

Deux méthodes de lancement depuis le root du projet à lancer dans le terminal :
- docker-compose up pour lancer le projet depuis docker.
- node app.js pour lancer le projet localement (tout en veillant, pour ce cas-ci, à devoir réaliser docker start scrumProject au préalable).
    
En utilisant une des méthodes ci-dessus, vous pouvez ensuite vérifier que l'application est bien lancée en allant sur le lien : http://localhost:3000/
