# Nomad

Pour installer la base de données :
1. Ouvrir un terminal et se connecter à MongoDB en tapant mongo.
2. Créer la base de données avec la commande use nomad.
3. Prendre le script qui se nomme "nomad Mongo.txt" dans le dossier "Scripts" afin d'installer la base de données.
4. Copier le contenu du script dans l'interface MongoDB pour créer les collections et les champs dans les collections.
5. Vérifier si les collections ont bien été créées avec la commande show collections.

Pour déployer l'application :
1. Cloner le répertoire github sur votre poste
2. Ouvrir l'application Visual Studio Code, puis ouvrir un terminal intégré au niveau du dossier Site.
3. Installer les extensions nécessaires qui sont dans les imports dans le fichier ServeurMongo.js.
4. S'assurer que Node.js est bien installé avec la commande nmp install nodejs.
5. Si tout est bien installé correctement, effectuer la commande node ServeurMongo.js afin de permettre au site web de fonctionner et de relier la base de données au site web.
6. Ouvrir un page sur un navigateur web.
7. Entrer dans la barre de recherche http://localhost:4000/ (ce lien va vous amener sur le site web).
8. Naviguer sur le site web Nomad.
