// The architect

var LD31 = (function (paper, LD31) {

    var BLOCK_TYPES = [{w: 1, h: 1}, {w: 2, h: 1}, {w: 3, h: 1}, {w: 4, h: 1}, {w: 1, h: 2}, {w: 1, h: 3}];

    function Building(size) {
        this.size = size;
        this._init();
    }

    Building.prototype = {
        get size () {
            return this._size;
        },
        set size (size) {
            this._size = size;
        },
        get bricks () {
            return this._bricks;
        },
        set bricks (bricks) {
            this._bricks = bricks;
        },
        get width () {
            return this._width;
        },
        set width (width) {
            this._width = width;
        },
        get height () {
            return this._height;
        },
        set height (height) {
            this._height = height;
        }
    };

    Building.prototype._init = function () {
        this.width = LD31.utils.between(1, this.size);
        this.height = Math.ceil(this.size / this.width);

        var grid = [];
        for (var x = 0; x < this.width; x++) {
            grid.push([]);
            for (var y = 0; y < this.height; y++) {
                grid[x].push(0);
            }
        }

        // console.log('creating item with size = %o, results in grid with %ox%o', size, width, height);

        // add pieces;
        var filled = 0;
        var block = 1;
        var it = 0;
        while (filled < this.size) {

            // Temporary bailout code
            it++;
            if (it > 1000) {
                console.log("forcing breakout with filled = %o, block = %, size = %o", filled, block, this.size);
                break;
            }

            var delta = placeBuilding(grid, block, this.width, this.height, this.size - filled);
            if (delta > 0) {
                filled += delta;
                block++;
            }
        }

        this.bricks = grid;
    };

    Building.prototype.toString = function () {
        var building = this.bricks;
        var s = [];
        var sy = {};
        for (var x = 0; x < building.length; x++) {
            for (var y = 0; y < building[x].length; y++) {
                if (!sy.hasOwnProperty(y)) {
                    sy[y] = [];
                    s.push(y);
                }

                sy[y].push(building[x][y]);
            }
        }

        var v = [];
        for (var k in s) {
            v.push(sy[k].join(''));
        }

        v.reverse();

        return v.join('\n');
    };

    function placeBuilding(grid, block, width, height, remaining) {
        var wide = LD31.utils.between(0, 1);
        var typeIndex = LD31.utils.between(0, BLOCK_TYPES.length - 1);
        var type = BLOCK_TYPES[typeIndex];

        // console.log('selected block %ox%o', type.w, type.h);

        while (typeIndex >= 0 && (type.w * type.h > remaining || type.w > width || type.h > height)) {
            type = BLOCK_TYPES[--typeIndex];
        }

        if (typeIndex < 0) {
            return 0;
        }

        // console.log('checking block %ox%o', type.w, type.h);

        var w = type.w;
        var h = type.h;

        // console.log('trying to place part with size %o x %o into %o', w, h, grid);
        // TODO : if block is within size allow it to be e.g. centered or left aligned.

        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                // console.log('grid[%o][%o] = %o', x, y, grid[x][y]);
                if ((y > 0 && grid[x][y - 1] === 0) || y + h - 1 > grid[x].length || x + w - 1 == grid.length) {
                    // console.log('size %ox%o was invalid at %ox%o for remaining space', w, h, x, y);
                    return 0;
                }

                if (grid[x][y] === 0) {
                    var possible = checkCandidate(grid, x, y, w, h);

                    // console.log('checked block %ox%o for %ox%o and possible = %o', type.w, type.h, x, y, possible);

                    if (possible) {
                        // console.log('placing part with size %o x %o into %o', w, h, grid);

                        for (dx = 0; dx < w; dx++) {
                            for (dy = 0; dy < h; dy++) {
                                grid[x + dx][y + dy] = block;
                            }
                        }

                        return w * h;
                    }
                }
            }
        }

        return 0;
    }

    function checkCandidate(grid, x, y, w, h) {
        for (var dy = 0; dy < h; dy++) {
            for (var dx = 0; dx < w; dx++) {
                if (x + dx >= grid.length || y + dy >= grid[x + dx].length || grid[x + dx][y + dy] !== 0 ||
                    (y > 0 && grid[x + dx][y + dy - 1] === 0)) {
                    return false;
                }
            }
        }

        return true;
    }

    LD31.Building = Building;
    return LD31;

})(paper, LD31 || {});
