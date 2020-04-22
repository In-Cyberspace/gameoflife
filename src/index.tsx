import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

interface IBoxProps {
  boxClass: string;
  key: string;
  boxId: string;
  row: number;
  col: number;
  selectBox: any;
}

class Box extends Component<IBoxProps> {
  selectBox = () => {
    return this.props.selectBox(this.props.row, this.props.col);
  };

  render() {
    return (
      <div
        className={this.props.boxClass}
        id={this.props.boxId}
        onClick={this.selectBox}
      />
    );
  }
}

interface IGridProps {
  gridFull: Array<any>;
  cols: number;
  rows: number;
  selectBox: any;
}

class Grid extends Component<IGridProps> {
  render() {
    const width = this.props.cols * 16;
    var rowsArr: Array<any> = [];

    var boxClass: string = "";
    for (var i = 0; i < this.props.rows; i++) {
      for (var j = 0; j < this.props.cols; j++) {
        let boxId = i + "_" + j;

        boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
        rowsArr.push(
          <Box
            boxClass={boxClass}
            key={boxId}
            boxId={boxId}
            row={i}
            col={j}
            selectBox={this.props.selectBox}
          />
        );
      }
    }

    return (
      <div className="grid" style={{ width: width }}>
        {rowsArr}
      </div>
    );
  }
}

interface IMainState {
  generation: number;
  gridFull: Array<any>;
}

interface IMainProps {}

class Main extends Component<IMainProps, IMainState> {
  intervalId: any;

  cols = 50;
  rows = 30;
  speed = 100;

  /**
   *
   */
  constructor(props: IMainProps) {
    super(props);
    this.state = {
      generation: 0,
      gridFull: Array(this.rows)
        .fill(0)
        .map(() => Array(this.cols).fill(false)),
    };
  }

  // A method to switch the box color to indicated it has been selected.
  selectBox = (row: number, col: number) => {
    let gridCopy = arrayClone(this.state.gridFull);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridFull: gridCopy,
    });
  };

  // A method used to seed the game as soon as the application loads.
  // We set a 25% of turning on each square in the grid.
  seed = () => {
    let gridCopy = arrayClone(this.state.gridFull);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (Math.floor(Math.random() * 4) === 1) {
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridFull: gridCopy,
    });
  };

  // A method associated with the on screen play button.
  // Whenever the play button is clicked everything starts
  // over from the beginning.
  // ...
  // setInterval calls this.play at this.props.speed so
  // this.play is called every 100 milliseconds
  playButton = () => {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(this.play, this.speed);
  };

  pauseButton = () => {
      clearInterval(this.intervalId);
  };

  // The play method implements the main rules for the game.
  play = () => {
    let g = this.state.gridFull;
    let g2 = arrayClone(this.state.gridFull);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0; // Number of neighbors
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }
    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1,
    });
  };

  componentDidMount() {
    this.seed();
    this.playButton();
  }

  render() {
    return (
      <div>
        <h1>The Game of Life</h1>
        <Grid
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox}
        />
        <h2>Generations: {this.state.generation}</h2>
      </div>
    );
  }
}

// Used to create a copy of the grid.
function arrayClone(arr: Array<any>): Array<any> {
  return JSON.parse(JSON.stringify(arr));
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
