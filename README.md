# pixel-war

## Explication 
La pixel IUT war est [un projet](https://js-but1.codenestedu.fr/projet) réalisé dans le cadre d'une initiation aux JS, orienté DOM. <br>
Il nous a été demandé de réaliser un site web implémentant une interface qui utilise les fonctionnalités d'une [api](https://pixel-api.codenestedu.fr/api-docs/) en liant HTML, CSS, et JS. <br>

le site est disponible en ouvrant le fichier `index.html`.
## Utilisation 

L'utilisateur doit entrer son UID (ou le remplacer par celui déjà existant), choisir une équipe parmi les 4 disponibles, choisir une couleur (optionnel) puis cliquer n'importe ou sur le tableau pour poser son pixel. <br> Il doit ensuite attendre que la barre de chargement se remplisse pour pouvoir poser à nouveau. 


## Fonctionalités mises en placce
- Toutes les informations sont renvoyés à l'utilisateur, qu'elles soient "bonnes" ou "mauvaises". Si une erreur est renvoyée, le message devient rouge, sinon il est vert.
- un UID est entré par défaut, pour faciliter l'utilisation.
- l'UID est caché pour éviter les coups d'oeil hasardeux.
- Il est montré le temps depuis la dernière pause sur  le tableau du bas, ainsi que le nombre de pixels posés, pour une lecture plus claire
- le tableau a une alternance de couleurs pair/impair, avec la première ligne d'une couleur séparée pour les mêmes raisons.

## Fonctionnalités potentielles 

- attribution d'une couleur par équipe dans le tableau
- tri du tableau par pose récente / équipe / ordre alphabétique / nombre de pixels posés 
- mise en évidece du curseur sur le pixel potentiel sur le tableau pour une meilleure compréhension (surbrillance, loupe)
