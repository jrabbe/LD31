
var LD31 = (function (paper, LD31) {

    function Background() {
        this._path = new paper.Path.Rectangle({
            point: [0, 0],
            size: [LD31.world.width, LD31.world.height],
            strokeColor: LD31.settings.baseColor,
            fillColor: LD31.settings.backgroundColor
        });

        var self = this;
        this._path.onClick = function (event) {

        };
    }

    Background.prototype.getPath = function () {
        return this._path;
    };

    LD31.Background = Background;
    return LD31;

})(paper, LD31 || {});
