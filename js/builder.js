/*
   How should businesses be represented? a MAX_SIZE x MAX_SIZE grid that can be used to add to, and remove from, a business?
   If we do that, we need an efficient way to go from representation to drawing.
   Probably makes sense to do a complete redrawing of a changed business (in the background), and display the update asap.
 */

var LD31 = (function (window, document, paper, LD31) {

    var MAX_BUSINESSES = 100;
    var MAX_SIZE = 10;
    var MIN_SIZE = 5;
    var MAX_BLOCK_WIDTH = 3;
    var MAX_BLOCK_HEIGHT = 3;

    var BASE_CENTER_OFFSET = 8;
    var BASE_ELEMENT_SIZE = 32;
    var last = 0;

    var COLORS = ['#86c1f4', '#7fcb9f', '#f4ba6f', '#ea6d64'];
    var BASE_COLOR = '#ffffff';

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
        var buildingMaxSize = MAX_SIZE * BASE_ELEMENT_SIZE;
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
        // create new business
        var size = LD31.utils.between(MIN_SIZE, MAX_SIZE);
        var b = new LD31.Building(size);

        console.log('created building:\n', b.toString());

        return drawBuilding(b.bricks, b.width, b.height, cx, cy);
    }

    // ---------------------------------------------------------------------------------------------
    // Drawing
    // ---------------------------------------------------------------------------------------------

    function drawBuilding(building, width, height, cx, cy) {
        var x, y, w, h, block;
        var group = new paper.Group();
        var element;
        var color = COLORS[LD31.utils.between(0, COLORS.length - 1)];
        // line is centered, so base size = BES - 2 * (BLS / 2) = BES - BLS
        var baseSize = BASE_ELEMENT_SIZE;
        var lineOffset = -BASE_CENTER_OFFSET;

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

                w = d.w * (baseSize + lineOffset) - lineOffset;
                h = d.h * (baseSize + lineOffset) - lineOffset;
                px = x * (baseSize + lineOffset);
                py = y * (baseSize + lineOffset);

                // console.log('drawing element [%o, %o, %o, %o] from [%o, %o, %o, %o]', px, py, w, h, x, y, d.w, d.h);
                if (d.w === 1 && d.h === 1) {
                    var n = neighbors(building, x, y);
                    // if forming a top, 50/50 square or dome
                    if (!n.top) {
                        if (!n.left && !n.right) {
                            element = dome(px, py, w, h, color);
                        } else if (!n.left) {
                            // TODO: triangles need more work!
                            element = leftTriangle(px, py, w, h, color);
                        } else if (!n.right) {
                            element = rightTriangle(px, py, w, h, color);
                        }
                    }
                }

                if (!element) {
                    element = rectangle(px, py, w, h, color);
                }

                group.addChild(element);
            }
        }

        var sideOfMaxSize = MAX_SIZE * baseSize + lineOffset * 2;
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

    function leftTriangle(x, y, w, h, color) {
        var g = new paper.Group();
        var p = new paper.Path();
        p.fillColor = color;

        p.add([x, y]);
        p.lineTo([x, y + BASE_CENTER_OFFSET]);
        p.lineTo([x + w - BASE_CENTER_OFFSET, y + h]);
        p.lineTo([x + w, y + h]);
        p.lineTo([x + w , y]);
        p.closed = true;
        g.addChild(p);

        var xi = x + BASE_CENTER_OFFSET;
        var yi = y + BASE_CENTER_OFFSET;
        var wi = w - 2 * BASE_CENTER_OFFSET;
        var hi = h - 2 * BASE_CENTER_OFFSET;

        var i = new paper.Path();
        i.fillColor = BASE_COLOR;

        i.add([xi, yi]);
        i.lineTo([xi + wi, yi + hi]);
        i.lineTo([xi + wi, yi]);
        i.closed = true;
        g.addChild(i);

        return g;
    }

    function rightTriangle(x, y, w, h, color) {
        var g = new paper.Group();
        var p = new paper.Path();
        p.fillColor = color;

        p.add([x, y]);
        p.lineTo([x, y + h]);
        p.lineTo([x + BASE_CENTER_OFFSET, y + h]);
        p.lineTo([x + w, y + BASE_CENTER_OFFSET]);
        p.lineTo([x + w, y]);
        p.closed = true;
        g.addChild(p);

        var xi = x + BASE_CENTER_OFFSET;
        var yi = y + BASE_CENTER_OFFSET;
        var wi = w - 2 * BASE_CENTER_OFFSET;
        var hi = h - 2 * BASE_CENTER_OFFSET;

        var i = new paper.Path();
        i.fillColor = BASE_COLOR;

        i.add([xi, yi]);
        i.lineTo([xi, yi + hi]);
        i.lineTo([xi + wi, yi]);
        i.closed = true;
        g.addChild(i);

        return g;
    }

    function rectangle(x, y, w, h, color) {
        var g = new paper.Group();
        var p = new paper.Path.Rectangle({
            point: [x, y],
            size: [w, h],
            fillColor: color
        });
        g.addChild(p);

        var xi = x + BASE_CENTER_OFFSET;
        var yi = y + BASE_CENTER_OFFSET;
        var wi = w - 2 * BASE_CENTER_OFFSET;
        var hi = h - 2 * BASE_CENTER_OFFSET;

        var i = new paper.Path.Rectangle({
            point: [xi, yi],
            size: [wi, hi],
            fillColor: BASE_COLOR
        });
        g.addChild(i);

        return g;
    }

    function dome(x, y, w, h, color) {
        // console.log('creating dome for [%o, %o, %o, %o]', x, y, w, h);
        var g = new paper.Group();
        var p = new paper.Path();
        p.fillColor = color;

        p.add([x, y]);
        p.lineTo([x, y + h / 2]);
        p.arcTo([x + w / 2, y + h], [x + w, y + h / 2]);
        p.lineTo([x + w, y]);
        p.closed = true;
        g.addChild(p);

        var xi = x + BASE_CENTER_OFFSET;
        var yi = y + BASE_CENTER_OFFSET;
        var wi = w - 2 * BASE_CENTER_OFFSET;
        var hi = h - 2 * BASE_CENTER_OFFSET;

        var i = new paper.Path();
        i.fillColor = BASE_COLOR;

        i.add([xi, yi]);
        i.lineTo([xi, yi + hi / 2]);
        i.arcTo([xi + wi / 2, yi + hi], [xi + wi, yi + hi / 2]);
        i.lineTo([xi + wi, yi]);
        i.closed = true;
        g.addChild(i);

        return g;
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
