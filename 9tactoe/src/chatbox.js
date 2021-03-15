import React from 'react';
import ReactDOM from 'react-dom';
import SocketContext from './socket-context'

import './Chat.css';
import Message from './message.js';

class Chatroom extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [{
                username: "System",
                content: "You have joined the game"
            }]
        };

        this.props.socket.on('message', message => {
          this.setState({
            messages: this.state.messages.concat([{
              username: message.username,
              content: message.content,
            }])
          })
        });

        this.submitMessage = this.submitMessage.bind(this);
    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.messages).scrollTop = ReactDOM.findDOMNode(this.refs.messages).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();

        this.props.socket.emit("post_submit", {
          gid: this.props.gid,
          username: this.props.username,
          content: ReactDOM.findDOMNode(this.refs.msg).value
        });
        this.setState(() => {
            ReactDOM.findDOMNode(this.refs.msg).value = "";
        });
    }

    render() {
        const username = this.props.username;
        const { messages } = this.state;

        return (
            <div className="chatroom">
                <ul className="messages" ref="messages">
                    {
                        messages.map((message) => 
                            <Message message={message} user={username} />
                        )
                    }
                </ul>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

const ChatWithSocket = props => (
  <SocketContext.Consumer>
  {socket => <Chatroom {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default ChatWithSocket;
