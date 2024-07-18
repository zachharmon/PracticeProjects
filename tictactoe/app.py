from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="http://localhost:3000")

NAMESPACE = '/tictactoe/server'

# Set to store active session IDs
active_sessions = set()

games = []

# WebSocket route
@socketio.on('connect', namespace=NAMESPACE)
def handle_connect():
    session_id = request.sid
    if session_id not in active_sessions:
        active_sessions.add(session_id)
    print(f'Client connected: {session_id}. Total connected clients:', len(active_sessions))
    
    available_games = [game for game in games if game['player_2'] == None]
    
    if len(available_games) == 0:
        games.append({
            'player_1': session_id,
            'player_2': None,
            'board': ['' for i in range(9)],
            'player': 'X'
        })
        available_games = [games[-1]]
        
        response1 = {
            'board': available_games[0]['board'],
            'your_turn': True,
            'user': 'X'
        }
        emit('start', {'user': 'X'}, room=session_id)
        emit('game_state', response1, room=session_id)
    else:
        available_games[0]['player_2'] = session_id
        available_games[0]['board'] = ['' for i in range(9)]
    
        response2 = {
            'board': available_games[0]['board'],
            'your_turn': False,
            'user': 'O'
        }
        emit('start', {'user': 'O'}, room=session_id)
        emit('game_state', response2, room=session_id)
    
def check_winner(board, player):
    winning_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ]
    
    for combination in winning_combinations:
        if all([board[i] == player for i in combination]):
            return True
        
    return False

@socketio.on('make_move', namespace=NAMESPACE)
def handle_make_move(data):
    session_id = request.sid
    game = [game for game in games if game['player_1'] == session_id or game['player_2'] == session_id]
    
    if len(game) == 0:
        return
    
    game = game[0]
    
    if session_id == game['player_1'] and game['player'] == 'X' or session_id == game['player_2'] and game['player'] == 'O':
        game['board'] = data['board']
        game['player'] = 'O' if session_id == game['player_1'] else 'X'
        
        response1 = {
            'board': game['board'],
            'your_turn': True if session_id == game['player_2'] else False
        }
        
        response2 = {
            'board': game['board'],
            'your_turn': True if session_id == game['player_1'] else False
        }
        
        emit('game_state', response1, room=game['player_1'])
        emit('game_state', response2, room=game['player_2'])
        
        if check_winner(game['board'], 'X'):
            emit('game_over', 'X wins', room=game['player_1'])
            emit('game_over', 'X wins', room=game['player_2'])
            games.remove(game)
        elif check_winner(game['board'], 'O'):
            emit('game_over', 'O wins', room=game['player_1'])
            emit('game_over', 'O wins', room=game['player_2'])
            games.remove(game)
        elif '' not in game['board']:
            emit('game_over', 'Draw', room=game['player_1'])
            emit('game_over', 'Draw', room=game['player_2'])
            games.remove(game)

@socketio.on('disconnect', namespace=NAMESPACE)
def handle_disconnect():
    session_id = request.sid
    active_sessions.remove(session_id)
    print(f'Client disconnected: {session_id}. Total connected clients:', len(active_sessions))

    game = [game for game in games if game['player_1'] == session_id or game['player_2'] == session_id]
    
    if len(game) > 0:
        games.remove(game[0])
        emit('game_over', 'Opponent left the game', room=game[0]['player_1'])
        emit('game_over', 'Opponent left the game', room=game[0]['player_2'])

if __name__ == '__main__':
    socketio.run(app, debug=True)
