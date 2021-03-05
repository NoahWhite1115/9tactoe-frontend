import React from 'react'
import SuperBoard from './superboard.js'
import SocketContext from './socket-context'
import ChatBox from './chatbox.js'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      boards: initBoards(),
      wonBoards: Array(9).fill(''),
      lastPlayed: -1,
      yourTurn: false,
      status: 'Waiting for another player...',
    }

    socket.on('boards', boards => {
      this.setState({boards: boards})
    });

    socket.on('wonboards', wonBoards => {
      this.setState({wonBoards: wonBoards})
    });

    socket.on('lastPlayed', lastPlayed => {
      this.setState({lastPlayed: lastPlayed})
    });

    socket.on('x_or_o', x_or_o => {
      this.setState({x_or_o: x_or_o})
    });

    socket.on('turn', player => {
      if (player === this.state.x_or_o) {
        this.setState({status: "You're up.", yourTurn: true})
      } else {
        this.setState({status: player + ' is thinking.', yourTurn: false})
      }
    });

    socket.on('victory', player => {
      if (player === this.state.color) {
        this.setState({status: 'You win!', yourTurn: false})
      } else {
        this.setState({status: 'You lose!', yourTurn: false})
      }
    });

    socket.emit('join', {gid:props, username:this.state.x_or_o})
  }

  handleClick(i,j) {
    console.log("Sending click: " + i + " " + j);
    socket.emit('click', {i:i, j:j});
  }

  render() {
    const boards = this.state.boards;
    const wonBoards = this.state.wonBoards;
    const lastPlayed = this.state.lastPlayed;
    const status = this.state.status;
    const username = this.state.x_or_o;

    return (
      <div className="game">
        <div className="game-board">
          <SuperBoard
            boards={boards}
            onClick={(i,j) => this.handleClick(i,j)}
            wonBoards={wonBoards}
            lastPlayed={lastPlayed}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div>
            <ChatBox username={username}/>
          </div>
        </div>
      </div>
    );
  }
}

function initBoards() {
  var boards = new Array(9);

  for(var i = 0; i < boards.length ;i++){
    boards[i] = new Array(9);
    boards[i].fill('');
  }

  return boards;
}

const GameWithSocket = props => (
  <SocketContext.Consumer>
  {socket => <Game {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default GameWithSocket
