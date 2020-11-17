const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let DodSchema = new Schema({
        gen: {
            checklist : {type: [String], required: true,
                default: [
                    'La tâche a été implémentée.',
                    'La tâche a été revue par les pairs.',
                    'L’ensemble des ajouts ont été push sur le dépôt de développement.'
                ]
            }
        },
        dev: {
            checklist : {type: [String], required: true,
                default: [
                    'L’ensemble des fonctionnalités a été implémenté.',
                    'L’ensemble des fonctionnalités a été revu par les pairs.',
                    'L’ensemble des tests a été implémenté pour vérifier les différents scénarios d’utilisation et sont passés.',
                    'L’ensemble des fichiers de code a été push sur le dépôt de développement.'
                ]
            }
        },
        test: {
            checklist : {type: [String], required: true,
                default: [
                    'Le scénario de test a été rédigé.',
                    'Le scénario de test a été revu par les pairs.',
                    'Le test a été implémenté.',
                    'Le test a été exécuté et est passé.',
                    'Le test a été revu par les pairs.',
                    'Le test a été push sur le dépôt de développement.',
                    'Le résultat du test a été archivé.'
                ]
            }
        }
    }
);

module.exports = mongoose.model('dod', DodSchema);