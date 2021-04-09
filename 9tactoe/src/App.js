import React from "react";
import GameBase from './game.js'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import SocketContext from './socket-context'
import io from 'socket.io-client'

//need to put these in a config file
const port = '1337';
//For remote games, change this to the ip of the host machine
const ip = '9tactoe.whitestelephant.net';
const socket = io('http://' + ip + ':' + port);

function GameWithID() {
    let { gid } = useParams();

    console.log(gid)

    return (
        <SocketContext.Provider value={socket}>
            <GameBase gid={gid} />
        </SocketContext.Provider>
    )
}

class App extends React.Component {
    constructor(props) {
        super(props)

        socket.on('createResponse', createResponse => {
            if (createResponse === "failure") {
                return (null);
            } else {
                var gid = createResponse;
                this.joinGame(gid);
            }
        });
    }

    joinGame(gid) {
	window.location.href = window.location.origin + gid;
    }

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/:gid" children={<GameWithID />} />
                        <Route path="/">
                            <Main />
                        </Route>

                    </Switch>
                </div>
            </Router>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            gid: "",
        }
    }

    createGame() {
        socket.emit('create', {})
    }

    joinGame() {
        window.location.href = "/" + this.state.gid;
    }

    updateGid(evt) {
        this.setState({ gid: evt.target.value })
    }

    render() {
        return (
            <div>
                <button className="create" onClick={() => this.createGame()}>
                    Create Game
                </button>
                <label>
                    Insert game code
                    <input value={this.state.gid} onChange={(evt) => this.updateGid(evt)} />
                </label>
                <button className="join" onClick={() => this.joinGame()}>
                    Join Game
                </button>
            </div>
        )
    }
}

export default App
