import React from 'react'
import Board from './board.js'

export default class SuperBoard extends React.Component{
    renderBoard(i) {
      var className = "board";
      className = this.props.lastPlayed === i ? className + " selected" : className;
      return (
        <Board
          className = {className}
          boardID = {i}
          squares={this.props.boards[i]}
          onClick={this.props.onClick}
          overlay = {this.props.wonBoards[i]}
        />
      )
    }
  
    render() {
      return (
        <div>
          <div className="super-board-row">
            {this.renderBoard(0)}
            {this.renderBoard(1)}
            {this.renderBoard(2)}
          </div>
          <div className="super-board-row">
            {this.renderBoard(3)}
            {this.renderBoard(4)}
            {this.renderBoard(5)}
          </div>
          <div className="super-board-row">
            {this.renderBoard(6)}
            {this.renderBoard(7)}
            {this.renderBoard(8)}
          </div>
        </div>
      );
    }
  }
  