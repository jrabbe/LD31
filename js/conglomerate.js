
var LD31 = (function (paper, LD31) {

    function Conglomerate (index, marketCap) {
        this._index = index;
        this._marketCap = marketCap;

        this._businesses = new paper.Group();
        var m = marketCap;
        while (m > 0) {

            var size = LD31.utils.between(LD31.settings.minStartSize, Math.min(LD31.settings.maxStartSize, m));
            var biz = new LD31.Business(index, size, this);
            this._businesses.addChild(biz.getPath());

            m -= size;
        }

        this._businesses.__ = this;
        this._businesses.type = 'Conglomerate';
    }

    Conglomerate.prototype.getGroup = function () {
        return this._businesses;
    };

    Conglomerate.prototype.createScore = function () {

        var zoom = LD31.settings.zoomFactor;
        var xsign = LD31.utils.negativity(LD31.settings.corners[this._index][0]);
        var ysign = LD31.utils.negativity(LD31.settings.corners[this._index][1]);
        var startx = LD31.world.width * LD31.settings.corners[this._index][0];
        var starty = LD31.world.height * LD31.settings.corners[this._index][1];
        var endy = starty - ysign * LD31.settings.scoreBaseHeight * zoom;

        var background = new paper.Path();
        background.add([startx, starty]);
        background.add([startx - xsign * LD31.settings.scoreBaseWidth * zoom, starty]);
        background.add([startx - xsign * (LD31.settings.scoreBaseWidth - 5) * zoom, endy]);
        background.add([startx, endy]);
        background.closed = true;
        background.fillColor = LD31.settings.colors[this._index];

        this.score = new paper.PointText({
            point: [startx - xsign * 4.8 * zoom, starty - ysign * 4.8 * zoom + 3.2 * zoom],
            content: this._marketCap,
            fillColor: LD31.settings.baseColor,
            fontSize: 7.2 * zoom,
            justification: xsign > 0 ? 'right' : 'left'
        });

        var group = new paper.Group();
        group.addChild(background);
        group.addChild(this.score);
        return group;
    };

    Conglomerate.prototype.updateScore = function (delta) {
        this._marketCap += delta;
        this.score.content = Math.round(this._marketCap);
    };

    LD31.Conglomerate = Conglomerate;
    return LD31;

})(paper, LD31 || {});
