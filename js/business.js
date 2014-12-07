
var LD31 = (function (paper, LD31) {

    function Business(index, size) {
        var width = Math.round(LD31.settings.lineWidth * size / LD31.settings.baseSize);
        this._biz = new paper.Path.Rectangle({
            point: [LD31.utils.between(0, LD31.world.width - size), LD31.utils.between(0, LD31.world.height - size)],
            size: [size, size],
            strokeColor: LD31.settings.colors[index],
            strokeWidth: width,
            fillColor: LD31.settings.fillColor
        });

        var self = this;
        // this._biz.onFrame = function (event) {
        //     var x = LD31.utils.between(-1, 1) * 5 / size;
        //     var y = LD31.utils.between(-1, 1) * 5 / size;

        //     self._biz.translate(new paper.Point(x, y));
        // };

        this._biz.onClick = function (event) {
            console.log('clicked %o [%o]', self, event);
        };
    }

    Business.prototype.getPath = function () {
        return this._biz;
    };

    LD31.Business = Business;
    return LD31;

})(paper, LD31 || {});
