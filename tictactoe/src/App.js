import React, { useState, useEffect } from "react";
import TicTacToe from "./TicTacToe";
import io from 'socket.io-client';

function App() {
  const [board, setBoard] = useState(['', '', '', '', '', '', '', '', '']);
  const [player, setPlayer] = useState('X');
  const [thisUser, setThisUser] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [isMyOnlineTurn, setIsMyOnlineTurn] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (gameMode === 'single' && player !== thisUser) {
      makeAIMove();
    }
  }, [player]);

  const makeAIMove = () => {
    const newBoard = [...board];
    let index = Math.floor(Math.random() * 9);
    while (newBoard[index] !== '') {
      index = Math.floor(Math.random() * 9);
    }
    newBoard[index] = player;

    if (gameOver) {
      return;
    }

    setBoard(newBoard);
    setPlayer(player === 'X' ? 'O' : 'X');
  };

  const startSinglePlayerGame = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setPlayer('X');
    setGameMode('single');
    setThisUser('X');
  };

  const startLocalMultiplayerGame = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setPlayer('X');
    setGameMode('multi');
  };

  const startOnlineMultiplayerGame = () => {
    setBoard(['', '', '', '', '', '', '', '', '']);
    setPlayer('X');
    setGameMode('online');
  };

  useEffect(() => {
    if (gameMode === 'online' && !socket) {
      const newSocket = io('https://mtc/tictactoe/server', { autoConnect: false });
      newSocket.connect();
      setSocket(newSocket);

      newSocket.on('start', (data) => {
        console.log('Connected to WebSocket server and got the following data:', data);
        setBoard(['', '', '', '', '', '', '', '', '']);
        setPlayer('X');
        setThisUser(data['user']);
        setIsMyOnlineTurn(data['user'] === 'X')
      });

      newSocket.on('game_state', (data) => {
        console.log('Received message from server:', data);
        setBoard(data.board);
        setIsMyOnlineTurn(data['your_turn']);
        setPlayer(data['your_turn'] ? thisUser : (thisUser === 'X' ? 'O' : 'X'));
      });

      newSocket.on('game_over', (data) => {
        setGameOver(true);
        if(data == "Opponent left the game"){
          alert('Opponent left the game.');
          window.location.reload();
        }
        
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'online' && player === thisUser) {
      socket.emit('make_move', { board, player });
    }
  }, [board, player]);

  return (
    <div
      style={{
        textAlign: 'center',
      }}
    >
      {gameMode === null && (
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 10,
            maxWidth: 300,
            margin: '0 auto',

          }}
        >
          <h1>Tic Tac Toe</h1>
          <button onClick={startSinglePlayerGame}>Single Player</button>
          <button onClick={startLocalMultiplayerGame}>Local Multiplayer</button>
          <button onClick={startOnlineMultiplayerGame}>Online Multiplayer</button>
        </div>
      )}
      {gameMode !== null && (
        <React.Fragment>
          <TicTacToe
            board={board}
            winnerCallback={(winner) => {
              setGameOver(true);
            }}
            clickCell={(index) => {
              if ((gameMode === 'single' && player !== thisUser) ||
                  (gameMode === 'online' && (!isMyOnlineTurn))) {
                return;
              }

              if (board[index] !== '' || gameOver) {
                return;
              }

              if(gameMode !== 'online') {
                const newBoard = [...board];
                newBoard[index] = player;
                setBoard(newBoard);
                setPlayer(player === 'X' ? 'O' : 'X');
              }
              else{
                const newBoard = [...board];
                newBoard[index] = thisUser;
                setBoard(newBoard);
                setPlayer(thisUser === 'X' ? 'O' : 'X');
                socket.emit('make_move', { board: newBoard, player: thisUser });
              }
            }}
          />

          {
            gameMode === 'online' && (
              <div>
                <h2>Online Multiplayer</h2>
                <div>
                  Your symbol: {thisUser}
                </div>
                <div>
                  Your turn: {isMyOnlineTurn ? 'Yes' : 'No'}
                </div>
              </div>
            )
          }

          {
            gameMode !== 'online' && (
              <div>
                <h2>Current Player: {player}</h2>
              </div>
            )
          }

          {
            gameOver && (
              <div>
                <h2>Game Over</h2>
                <button onClick={() => window.location.reload()}>Play Again</button>
              </div>
            )
          }
        </React.Fragment>
      )}
    </div>
  );
}

export default App;
