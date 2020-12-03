# Organisation

## Nom des fichiers

Afin de rendre la lecture de l'architecture facilement compréhensible, les fichiers ont des noms bien précis en plus d'être dans des dossiers précis. Par exemple :

- projectService.js
- projectModel.js
- project.test.js

## Commits

Pour permettre une différencation des commits, les mots clé ci-dessous sont utilisé :

- TEST
- DEV
- GEN
- KANBAN

Chaque type de commit est suivi des IDs des tâches concernées.

Exemples :

- [KANBAN #50, #89] Maj tasks
- [TEST #58] Test create sprint OK
- [DEV #84][TEST #58] review createSprint services + test create sprint OK

## Dépots

Afin de contrôler les versions de l'application, deux répertoires Git sont utilisés. Un premier de [développement](https://github.com/jdakata/g1-eq4-dev) ou les développeurs font leur modifications habituelles et un second de [release](https://github.com/paulvigneau/g1-eq4-release) ou sont ajoutée les modifications à chaque fin de sprint par le biais de Pull Requests. À chaque release, un membre différent du groupe joue le rôle d'intégrateur, soit la réalisation de la Pull Request ainsi de du merge sur le dépot release.
