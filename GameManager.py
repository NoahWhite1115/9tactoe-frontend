import uuid
import GameState

class GameManager():
    def __init__(self, timeout):
        self.game_hash = {}
        self.game_count = 0
        self.timeout = timeout
        self.player_hash = {}

    def createGame(self):
        id = uuid.uuid4().hex[:8].upper()
        while id in self.game_hash:
            id = uuid.uuid4().hex[:8].upper()

        self.game_hash[id] = createGameMeta()

        self.game_count += 1
        return id

    def get_game(self, gid):
        return self.game_hash[gid]

    def createGameMeta(self):
        return GameMeta()

    def addPlayer(self, gid, sid, username):
        player_hash[sid] = gid
        game = game_hash[gid]
        game.addPlayer(sid)

    def removePlayer(self, sid):
        gid = player_hash[sid]
        game = game_hash[gid]
        game.removePlayer(sid)
        del player_hash[sid]

class GameMeta():
    def __init__(self):
        self.gameState = makeGame()
        self.players = {}
        self.spectators = []

    def makeGame(self):
        return None

class NineXOGameManager(GameManager):
    def createGameMeta(self):
        return NineXOGameMeta()

class NineXOGameMeta(GameMeta):
    def __init__(self):
        super().__init__()
        self.players = players = {'X': None, 'O': None}

    def addPlayer(self, sid, username):
        if (players['X'] == None):
            print("It was player X!")
            self.players['X'] = sid
        elif (players['O'] == None):
            print("It was player O!")
            self.players['O'] = sid
        else:
            self.spectators.append(sid)

    def removePlayer(self, sid):
        if (players['X'] == sid):
            players['X'] = None

        elif (players['O'] == sid):
            players['O'] = None

        #TODO: error proof this 
        else:
            self.spectators.remove(sid)

    def makeGame(self):
        return GameState()

    def checkPlayer(self, sid):
        if (self.players[self.gameState.turn] != sid):
            print("Wrong player clicked!")
            return False

        if self.players['X'] == None or players['O'] == None:
            print("Not enough players connected!")
            return False

        return True
