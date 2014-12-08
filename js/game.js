
var LD31 = (function (window, document, paper, LD31) {

    window.onload = function () {
        var canvas = document.getElementById('gameboard');
        LD31.game = new Game(canvas);
    };

    function Game (canvas) {
        paper.setup(canvas);
        this._init();
    }

    Game.prototype._init = function () {
        LD31.world.init();

        this.conglomarates = new paper.Group();
        this.scores = new paper.Group();
        for (var i = 0; i < LD31.settings.players; i++) {
            var conglomerate = new LD31.Conglomerate(i, LD31.settings.startingMarketCap);
            this.conglomarates.addChild(conglomerate.getGroup());
            this.scores.addChild(conglomerate.createScore());
        }

        var overlay = new LD31.Overlay();

        paper.view.zoom = 1/LD31.settings.zoomFactor;
        paper.view.center = [LD31.world.width / 2, LD31.world.height / 2];
        paper.view.draw();
        console.log(paper.view.bounds);

        var self = this;
        LD31.on('zoom', function (pos) {
            LD31.world.zoom(pos);
            self.scores.visible = !LD31.world.zoomed;
        });

        paper.view.on('frame', this.update);

        var tool = new paper.Tool();
        tool.onKeyDown = function (event) {
            console.log(event);
            if (event.key === 'escape') {
                LD31.world.paused = !LD31.world.paused;
            } else if (event.key === 'n') {
                LD31.emit('action', 'N');
            } else if (event.key === 'm') {
                LD31.emit('action', 'M');
            } else if (event.key === 't') {
                LD31.emit('action', 'T');
            }
        };
    };

    Game.prototype.getBusinessesWithin = function (bounds) {
        return this.conglomarates.getItems({inside: bounds});
    };

    Game.prototype.update = function () {
        if (!LD31.world.paused) {
            LD31.emit('update');
        }
    };

    return LD31;

})(window, document, paper, LD31 || {});
