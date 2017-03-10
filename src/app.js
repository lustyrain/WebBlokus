import React, { Component, PropTypes } from 'react';
import './app.css';
import { playerShape,
         pieceShape,
         boardShape,
         turnShape     } from './blokusObjects.js';
import { playerToColor } from './playerColors.js';

import _ from 'lodash';
import blokus from 'blokus';


class App extends Component {
  render() {
    return (
      <div>
        <Banner />
        <Arena />
      </div>
    );
  }
}


class Banner extends Component {
  render() {
    return (
      <div className="banner-container">
        <img className="banner-img"
             src="./favicon.ico"
             alt="" />
        <h1> Blokus </h1>
        <span className="blokus-pronunciation"> [<b>blohk</b>-<i>koos</i>] </span>
      </div>
    );
  }
}


class Arena extends Component {
  constructor(props) {
    super(props);
    this.blokus = blokus();
    const board = this.blokus.board();
    const selectedPlayer = _.find(this.blokus.players(), {id: 1});
    const selectedPiece = _.find(this.blokus.pieces(), {id: 12, player: 1});
    this.state = {
      board,
      selectedPlayer,
      selectedPiece,
    };
  }

  setSelectedPlayer = player => {
    if (player) this.setState({selectedPlayer: player});
  }

  setSelectedPiece = piece => {
    // TODO: figure out setting the piece such that blank input is handled
  }

  placeSelectedPiece = (player, piece, position) => {
    var placed = this.blokus.place({
      player: player,
      piece: piece,
      position: position
    });
    console.log(placed);
    const board = this.blokus.board();
    this.blokus.look();
    this.setState({board: board});
  }

  render() {
    const players = this.blokus.players();
    const availablePieces = this.blokus.availablePieces({player: this.state.selectedPlayer.id});
    const turns = this.blokus.turns();
    return (
      <div className="arena-container">
        <Board players={players}
               board={this.state.board}
               placeSelectedPiece={this.placeSelectedPiece} />
        <ControlPanel players={players}
                      pieces={availablePieces}
                      turns={turns}
                      selectedPlayer={this.state.selectedPlayer}
                      selectedPiece={this.state.selectedPiece}
                      setSelectedPlayer={this.setSelectedPlayer}
                      setSelectedPiece={this.setSelectedPiece} />
        <PlayerList players={players}
                    selectedPlayer={this.state.selectedPlayer}
                    setSelectedPlayer={this.setSelectedPlayer} />
      </div>
    );
  }
}


class Board extends Component {
  placePiece = () => {
    this.props.placeSelectedPiece(1, 1, {row: 0, col: 0});
  }

  render() {
    const rowList = _.map(this.props.board, (row, rowIdx) => {
      return <Row players={this.props.players}
                  row={row}
                  key={rowIdx} />;
    });
    return <div className="board-container" onClick={this.placePiece}> {rowList} </div>
  }
}

Board.propTypes = {
  players: PropTypes.arrayOf(playerShape).isRequired,
  board: boardShape.isRequired,
};


class Row extends Component {
  render() {
    const cellList = _.map(this.props.row, (cell, colIdx) => {
      return (!_.isNull(cell) ? <PlayerCell playerID={cell}
                                            key={colIdx} />
                              : <EmptyCell key={colIdx} />);
    });
    return <div className="board-row"> {cellList} </div>;
  }
}

Row.propTypes = {
  row: PropTypes.arrayOf(PropTypes.number).isRequired,
};


class PlayerCell extends Component {
  render() {
    const color = playerToColor[this.props.playerID];
    return <div className="board-cell" style={{backgroundColor: color}}></div>;
  }
}

PlayerCell.propTypes = {
  playerID: PropTypes.number.isRequired,
};


class EmptyCell extends Component {
  render() {
    return <div className="board-cell empty-cell"></div>;
  }
}


class ControlPanel extends Component {
  changeSelectedPlayer = e => {
    const selectedPlayer = _.find(this.props.players, {id: e.target.value});
    this.props.setSelectedPlayer(selectedPlayer);
  }

  changeSelectedPiece = e => {
    const selectedPiece = _.find(this.props.pieces, {id: e.target.value});
    this.props.setSelectedPiece(selectedPiece);
  }

  render() {
    return (
      <div className="control-panel-container">
        <label>
          Piece
          <input type="number"
                 value={this.props.selectedPiece.id}
                 onChange={this.changeSelectedPiece} />
        </label>
        <PiecePreview players={this.props.players}
                      selectedPiece={this.props.selectedPiece} />
      </div>
    );
  }
}

ControlPanel.propTypes = {
  players: PropTypes.arrayOf(playerShape).isRequired,
  pieces: PropTypes.arrayOf(pieceShape).isRequired,
  turns: PropTypes.arrayOf(turnShape).isRequired,
  selectedPlayer: playerShape.isRequired,
  selectedPiece: pieceShape.isRequired,
  setSelectedPlayer: PropTypes.func.isRequired,
  setSelectedPiece: PropTypes.func.isRequired,
};


class PiecePreview extends Component {
  render() {
    const playerID = this.props.selectedPiece.player;
    console.log('playerID', playerID);
    const shape = this.props.selectedPiece.shape;
    const shapeBoard = _.map(shape, row => _.map(row, cell => cell === 'X' ? playerID : null));
    return <Board players={this.props.players}
                  board={shapeBoard} />;
  }
}

PiecePreview.propTypes = {
  players: PropTypes.arrayOf(playerShape).isRequired,
  selectedPiece: pieceShape.isRequired,
};


class PlayerList extends Component {
  render() {
    const playerList = _.map(this.props.players, player => {
      return <Player player={player}
                     selectedPlayer={this.props.selectedPlayer}
                     setSelectedPlayer={this.props.setSelectedPlayer}
                     key={player.id} />;
    });
    return <div className="player-list-container"> {playerList} </div>;
  }
}

PlayerList.propTypes = {
  players: PropTypes.arrayOf(playerShape).isRequired,
  selectedPlayer: playerShape.isRequired,
  setSelectedPlayer: PropTypes.func.isRequired,
};


class Player extends Component {
  clickPlayer = () => {
    this.props.setSelectedPlayer(this.props.player);
  }

  render() {
    const selected = this.props.player.id === this.props.selectedPlayer.id;
    const color = playerToColor[this.props.player.id];
    const style = {border: "solid 1px " + color};
    if (selected) style.backgroundColor = color;
    return (
      <div className={"player-container " + (selected ? "selected-player" : "")}
           style={style}
           onClick={this.clickPlayer}
           key={this.props.player.id}>
        <b> {this.props.player.name} </b>
      </div>
    );
  }
}

Player.propTypes = {
  player: playerShape.isRequired,
  selectedPlayer: playerShape.isRequired,
  setSelectedPlayer: PropTypes.func.isRequired,
};


export default App;
