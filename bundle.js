/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _algo = __webpack_require__(1);
	
	var _graph = __webpack_require__(2);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	var _bfs = __webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var WALL = 0,
	    performance = window.performance;
	
	$(function () {
	
	    var $grid = $("#search_grid"),
	        $WallFreq = $("#WallFreq"),
	        $GridSize = $("#GridSize"),
	        $showAll = $("#showAll"),
	        $nextNode = $("#nextNode");
	
	    var options = {
	        WallFreq: $WallFreq.val(),
	        gridSize: $GridSize.val(),
	        showAll: $showAll.is("checked"),
	        closest: $nextNode.is("checked")
	    };
	
	    var grid = new GraphSolver($grid, options, _bfs.bfs.search);
	
	    $("#generateGrid").click(function () {
	        grid.initialize();
	    });
	
	    $WallFreq.change(function () {
	        grid.setOption({ WallFreq: $(this).val() });
	        grid.initialize();
	    });
	
	    $GridSize.change(function () {
	        grid.setOption({ gridSize: $(this).val() });
	        grid.initialize();
	    });
	
	    $showAll.change(function () {
	        grid.setOption({ showAll: $(this).is(":checked") });
	    });
	
	    $nextNode.change(function () {
	        grid.setOption({ closest: $(this).is(":checked") });
	    });
	
	    $("#weighted").click(function () {
	        if ($("#weighted").prop("checked")) {
	            $('#weightsKey').slideDown();
	        } else {
	            $('#weightsKey').slideUp();
	        }
	    });
	});
	
	var css = { start: "start", finish: "finish", wall: "wall", active: "active" };
	
	var GraphSolver = function () {
	    function GraphSolver($graph, options, implementation) {
	        _classCallCheck(this, GraphSolver);
	
	        this.$graph = $graph;
	        this.search = implementation;
	        this.options = $.extend({ WallFreq: 0.1, showAll: true, gridSize: 10 }, options);
	        this.initialize();
	    }
	
	    _createClass(GraphSolver, [{
	        key: 'setOption',
	        value: function setOption(option) {
	            this.options = $.extend(this.options, option);
	            this.showAllVisited();
	        }
	    }, {
	        key: 'initialize',
	        value: function initialize() {
	            this.grid = [];
	            var that = this;
	            var nodes = [];
	            var $graph = this.$graph;
	
	            $graph.empty();
	
	            var cellWidth = $graph.width() / this.options.gridSize - 2; // -2 for border
	            var cellHeight = $graph.height() / this.options.gridSize - 2;
	            var $cellTemplate = $("<span />").addClass("grid_item").width(cellWidth).height(cellHeight);
	            this.startSet = false;
	
	            for (var x = 0; x < this.options.gridSize; x++) {
	                var $row = $("<div class='clear' />"),
	                    nodeRow = [],
	                    gridRow = [];
	
	                for (var y = 0; y < this.options.gridSize; y++) {
	                    var id = "cell_" + x + "_" + y,
	                        $cell = $cellTemplate.clone();
	                    $cell.attr("id", id).attr("x", x).attr("y", y);
	                    $row.append($cell);
	                    gridRow.push($cell);
	
	                    var isWall = Math.floor(Math.random() * (1 / that.options.WallFreq));
	                    if (isWall === 0) {
	                        nodeRow.push(WALL);
	                        $cell.addClass(css.wall);
	                    } else {
	                        var cell_cost = $("#weighted").prop("checked") ? Math.floor(Math.random() * 3) * 5 + 1 : 1;
	                        nodeRow.push(cell_cost);
	                        $cell.addClass('weight' + cell_cost);
	                        if ($("#displayWeights").prop("checked")) {
	                            $cell.html(cell_cost);
	                        }
	                        // if (!startSet) {
	                        //     $cell.addClass(css.start);
	                        //     startSet = true;
	                        // }
	                    }
	                }
	                $graph.append($row);
	
	                this.grid.push(gridRow);
	                nodes.push(nodeRow);
	            }
	
	            this.graph = new _graph2.default(nodes);
	
	            // bind cell event, set start/wall positions
	            this.$cells = $graph.find(".grid_item");
	            this.$cells.click(function () {
	                that.chosenNode($(this));
	            });
	        }
	    }, {
	        key: 'chosenNode',
	        value: function chosenNode($end) {
	            var end = this.nodeFromElement($end);
	
	            if ($end.hasClass(css.wall) || $end.hasClass(css.start)) {
	                return;
	            }
	            if (!this.startSet) {
	                $end.addClass(css.start);
	                this.startSet = true;
	                return;
	            }
	
	            this.$cells.removeClass(css.finish);
	            $end.addClass(css.finish);
	            var $start = this.$cells.filter("." + css.start),
	                start = this.nodeFromElement($start);
	
	            var sTime = performance ? performance.now() : new Date().getTime();
	
	            var path = this.search(this.graph, start, end, {
	                closest: this.options.closest
	            });
	            var fTime = performance ? performance.now() : new Date().getTime(),
	                duration = (fTime - sTime).toFixed(2);
	
	            if (path.length === 0) {
	                $("#message").text("No solution (" + duration + "ms)");
	                this.noSolution();
	            } else {
	                $("#message").text("search took " + duration + "ms.");
	                this.showAllVisited();
	                this.animatePath(path);
	            }
	        }
	    }, {
	        key: 'showAllVisited',
	        value: function showAllVisited() {
	            this.$cells.html(" ");
	            var that = this;
	            if (this.options.showAll) {
	                that.$cells.each(function () {
	                    var node = that.nodeFromElement($(this)),
	                        showAll = false;
	                    if (node.visited) {
	                        showAll = true;
	                    }
	
	                    if (showAll) {
	                        $(this).html("visited");
	                        $(this).addClass("visited");
	                    }
	                });
	            }
	        }
	    }, {
	        key: 'nodeFromElement',
	        value: function nodeFromElement($cell) {
	            if ($cell.length === 0) {
	                return;
	            }
	            return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
	        }
	    }, {
	        key: 'noSolution',
	        value: function noSolution() {
	            var $graph = this.$graph;
	            this.$cells.removeClass(css.start);
	            this.$cells.removeClass(css.finish);
	            this.startSet = false;
	        }
	    }, {
	        key: 'animatePath',
	        value: function animatePath(path) {
	            var grid = this.grid,
	                timeout = 1000 / grid.length,
	                elementFromNode = function elementFromNode(node) {
	                return grid[node.x][node.y];
	            };
	
	            var that = this;
	            // will add start class if final
	            var removeClass = function removeClass(path, i) {
	                if (i >= path.length) {
	                    // finished removing path, set start positions
	                    return setStartClass(path, i);
	                }
	                elementFromNode(path[i]).removeClass(css.active);
	                setTimeout(function () {
	                    removeClass(path, i + 1);
	                }, timeout * path[i].getCost());
	            };
	            var setStartClass = function setStartClass(path, i) {
	                if (i === path.length) {
	                    that.$graph.find("." + css.start).removeClass(css.start);
	                    // elementFromNode(path[i-1]).addClass(css.start);
	                    that.startSet = false;
	                }
	            };
	            var addClass = function addClass(path, i) {
	                if (i >= path.length) {
	                    // Finished showing path, now remove
	                    return removeClass(path, 0);
	                }
	                elementFromNode(path[i]).addClass(css.active);
	                setTimeout(function () {
	                    addClass(path, i + 1);
	                }, timeout * path[i].getCost());
	            };
	
	            addClass(path, 0);
	            this.$graph.find("." + css.start).removeClass(css.start);
	            this.$graph.find("." + css.finish).removeClass(css.finish);
	        }
	    }]);

	    return GraphSolver;
	}();

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function pathTo(end) {
	  var currentNode = end;
	  var path = [];
	  while (currentNode.parent) {
	    path.unshift(currentNode);
	    currentNode = currentNode.parent;
	  }
	  return path;
	}
	
	function getHeap() {
	  return new BinaryHeap(function (node) {
	    return node.f;
	  });
	}
	
	var astar = exports.astar = {
	
	  search: function search(graph, start, end, options) {
	    graph.clearNodes();
	    options = options || {};
	    var heuristic = astar.algorithmic.manhattan;
	    var closest = options.closest || false;
	
	    var heap = getHeap();
	    var closestNode = start; // set the start node to be the closest if required
	
	    start.h = heuristic(start, end);
	    graph.markVisited(start);
	
	    heap.push(start);
	
	    while (heap.size() > 0) {
	      var currentNode = heap.pop();
	
	      if (currentNode === end) {
	        return pathTo(currentNode);
	      }
	
	      currentNode.closed = true;
	
	      var neighbors = graph.neighbors(currentNode);
	
	      for (var i = 0, il = neighbors.length; i < il; ++i) {
	        var neighbor = neighbors[i];
	
	        if (neighbor.closed || neighbor.isWall()) {
	          continue;
	        }
	
	        var gScore = currentNode.g + neighbor.getCost(currentNode);
	        var beenVisited = neighbor.visited;
	
	        if (!beenVisited || gScore < neighbor.g) {
	
	          neighbor.visited = true;
	          neighbor.parent = currentNode;
	          neighbor.h = neighbor.h || heuristic(neighbor, end);
	          neighbor.g = gScore;
	          neighbor.f = neighbor.g + neighbor.h;
	          graph.markVisited(neighbor);
	          if (closest) {
	            if (neighbor.h < closestNode.h || neighbor.h === closestNode.h && neighbor.g < closestNode.g) {
	              closestNode = neighbor;
	            }
	          }
	
	          if (!beenVisited) {
	            heap.push(neighbor);
	          } else {
	            heap.rescoreElement(neighbor);
	          }
	        }
	      }
	    }
	
	    if (closest) {
	      return pathTo(closestNode);
	    }
	
	    return [];
	  },
	  algorithmic: {
	    manhattan: function manhattan(pos0, pos1) {
	      var d1 = Math.abs(pos1.x - pos0.x);
	      var d2 = Math.abs(pos1.y - pos0.y);
	      return d1 + d2;
	    }
	  },
	  cleanNode: function cleanNode(node) {
	    node.f = 0;
	    node.g = 0;
	    node.h = 0;
	    node.visited = false;
	    node.closed = false;
	    node.parent = null;
	  }
	};
	
	function BinaryHeap(scoreFunction) {
	  this.content = [];
	  this.scoreFunction = scoreFunction;
	}
	
	BinaryHeap.prototype = {
	  push: function push(element) {
	    this.content.push(element);
	
	    this.sinkDown(this.content.length - 1);
	  },
	  pop: function pop() {
	    var result = this.content[0];
	    var end = this.content.pop();
	    if (this.content.length > 0) {
	      this.content[0] = end;
	      this.bubbleUp(0);
	    }
	    return result;
	  },
	  remove: function remove(node) {
	    var i = this.content.indexOf(node);
	
	    var end = this.content.pop();
	
	    if (i !== this.content.length - 1) {
	      this.content[i] = end;
	
	      if (this.scoreFunction(end) < this.scoreFunction(node)) {
	        this.sinkDown(i);
	      } else {
	        this.bubbleUp(i);
	      }
	    }
	  },
	  size: function size() {
	    return this.content.length;
	  },
	  rescoreElement: function rescoreElement(node) {
	    this.sinkDown(this.content.indexOf(node));
	  },
	  sinkDown: function sinkDown(n) {
	    var element = this.content[n];
	
	    while (n > 0) {
	
	      var parentN = (n + 1 >> 1) - 1;
	      var parent = this.content[parentN];
	      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
	        this.content[parentN] = element;
	        this.content[n] = parent;
	        n = parentN;
	      } else {
	        break;
	      }
	    }
	  },
	  bubbleUp: function bubbleUp(n) {
	    var length = this.content.length;
	    var element = this.content[n];
	    var elemScore = this.scoreFunction(element);
	
	    while (true) {
	      var child2N = n + 1 << 1;
	      var child1N = child2N - 1;
	      var swap = null;
	      var child1Score = void 0;
	      if (child1N < length) {
	        var child1 = this.content[child1N];
	        child1Score = this.scoreFunction(child1);
	
	        if (child1Score < elemScore) {
	          swap = child1N;
	        }
	      }
	
	      if (child2N < length) {
	        var child2 = this.content[child2N];
	        var child2Score = this.scoreFunction(child2);
	        if (child2Score < (swap === null ? elemScore : child1Score)) {
	          swap = child2N;
	        }
	      }
	
	      if (swap !== null) {
	        this.content[n] = this.content[swap];
	        this.content[swap] = element;
	        n = swap;
	      } else {
	        break;
	      }
	    }
	  }
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _algo = __webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Graph = function () {
	  function Graph(gridIn, options) {
	    _classCallCheck(this, Graph);
	
	    options = options || {};
	    this.nodeList = [];
	    this.grid = [];
	    for (var x = 0; x < gridIn.length; x++) {
	      this.grid[x] = [];
	
	      for (var y = 0, row = gridIn[x]; y < row.length; y++) {
	        var node = new GridNode(x, y, row[y]);
	        this.grid[x][y] = node;
	        this.nodeList.push(node);
	      }
	    }
	    this.init();
	  }
	
	  _createClass(Graph, [{
	    key: "init",
	    value: function init() {
	      this.visitedNodes = [];
	      for (var i = 0; i < this.nodeList.length; i++) {
	        _algo.astar.cleanNode(this.nodeList[i]);
	      }
	    }
	  }, {
	    key: "clearNodes",
	    value: function clearNodes() {
	      for (var i = 0; i < this.visitedNodes.length; i++) {
	        _algo.astar.cleanNode(this.visitedNodes[i]);
	      }
	      this.visitedNodes = [];
	    }
	  }, {
	    key: "markVisited",
	    value: function markVisited(node) {
	      this.visitedNodes.push(node);
	    }
	  }, {
	    key: "neighbors",
	    value: function neighbors(node) {
	      var ret = [];
	      var x = node.x;
	      var y = node.y;
	      var grid = this.grid;
	
	      if (grid[x - 1] && grid[x - 1][y]) {
	        ret.push(grid[x - 1][y]);
	      }
	
	      if (grid[x + 1] && grid[x + 1][y]) {
	        ret.push(grid[x + 1][y]);
	      }
	
	      if (grid[x] && grid[x][y - 1]) {
	        ret.push(grid[x][y - 1]);
	      }
	
	      if (grid[x] && grid[x][y + 1]) {
	        ret.push(grid[x][y + 1]);
	      }
	      return ret;
	    }
	  }, {
	    key: "toString",
	    value: function toString() {
	      var graphString = [];
	      var nodes = this.grid;
	      for (var x = 0; x < nodes.length; x++) {
	        var rowDebug = [];
	        var row = nodes[x];
	        for (var y = 0; y < row.length; y++) {
	          rowDebug.push(row[y].cost);
	        }
	        graphString.push(rowDebug.join(" "));
	      }
	      return graphString.join("\n");
	    }
	  }]);
	
	  return Graph;
	}();
	
	exports.default = Graph;
	
	var GridNode = function () {
	  function GridNode(x, y, cost) {
	    _classCallCheck(this, GridNode);
	
	    this.x = x;
	    this.y = y;
	    this.cost = cost;
	  }
	
	  _createClass(GridNode, [{
	    key: "toString",
	    value: function toString() {
	      return "[" + this.x + " " + this.y + "]";
	    }
	  }, {
	    key: "getCost",
	    value: function getCost(fromNeighbor) {
	      return this.cost;
	    }
	  }, {
	    key: "isWall",
	    value: function isWall() {
	      return this.cost === 0;
	    }
	  }]);

	  return GridNode;
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function pathTo(end) {
	  var currentNode = end;
	  var path = [];
	  while (currentNode.parent) {
	    path.unshift(currentNode);
	    currentNode = currentNode.parent;
	  }
	  return path;
	}
	
	var bfs = exports.bfs = {
	
	  search: function search(graph, start, end, options) {
	    graph.clearNodes();
	    var closest = options.closest || false;
	
	    var mySet = new Set();
	    var myQueue = [];
	    var closestNode = start; // set the start node to be the closest if required
	
	    graph.markVisited(start);
	
	    myQueue.push(start);
	
	    while (myQueue.length > 0) {
	      var currentNode = myQueue.shift();
	
	      if (currentNode === end) {
	        return pathTo(currentNode);
	      }
	
	      currentNode.closed = true;
	
	      var neighbors = graph.neighbors(currentNode);
	
	      for (var i = 0, il = neighbors.length; i < il; ++i) {
	        var neighbor = neighbors[i];
	
	        if (neighbor.closed || neighbor.isWall()) {
	          continue;
	        }
	        var beenVisited = neighbor.visited;
	
	        if (!beenVisited) {
	          myQueue.push(neighbor);
	          neighbor.visited = true;
	          neighbor.parent = currentNode;
	          graph.markVisited(neighbor);
	        }
	      }
	    }
	
	    if (closest) {
	      return pathTo(closestNode);
	    }
	
	    return [];
	  },
	  cleanNode: function cleanNode(node) {
	    node.visited = false;
	    node.closed = false;
	    node.parent = null;
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map