import uuid
from GameState import GameState

class GameManager():
    def __init__(self, timeout):
        self.game_hash = {}
        self.game_count = 0
        self.timeout = timeout
        self.player_hash = {}

    def createGame(self):
        gid = uuid.uuid4().hex[:8].lower()
        while gid in self.game_hash:
            gid = uuid.uuid4().hex[:8].lower()

        self.game_hash[gid] = self.createGameMeta()

        self.game_count += 1
        return gid

    def get_list(self):
        print(len(self.game_hash))
        for i in self.game_hash.keys():
            print(i)

    def get_game(self, gid):
        return self.game_hash[gid]

    def createGameMeta(self):
        return GameMeta()

    def addPlayer(self, gid, sid):
        self.player_hash[sid] = gid
        game = self.game_hash[gid]
        return(game.addPlayer(sid))

    def removePlayer(self, sid):
        try: 
            gid = self.player_hash[sid]
            game = self.game_hash[gid]
            game.removePlayer(sid)
            del self.player_hash[sid]
        except(KeyError):
            return 

class GameMeta():
    def __init__(self):
        self.gameState = self.makeGame()
        self.players = {}
        self.spectators = []

    def makeGame(self):
        return None

    def getState(self):
        return self.gameState

class NineXOGameManager(GameManager):
    def createGameMeta(self):
        return NineXOGameMeta()

class NineXOGameMeta(GameMeta):
    def __init__(self):
        super().__init__()
        self.players = players = {'X': None, 'O': None}

    def addPlayer(self, sid):
        if (self.players['X'] == None):
            print("It was player X!")
            self.players['X'] = sid
            return 'X'
        elif (self.players['O'] == None):
            print("It was player O!")
            self.players['O'] = sid
            return 'O'
        else:
            self.spectators.append(sid)
            return 'Spec'

    def removePlayer(self, sid):
        if (self.players['X'] == sid):
            self.players['X'] = None

        elif (self.players['O'] == sid):
            self.players['O'] = None

        #TODO: error proof this 
        else:
            self.spectators.remove(sid)

    def makeGame(self):
        return GameState()

    def checkPlayer(self, sid):
        if (self.players[self.gameState.turn] != sid):
            print("Wrong player clicked!")
            return False

        if self.players['X'] == None or self.players['O'] == None:
            print("Not enough players connected!")
            return False

        return True
