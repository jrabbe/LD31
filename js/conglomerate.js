
var LD31 = (function (paper, LD31) {

    function Conglomerate(index, marketCap) {
        this._index = index;
        this._marketCap = marketCap;

        this._businesses = new paper.Group();
        var m = marketCap;
        while (m > 0) {

            var size = Math.min(LD31.utils.between(LD31.settings.minStartSize, LD31.settings.maxStartSize), m);
            var biz = new LD31.Business(index, size);
            this._businesses.addChild(biz.getPath());

            m -= size;
        }
    }

    Conglomerate.prototype.createScore = function () {
        var group = new paper.Group();

        var xsign = LD31.utils.negativity(LD31.settings.corners[this._index][0]);
        var ysign = LD31.utils.negativity(LD31.settings.corners[this._index][1]);
        var startx = LD31.world.width * LD31.settings.corners[this._index][0];
        var starty = LD31.world.height * LD31.settings.corners[this._index][1];
        console.log('creating score[%o] : startx = %o, starty = %o, xsign = %o, ysign = %o', this._index, startx, starty, xsign, ysign);
        var background = new paper.Path();
        background.add([startx, starty]);
        background.add([startx - xsign * 1000, starty]);
        background.add([startx - xsign * 800, starty - ysign * 200]);
        background.add([startx, starty - ysign * 200]);
        background.closed = true;
        background.fillColor = LD31.settings.colors[this._index];

        group.addChild(background);

        // var ba = new paper.Path.Circle({
        //     center: [paper.view.size.width * LD31.settings.corners[this._index][0], paper.view.size.height * LD31.settings.corners[this._index][1]],
        //     radius: 32,
        //     strokeColor: LD31.settings.baseColor,
        //     fillColor: LD31.settings.colors[this._index]
        // });

        // var bt = new paper.PointText({
        //     point: [paper.view.size.width * LD31.settings.corners[this._index][0] - 12 * LD31.utils.negativity(LD31.settings.corners[this._index][0]),
        //             paper.view.size.height * LD31.settings.corners[this._index][1] - 12 * LD31.utils.negativity(LD31.settings.corners[this._index][1]) + 4],
        //     content: '0',
        //     fillColor: LD31.settings.baseColor,
        //     fontFamily: 'Helvetica Neue',
        //     fontSize: 16,
        //     justification: 'center'
        // });

        // group.addChild(ba);
        // group.addChild(bt);

        return group;
    };

    LD31.Conglomerate = Conglomerate;
    return LD31;

})(paper, LD31 || {});
