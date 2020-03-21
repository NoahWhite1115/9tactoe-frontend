import React from 'react'

export default class Board extends React.Component {
    renderSquare(i,j) {
      return (
        <Square
          value={this.props.squares[j]}
          onClick={() => this.props.onClick(i,j)}
        />
      );
    }
  
    renderOverlay() {
      return (
        <Overlay
          overlay={this.props.overlay}
        />
      );
    }
  
    render() {
      return (
        <div className={this.props.className}>
          {this.renderOverlay()}
          <div className="board-row">
            {this.renderSquare(this.props.boardID, 0)}
            {this.renderSquare(this.props.boardID, 1)}
            {this.renderSquare(this.props.boardID, 2)}
          </div>
          <div className="board-row">
            {this.renderSquare(this.props.boardID, 3)}
            {this.renderSquare(this.props.boardID, 4)}
            {this.renderSquare(this.props.boardID, 5)}
          </div>
          <div className="board-row">
            {this.renderSquare(this.props.boardID, 6)}
            {this.renderSquare(this.props.boardID, 7)}
            {this.renderSquare(this.props.boardID, 8)}
          </div>
        </div>
      );
    }
}

//helper square class
function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  function Overlay(props) {
    if (props.overlay){
      return (
        <div>
          <div className="overlay"></div>
          <div className="text">{props.overlay}</div>
        </div>
      );
    } else {
      return null;
    }
  }