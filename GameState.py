class GameState():
    def __init__(self):
        self.reset()

    def reset(self):
        self.boards = [['' for i in range(9)] for i in range(9)]
        self.wonBoards = ['' for i in range(9)]
        self.lastPlayed = -1
        self.turn = 'X'

    def updateWonBoards(self, i):
        self.wonBoards[i] = boardWin(self.boards[i])

    def updateLastPlayed(self, j):
        self.lastPlayed = -1 if wonBoards[j] != '' else j

    def checkIfMoveValid(self, i, j):
        rightBoard = (i != lastPlayed and lastPlayed != -1)
        if (boards[i][j] != '' or rightBoard or wonBoards[i] or boardWin(wonBoards)):
            return False
        return True

    def makeMove(self, i, j):
        #set the space to X or O
        self.boards[i][j] = turn

        #check if the board is won
        updateWonBoards(i)

        #check if the next board to play on is won
        updateLastPlayed(j)

    def togglePlayer(self):
        self.turn = 'O' if self.turn == 'X' else 'X'

    def stateSummary(self):
        return (self.board, 
        self.wonBoards, 
        self.lastPlayed, 
        self.turn)

    def isGameWon(self):
        return self.boardWin(self.wonBoards) != ""

    def checkWhoWon(self):
        return self.boardWin(self.wonBoards)

    def boardWin(self, board):
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
