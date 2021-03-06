import React from "react";
import GameBase from './game.js'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useParams
} from "react-router-dom";
import SocketContext from './socket-context'
import openSocket from 'socket.io-client'


const port = '1337';
//For remote games, change this to the ip of the host machine
const ip = '0.0.0.0';
const socket = openSocket('http://' + ip + ':' + port);

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynamic segments in other
// popular web frameworks like Rails and Express.

export default function App() {
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

function Main() {
    return (
        <div>
            <button className="create" onClick={createGame()}>
                Create Game
            </button>
            <label>
                Insert game code
                <input
                    name="numberOfGuests"
                    type="number" />
            </label>
            <button className="join" onClick={joinGame()}>
                Join Game
            </button>
        </div>
    )
}

function GameWithID() {
    let { gid } = useParams();

    return (
        <SocketContext.Provider value={socket}>
            <GameBase gid={gid} />
        </SocketContext.Provider>
    )
}

function createGame() {
    socket.emit('create', {})
}

function joinGame() {
    //window.location.href = "http://google.com";
}
