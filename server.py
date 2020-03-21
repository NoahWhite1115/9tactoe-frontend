from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
#change this in prod
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")
CORS(app)

boards = [['' for i in range(9)] for i in range(9)]
wonBoards = ['' for i in range(9)]
lastPlayed = -1
players = {'X': None, 'O': None}
turn = 'X'

def reset():
    boards = [['' for i in range(9)] for i in range(9)]
    players = {'X': None, 'O': None}
    turn = 'X'

@socketio.on('connect')
def connect():
    print("Someone connected to websocket!")

    if (players['X'] == None):
        print("It was player X!")
        players['X'] = request.sid
        socketio.emit('x_or_o', 'X', room=players['X'])
        socketio.emit('message', {"username":"System", "content":"You're playing as X"}, room=players['X'])
    elif (players['O'] == None) :
        print("It was player O!")
        players['O'] = request.sid
        socketio.emit('x_or_o', 'O', room=players['O'])
        socketio.emit('message', {"username":"System", "content":"You're playing as O"}, room=players['O'])
        socketio.emit('turn', 'X')

@socketio.on('disconnect')
def disconnect():
    print("Player disconnected!")
    if (players['X'] == request.sid):
        players['X'] = None
        print("It was x!")

    elif (players['O'] == request.sid):
        players['O'] = None
        print('It was o!')

@socketio.on('post_submit')
def message(object):
    [username, content] = object.values()
    socketio.emit('message',{"username":username, "content":content})

@socketio.on('click')
def click(object):
    [i,j] = object.values()

    if (players[turn] != request.sid):
        print("Wrong player clicked!")
        return

    if players['X'] == None or players['O'] == None:
        print("Not enough players connected!")
        return

    #check if space is empty, the correct board is selected, the selected board is not won and the game is not over
    rightBoard = (i != lastPlayed and lastPlayed != -1)
    if (boards[i][j] != '' or rightBoard or wonBoards[i] or boardWin(wonBoards)):
      return

    #set the space to X or O
    boards[i][j] = turn

    #check if the board is won
    updateWonBoards(i)

    #check if the next board to play on is won
    updateLastPlayed(j)

    socketio.emit('boards', boards)
    socketio.emit('wonboards', wonBoards)
    socketio.emit('lastPlayed', lastPlayed)

    if (boardWin(wonBoards) != ""):
        socketio.emit('victory',boardWin(wonBoards))
        reset()

    #Toggle the player
    togglePlayer()
    socketio.emit('turn', turn)

def togglePlayer():
    global turn
    turn = 'O' if turn == 'X' else 'X'

def updateWonBoards(i):
    global wonBoards
    global boards
    wonBoards[i] = boardWin(boards[i])

def updateLastPlayed(j):
    global lastPlayed
    global wonBoards
    lastPlayed = -1 if wonBoards[j] != '' else j

def boardWin(board):
    lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
    ]

    for i in range(0, len(lines)):
        [a, b, c] = lines[i]
        if (board[a] != '' and board[a] == board[b] and board[a] == board[c]):
            return board[a]

    #"~" is used to indicate a draw
    if "" in board:
        return ""
    else:
        return "~"

if __name__ == '__main__':
    reset()
    socketio.run(app, port=1337, debug=True, host='0.0.0.0')
