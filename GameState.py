class GameState():
    def __init__(self):
        self.reset()

    def reset(self):
        self.boards = [['' for i in range(9)] for i in range(9)]
        self.wonBoards = ['' for i in range(9)]
        self.lastPlayed = -1
        self.turn = 'X'

    def updateWonBoards(self, i):
        self.wonBoards[i] = self.boardWin(self.boards[i])

    def updateLastPlayed(self, j):
        self.lastPlayed = -1 if self.wonBoards[j] != '' else j

    def checkIfMoveValid(self, i, j):
        rightBoard = (i != self.lastPlayed and self.lastPlayed != -1)
        if (self.boards[i][j] != '' or rightBoard or self.wonBoards[i] or self.boardWin(self.wonBoards)):
            return False
        return True

    def makeMove(self, i, j):
        #set the space to X or O
        self.boards[i][j] = self.turn

        #check if the board is won
        self.updateWonBoards(i)

        #check if the next board to play on is won
        self.updateLastPlayed(j)

    def togglePlayer(self):
        self.turn = 'O' if self.turn == 'X' else 'X'

    def stateSummary(self):
        return (self.boards, 
        self.wonBoards, 
        self.lastPlayed, 
        self.turn)

    def isGameWon(self):
        return self.boardWin(self.wonBoards) != ""

    def checkWhoWon(self):
        return self.boardWin(self.wonBoards)

    def boardWin(self, board):
        lines = (
        (0, 1, 2),
        (3, 4, 5),
        (6, 7, 8),
        (0, 3, 6),
        (1, 4, 7),
        (2, 5, 8),
        (0, 4, 8),
        (2, 4, 6)
        )

        for line in lines:
            (a, b, c) = line
            if (board[a] != '' and board[a] == board[b] and board[a] == board[c]):
                return board[a]

        #"~" is used to indicate a draw
        if "" in board:
            return ""
        else:
            return "~"
