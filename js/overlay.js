
var LD31 = (function (paper, LD31) {

    function Overlay () {
        this._path = new paper.Path.Rectangle({
            point: [0, 0],
            size: [LD31.world.width, LD31.world.height],
            fillColor: new paper.Color(1.0, 0.0), // transparent
            strokeWidth: 0
        });

        var self = this;
        this._path.onClick = function (event) {
            LD31.emit('zoom', event.point);
        };
    }

    Overlay.prototype.getPath = function () {
        return this._path;
    };

    LD31.Overlay = Overlay;
    return LD31;

})(paper, LD31 || {});
