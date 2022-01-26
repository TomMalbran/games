/**
 * A* (A-Star) algorithm for a path finder
 */

/**
 * Finds succesors in Diagonal algo
 * @param {Boolean} $N
 * @param {Boolean} $S
 * @param {Boolean} $E
 * @param {Boolean} $W
 * @param {Number}  N
 * @param {Number}  S
 * @param {Number}  E
 * @param {Number}  W
 * @param {Array}   grid
 * @param {Number}  rows
 * @param {Number}  cols
 * @param {Array}   result
 * @param {Number}  walkable
 * @returns {Array}
 */
function diagonalSuccessors($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, walkable) {
    if ($N) {
        if ($E && grid[N][E] < walkable) {
            result.push({ x: E, y: N });
        }
        if ($W && grid[N][W] < walkable) {
            result.push({ x: W, y: N });
        }
    }
    if ($S) {
        if ($E && grid[S][E] < walkable) {
            result.push({ x: E, y: S });
        }
        if ($W && grid[S][W] < walkable) {
            result.push({ x: W, y: S });
        }
    }
    return result;
}

/**
 * Finds succesors in Diagonal Free algo
 * @param {Boolean} $N
 * @param {Boolean} $S
 * @param {Boolean} $E
 * @param {Boolean} $W
 * @param {Number}  N
 * @param {Number}  S
 * @param {Number}  E
 * @param {Number}  W
 * @param {Array}   grid
 * @param {Number}  rows
 * @param {Number}  cols
 * @param {Array}   result
 * @param {Number}  walkable
 * @returns {Array}
 */
function diagonalSuccessorsFree($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, walkable) {
    $N = N > -1;
    $S = S < rows;
    $E = E < cols;
    $W = W > -1;
    if ($E) {
        if ($N && grid[N][E] < walkable) {
            result.push({ x: E, y: N });
        }
        if ($S && grid[S][E] < walkable) {
            result.push({ x: E, y: S });
        }
    }
    if ($W) {
        if ($N && grid[N][W] < walkable) {
            result.push({ x: W, y: N });
        }
        if ($S && grid[S][W] < walkable) {
            result.push({ x: W, y: S });
        }
    }
    return result;
}

/**
 * Finds nothing
 * @param {Boolean} $N
 * @param {Boolean} $S
 * @param {Boolean} $E
 * @param {Boolean} $W
 * @param {Number}  N
 * @param {Number}  S
 * @param {Number}  E
 * @param {Number}  W
 * @param {Array}   grid
 * @param {Number}  rows
 * @param {Number}  cols
 * @param {Array}   result
 * @param {Number}  walkable
 * @returns {Array}
 */
function nothingToDo($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, walkable) {
    return result;
}

/**
 * Returns a list of succesors
 * @param {Function} find
 * @param {Number}   x
 * @param {Number}   y
 * @param {Array}    grid
 * @param {Number}   rows
 * @param {Number}   cols
 * @param {Number}   walkable
 * @returns {Array}
 */
function successors(find, x, y, grid, rows, cols, walkable) {
    const N  = y - 1;
    const S  = y + 1;
    const E  = x + 1;
    const W  = x - 1;
    const $N = N > -1   && grid[N][x] < walkable;
    const $S = S < rows && grid[S][x] < walkable;
    const $E = E < cols && grid[y][E] < walkable;
    const $W = W > -1   && grid[y][W] < walkable;
    const result = [];

    if ($N) {
        result.push({ x: x, y: N });
    }
    if ($E) {
        result.push({ x: E, y: y });
    }
    if ($S) {
        result.push({ x: x, y: S });
    }
    if ($W) {
        result.push({ x: W, y: y });
    }
    return find($N, $S, $E, $W, N, S, E, W, grid, rows, cols, result, walkable);
}

/**
 * Calculates the Diagonal Distance
 * @param {Object} start
 * @param {Object} end
 * @returns {Number}
 */
function diagonal(start, end) {
    return Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y));
}

/**
 * Calculates the Euclidean Distance
 * @param {Object} start
 * @param {Object} end
 * @returns {Number}
 */
function euclidean(start, end) {
    const x = start.x - end.x;
    const y = start.y - end.y;
    return Math.sqrt(x * x + y * y);
}

/**
 * Calculates the Manhattan Distance
 * @param {Object} start
 * @param {Object} end
 * @returns {Number}
 */
function manhattan(start, end) {
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}



/**
 * Returns a Path using the AStar algorithm
 * @param {Number[][]}             grid
 * @param {{x: Number, y: Number}} start
 * @param {{x: Number, y: Number}} end
 * @param {String}                 func
 * @param {Number}                 walkable
 * @returns {{x: Number, y: Number}[]}
 */
export default function AStar(grid, start, end, func, walkable) {
    const cols   = grid[0].length;
    const rows   = grid.length;
    const limit  = cols * rows;
    const list   = {};
    const result = [];
    const open   = [{ x: start.x, y: start.y, f: 0, g: 0, v: start.x + start.y * cols }];
    const last   = { x: end.x, y: end.y, v: end.x + end.y * cols };
    let   length = 1;

    let distance, find;
    switch (func) {
    case "Diagonal":
        distance = diagonal;
        find     = diagonalSuccessors;
        break;
    case "DiagonalFree":
        distance = diagonal;
        find     = diagonalSuccessorsFree;
        break;
    case "Euclidean":
        distance = euclidean;
        find     = diagonalSuccessors;
        break;
    case "EuclideanFree":
        distance = euclidean;
        find     = diagonalSuccessorsFree;
        break;
    default:
        distance = manhattan;
        find     = nothingToDo;
        break;
    }

    let i, j;
    do {
        let max = limit;
        let min = 0;
        for (i = 0; i < length; ++i) {
            if (open[i].f < max) {
                max = open[i].f;
                min = i;
            }
        }
        let current = open.splice(min, 1)[0];
        if (current.v !== last.v) {
            --length;
            const next = successors(find, current.x, current.y, grid, rows, cols, walkable);
            for (i = 0, j = next.length; i < j; ++i) {
                const adj = next[i];
                adj.p = current;
                adj.f = adj.g = 0;
                adj.v = adj.x + adj.y * cols;
                if (!list.hasOwnProperty(adj.v)) {
                    adj.g = current.g + distance(adj, current);
                    adj.f = adj.g + distance(adj, last);
                    open[length++] = adj;
                    list[adj.v] = 1;
                }
            }
        } else {
            i = length = 0;
            do {
                result[i++] = { x: current.x, y: current.y };
                current = current.p;
            } while (current);
            result.reverse();
        }
    } while (length);

    return result;
}
