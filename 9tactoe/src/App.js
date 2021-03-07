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


const port = '1337';
//For remote games, change this to the ip of the host machine
const ip = '0.0.0.0';
const socket = io('http://' + ip + ':' + port);

class App extends React.Component{
    constructor(props){
        super(props)

        socket.on('createResponse', createResponse => {
            if(createResponse=="failure"){
                return(null);
            } else {
                gid = createResponse
                window.location.href = "/" + gid;
            }
        });
    }

    GameWithID() {
        let { gid } = useParams();
    
        console.log(gid)
    
        return (
            <SocketContext.Provider value={socket}>
                <GameBase gid={gid} />
            </SocketContext.Provider>
        )
    }

    render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/">
                            <Main />
                        </Route>
    
                        <Route path="/:gid" children={<GameWithID />} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

class Main extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            gid: "",
        }
    }
    
    createGame() {
        socket.emit('create', {})
    }

    joinGame() {
        window.location.href = "/" + gid;
    } 

    updateGid(evt) {
        gid += evt.target.value
    }

    render(){
        return (
            <div>
                <button className="create" onClick={() => createGame()}>
                    Create Game
                </button>
                <label>
                    Insert game code
                    <input value={this.state.gid} onChange={(evt) => updateGid(evt)}/>
                </label>
                <button className="join" onClick={() => joinGame()}>
                    Join Game
                </button>
            </div>
        )
    }
}
