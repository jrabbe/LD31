/*
   How should businesses be represented? a MAX_SIZE x MAX_SIZE grid that can be used to add to, and remove from, a business?
   If we do that, we need an efficient way to go from representation to drawing.
   Probably makes sense to do a complete redrawing of a changed business (in the background), and display the update asap.
 */

var LD31 = (function (window, document, paper, LD31) {

    var MAX_BUSINESSES = 100;
    var MAX_SIZE = 15;
    var MIN_SIZE = 5;
    var MAX_BLOCK_WIDTH = 3;
    var MAX_BLOCK_HEIGHT = 3;

    var BASE_LINE_SIZE = 8;
    var BASE_ELEMENT_SIZE = 24;
    var last = 0;

    var BLOCK_TYPES = [{w: 1, h: 1}, {w: 2, h: 1}, {w: 3, h: 1}, {w: 4, h: 1}, {w: 1, h: 2}, {w: 1, h: 3}];
    var COLORS = ['#86c1f4', '#7fcb9f', '#f4ba6f', '#ea6d64'];

    var counter = 0;

    window.onload = function () {
        var canvas = document.getElementById('gameboard');
        LD31.builder = new LD31.Builder(canvas);
    };

    function Builder (canvas) {
        paper.setup(canvas);
        this._init();

        paper.view.on('frame', this.update);
    }

    Builder.prototype.update = function (event) {
        // randomly add -MIN_SIZE to MIN_SIZE from each business

        if (Math.floor(event.time) > last) {
            last = Math.floor(event.time);

            // only update ca. once per second


        }
    };

    Builder.prototype._init = function () {
        var bounds = paper.view.bounds;
        var buildingMaxSize = MAX_SIZE * (BASE_ELEMENT_SIZE - BASE_LINE_SIZE) + BASE_LINE_SIZE;
        var maxX = Math.floor(bounds.width / buildingMaxSize);
        var maxY = Math.floor(bounds.height / buildingMaxSize);

        console.log('creating buildings from %ox%o to %ox%o', 0, 0, maxX, maxY);
        var group = new paper.Group();
        var b;
        for (var x = 0; x < maxX; x++) {
            for (var y = 0; y < maxY; y++) {
                b = createBuilding(x, y);
                group.addChild(b);
            }
        }

        var width = maxX * buildingMaxSize;
        var height = maxY * buildingMaxSize;
        var offsetX = (bounds.width - width) / 2;
        var offsetY = (bounds.height - height) / 2;
        // console.log('bounds = %o x %o, width = %o, height = %o', paper.view.bounds.width, paper.view.bounds.height, width, height);
        // console.log('offsetting by %o, %o', offsetX, offsetY);

        group.translate([offsetX, offsetY]);
    };

    function createBuilding(cx, cy) {
        var x, y, dx, dy;

        // create new business
        var size = LD31.utils.between(MIN_SIZE, MAX_SIZE);
        var width = LD31.utils.between(1, size);
        var height = Math.ceil(size / width);

        var grid = [];
        for (x = 0; x < width; x++) {
            grid.push([]);
            for (y = 0; y < height; y++) {
                grid[x].push(0);
            }
        }

        // console.log('creating item with size = %o, results in grid with %ox%o', size, width, height);

        // add pieces;
        var filled = 0;
        var block = 1;
        var it = 0;
        while (filled < size) {

            // Temporary bailout code
            it++;
            if (it > 1000) {
                console.log("forcing breakout with filled = %o, block = %, size = %o", filled, block, size);
                break;
            }

            var delta = placeBuilding(grid, block, width, height, size - filled);
            if (delta > 0) {
                filled += delta;
                block++;
            }
        }

        // console.log('created building:\n', printBuilding(grid));

        return drawBuilding(grid, width, height, cx, cy);
    }

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

    function printBuilding(building) {
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
    }

    function drawBuilding(building, width, height, cx, cy) {
        var x, y, w, h, block;
        var group = new paper.Group();
        var element;
        var color = COLORS[LD31.utils.between(0, COLORS.length - 1)];
        // line is centered, so base size = BES - 2 * (BLS / 2) = BES - BLS
        var baseSize = BASE_ELEMENT_SIZE - BASE_LINE_SIZE;
        var lineOffset = BASE_LINE_SIZE / 2;

        var buildingCopy = copy(building);
        // console.log('copied building:\n', printBuilding(buildingCopy));

        // TODO a better way might be to draw the outline, and then place the blocks inside
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                if (buildingCopy[x][y] === 0) {
                    continue;
                }

                element = undefined;

                block = buildingCopy[x][y];
                var d = traverse(buildingCopy, block, x, y, width, height);
                // console.log('building after traverse:\n', printBuilding(buildingCopy));

                // console.log('element base coords: [%o, %o, %o, %o]', x, y, d.w, d.h);

                w = d.w * baseSize;
                h = d.h * baseSize;
                px = x * baseSize + lineOffset;
                py = y * baseSize + lineOffset;

                // console.log('drawing element [%o, %o, %o, %o] from [%o, %o, %o, %o]', px, py, w, h, x, y, d.w, d.h);
                if (d.w === 1 && d.h === 1) {
                    var n = neighbors(building, x, y);
                    // if forming a top, 50/50 square or dome
                    if (!n.top) {
                        if (!(n.left || n.right) && !!LD31.utils.between(0, 1)) {
                            element = dome(px, py, w, h);
                        // } else if (!n.left) {
                        //     // TODO: triangles need more work!
                        //     element = leftTriangle(px, py, w, h);
                        // } else if (!n.right) {
                        //     element = rightTriangle(px, py, w, h);
                        }
                    }
                }

                if (!element) {
                    element = rectangle(px, py, w, h);
                }

                group.addChild(element);
            }
        }

        var sideOfMaxSize = MAX_SIZE * baseSize + lineOffset * 2;
        group.strokeColor = color;
        group.rotation = 180;
        group.position = [
            cx * sideOfMaxSize + sideOfMaxSize / 2,
            cy * sideOfMaxSize + sideOfMaxSize / 2
        ];

        return group;
    }

    function neighbors(building, x, y) {
        var result = {};
        result.top = (y + 1 < building[x].length && building[x][y + 1] !== 0);
        result.right = (x + 1 < building.length && building[x + 1][y] !== 0);
        result.bottom = (y > 0);
        result.left = (x > 0 && building[x - 1][y] !== 0);

        result.topLeft = (y + 1 < building[x].length && x > 0 && building[x - 1][y + 1] !== 0);
        result.topRight = (y + 1 < building[x].length && x + 1 < building.length && building[x + 1][y + 1] !== 0);
        result.bottomRight = (y > 0 && x + 1 < building.length && building[x + 1][y - 1] !== 0);
        result.bottomLeft = (y + 1 < building[x].length && x > 0 && building[x - 1][y - 1] !== 0);

        return result;
    }

    function loneTop(building, x, y) {
        // left neighbor is not empty
        if (x > 0 && building[x -1][y] !== 0) {
            return false;
        }

        // right neighbor is not empty
        if (x + 1 < building.length && building[x + 1][y] !== 0) {
            return false;
        }

        // top neighbor is not empty
        if (y + 1 < building[x].length && building[x][y + 1] !== 0) {
            return false;
        }

        // neighbors both at sides and top are empty
        return true;
    }

    function leftTriangle(x, y, w, h) {
        var p = new paper.Path();
        p.strokeColor = '#990000';
        p.strokeWidth = BASE_LINE_SIZE;
        p.strokeJoin = 'bevel';
        p.fillColor = '#FFFFF';

        p.add([x - BASE_LINE_SIZE / 2, y]);
        p.lineTo([x + w, y + h + BASE_LINE_SIZE / 2]);
        p.lineTo([x + w, y]);
        p.closed = true;

        return p;
    }

    function rightTriangle(x, y, w, h) {
        var p = new paper.Path();
        p.strokeColor = '#990000';
        p.strokeWidth = BASE_LINE_SIZE;
        p.strokeJoin = 'bevel';
        p.fillColor = '#FFFFF';

        p.add([x, y]);
        p.lineTo([x, y + h + BASE_LINE_SIZE / 2]);
        p.lineTo([x + w + BASE_LINE_SIZE / 2, y]);
        p.closed = true;

        return p;
    }

    function rectangle(x, y, w, h) {
        return new paper.Path.Rectangle({
            point: [x, y],
            size: [w, h],
            strokeColor: '#990000',
            strokeWidth: BASE_LINE_SIZE,
            fillColor: '#FFFFFF'
        });
    }

    function dome(x, y, w, h) {
        // console.log('creating dome for [%o, %o, %o, %o]', x, y, w, h);
        var p = new paper.Path();
        p.strokeColor = '#990000';
        p.strokeWidth = BASE_LINE_SIZE;
        p.fillColor = '#FFFFF';

        p.add([x, y]);
        p.lineTo([x, y + h / 2]);
        p.arcTo([x + w / 2, y + h], [x + w, y + h / 2]);
        p.lineTo([x + w, y]);
        p.closed = true;

        return p;
    }

    function copy(building) {
        var _copy = [];
        for (var x = 0; x < building.length; x++) {
            _copy.push([]);
            for (var y = 0; y < building[x].length; y++) {
                _copy[x][y] = building[x][y];
            }
        }

        return _copy;
    }

    function traverse(building, block, x, y, width, height) {
        var w = 1, h = 1, t;

        building[x][y] = 0;
        if (x + 1 < building.length && building[x + 1][y] === block) {
            t = traverse(building, block, x + 1, y, width, height);
            w += t.w;
        } else if (y + 1 < building[x].length && building[x][y + 1] === block) {
            t = traverse(building, block, x, y + 1, width, height);
            h += t.h;
        }

        return {w: w, h: h};
    }

    LD31.Builder = Builder;
    return LD31;

})(window, document, paper, LD31 || {});
