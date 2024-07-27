# Tic Tac Toe

This implementation of tic tac toe was build with a React frontend and a Flask (Python) backend. It is meant to be simplistic and light weight. The game is played in the browser and has 3 modes:
- Single player (against an AI)
- Local Multiplayer (against another player on the same computer)
- Online Multiplayer (against another player on a different computer)

## Installation
To run the game, ensure you have the proper environment to run a React app and a Flask app. To install the necessary dependencies, run the following commands in the root directory of the project:
```
npm install
pip install -r requirements.txt
```

To simply run the game, run the following commands in the root directory of the project:
```
npm start
```
And in a separate terminal:
```
python app.py
```
This will start the React app on `localhost:3000` and the Flask app on `localhost:5000`. The game can be played by navigating to `localhost:3000` in a web browser. In order to play online multiplayer, the Flask app must be running on a server that is accessible to both players. This can be done by altering the frontend code to point to the correct server and then hosting the Flask app on a server or by playing on the same network with the server running on one of the player's computers and the other player altering the frontend code to point to the server's local IP address. For simplicity, the code is currently set up to play online multiplayer on the same computer in different tabs.

## Usage
The game is played by clicking on the square you would like to place your piece. The game will alternate between X and O until the game is won or tied. The game will then display the winner and allow the players to play again.

## Online Matchmaking
The online multiplayer mode is set up to allow players to matchmake with each other. When a player clicks the "Online Multiplayer" button, they will be placed in a queue to be matched with another player. Once a match is found, the game will begin. If a player leaves the game before it is over, the other player will be declared the winner.
