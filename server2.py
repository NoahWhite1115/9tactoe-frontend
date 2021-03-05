from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from GameManager import NineXOGameManager, NineXOGameMeta

app = Flask(__name__)
#change this in prod
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

gameManager = NineXOGameManager(25)

@socketio.on('connect')
def connect():
    print("Someone connected to websocket!")

@socketio.on('create')
def createGame():
    gid = gameManager.createGame()
    dest = "/" + gid
    socketio.emit('redirect', dest, room=request.sid)

@socketio.on('join')
def joinGame(object):
    [gid, username] = object.values()
    gameManager.addPlayer(gid, request.sid, username)
    socketio.enter_room(request.sid, gid)
    
@socketio.on('disconnect')
def disconnect():
    gameManager.removePlayer(request.sid)
    print("Player disconnected!")

@socketio.on('post_submit')
def message(object):
    [gid, username, content] = object.values()
    socketio.emit('message',{"username":username, "content":content}, room=gid)

@socketio.on('click')
def click(object):
    [gid,i,j] = object.values()

    gameMeta = gameManager.get_game(gid)
    gameState = gameMeta.getState()

    if gameMeta.checkPlayer(request.sid):
        if gameState.checkIfMoveValid(i,j):
            
            gameState.make_move(i,j)

            (boards, wonBoards, lastPlayed, _) = gameState.stateSummary()

            socketio.emit('boards', boards, room=gid)
            socketio.emit('wonboards', wonBoards, room=gid)
            socketio.emit('lastPlayed', lastPlayed, room=gid)
            
            if gameState.isGameWon():
                socketio.emit('victory',boardWin(wonBoards))
                gameState.reset()

            gameState.togglePlayer()
            socketio.emit('turn', gameState.turn)

if __name__ == '__main__':
    socketio.run(app, port=1337, debug=True, host='0.0.0.0')
