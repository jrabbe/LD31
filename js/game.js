
var LD31 = (function (window, document, paper, LD31) {

    LD31._biz = {};

    window.onload = function () {
        var canvas = document.getElementById('gameboard');
        paper.setup(canvas);

        LD31._biz.conglomarates = [];
        LD31.world = {
            width: paper.view.size.width * LD31.settings.zoomFactor,
            height: paper.view.size.height * LD31.settings.zoomFactor
        };

        var background = new LD31.Background();

        LD31._biz.scores = new paper.Group();
        for (var i = 0; i < LD31.settings.players; i++) {
            var conglomerate = new LD31.Conglomerate(i, LD31.settings.startingMarketCap);
            LD31._biz.conglomarates.push(conglomerate);
            LD31._biz.scores.addChild(conglomerate.createScore());
        }

        paper.view.zoom = 0.1;
        paper.view.center = [LD31.world.width / 2, LD31.world.height / 2];
        paper.view.draw();

        console.log(paper.view.bounds);
    };

    return LD31;

})(window, document, paper, LD31 || {});
