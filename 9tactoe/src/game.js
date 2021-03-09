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
      status: 'Connecting to game...',
    }

    this.props.socket.on('joinResponse', response => {
      if (response === true) {
        this.setState({status: "Connected to game. Waiting for another player..." })
      } else {
        this.setState({status: "An error occurred while connecting. Please make sure your link is correct."})
      }
    })

    this.props.socket.on('boards', boards => {
      this.setState({ boards: boards })
    });

    this.props.socket.on('wonboards', wonBoards => {
      this.setState({ wonBoards: wonBoards })
    });

    this.props.socket.on('lastPlayed', lastPlayed => {
      this.setState({ lastPlayed: lastPlayed })
    });

    this.props.socket.on('role', role => {
      this.setState({ role: role })
    });

    this.props.socket.on('turn', player => {
      if (player === this.state.role) {
        this.setState({ status: "You're up.", yourTurn: true })
      } else {
        this.setState({ status: player + ' is thinking.', yourTurn: false })
      }
    });

    this.props.socket.on('victory', player => {
      if (player === this.state.role) {
        this.setState({ status: 'You win!', yourTurn: false })
      } else {
        this.setState({ status: 'You lose!', yourTurn: false })
      }
    });
  }

  componentDidMount() {
    //Need a timeout for this
    this.props.socket.emit('join', { gid: this.props.gid });
  }

  handleClick(i, j) {
    console.log("Sending click: " + i + " " + j);
    this.props.socket.emit('click', { i: i, j: j });
  }

  render() {
    const boards = this.state.boards;
    const wonBoards = this.state.wonBoards;
    const lastPlayed = this.state.lastPlayed;
    const status = this.state.status;
    const username = this.state.role;
    const gid = this.props.gid;

    return (
      <div className="game">
        <div className="game-board">
          <SuperBoard
            boards={boards}
            onClick={(i, j) => this.handleClick(i, j)}
            wonBoards={wonBoards}
            lastPlayed={lastPlayed}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <div>
            <ChatBox username={username} gid={gid} />
          </div>
        </div>
      </div>
    );
  }
}

function initBoards() {
  var boards = new Array(9);

  for (var i = 0; i < boards.length; i++) {
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
