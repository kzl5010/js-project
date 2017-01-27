import {astar} from './algo';

export default class Graph {
  constructor(gridIn, options) {
    options = options || {};
    this.nodeList = [];
    this.grid = [];
    for (let x = 0; x < gridIn.length; x++) {
      this.grid[x] = [];

      for (let y = 0, row = gridIn[x]; y < row.length; y++) {
        let node = new GridNode(x, y, row[y]);
        this.grid[x][y] = node;
        this.nodeList.push(node);
      }
    }
  this.init();
  }

  init() {
    this.visitedNodes = [];
    for (let i = 0; i < this.nodeList.length; i++) {
      astar.cleanNode(this.nodeList[i]);
    }
  };

  clearNodes() {
    for (let i = 0; i < this.visitedNodes.length; i++) {
      astar.cleanNode(this.visitedNodes[i]);
    }
    this.visitedNodes = [];
  };


  markVisited(node) {
    this.visitedNodes.push(node);
  };

  neighbors(node) {
    let ret = [];
    let x = node.x;
    let y = node.y;
    let grid = this.grid;

    // West
    if (grid[x - 1] && grid[x - 1][y]) {
      ret.push(grid[x - 1][y]);
    }

    // East
    if (grid[x + 1] && grid[x + 1][y]) {
      ret.push(grid[x + 1][y]);
    }

    // South
    if (grid[x] && grid[x][y - 1]) {
      ret.push(grid[x][y - 1]);
    }

    // North
    if (grid[x] && grid[x][y + 1]) {
      ret.push(grid[x][y + 1]);
    }
    return ret;
  };

  toString() {
    let graphString = [];
    let nodes = this.grid;
    for (let x = 0; x < nodes.length; x++) {
      let rowDebug = [];
      let row = nodes[x];
      for (let y = 0; y < row.length; y++) {
        rowDebug.push(row[y].cost);
      }
      graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
  };
}

class GridNode {
  constructor(x, y, cost) {
    this.x = x;
    this.y = y;
    this.cost = cost;
  }

  toString() {
  return "[" + this.x + " " + this.y + "]";
  };

  getCost(fromNeighbor) {
  // if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
  //   return this.cost * 1.41421;
  //   }
    return this.cost;
  };

  isWall() {
    return this.cost === 0;
  };
}