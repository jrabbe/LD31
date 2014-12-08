
var LD31 = (function (paper, LD31) {

    function Business (index, size, parent) {
        this._index = index;
        this._size = size;
        this._parent = parent;
        this.active = true;

        var realSize = size * LD31.settings.baseSize;
        this.behavior = new LD31.Behavior(this);
        this._business = new paper.Path.Rectangle({
            point: [LD31.world.randomX(realSize), LD31.world.randomY(realSize)],
            size: [LD31.settings.baseSize, LD31.settings.baseSize],
            strokeColor: LD31.settings.colors[index],
            strokeWidth: LD31.settings.lineWidth,
            fillColor: LD31.settings.fillColor
        });
        this._business.scale(size);

        this._action = new paper.PointText({
            point: this.getCenter().add([-realSize / 2, realSize / 2]),
            content: this.behavior.getAction(),
            fillColor: LD31.settings.baseColor,
            fontSize: realSize
        });

        this._business.__ = this;
        this._business.type = 'Business';
        this._uid = LD31.utils.generateUid();
    }

    Business.prototype.getPath = function () {
        return this._business;
    };

    Business.prototype.getBusinessesWithin = function (distance) {
        var center = this.getCenter();
        var bounds = new paper.Rectangle(center.x - distance, center.y - distance, distance * 2, distance * 2);

        return LD31.game.getBusinessesWithin(bounds);
    };

    Business.prototype.getCenter = function () {
        return this._business.bounds.center;
    };

    Business.prototype.getBounds = function () {
        return this._business.bounds;
    };

    Business.prototype.move = function (vector) {
        this._business.translate(vector);
        this._action.translate(vector);
    };

    Business.prototype.resize = function (delta) {
        var oldSize = this._size;
        this._size += delta;
        if (this._size < 0) {
            this._size = 0;
        }

        var factor = this._size / oldSize;

        this._business.scale(factor);
        this._action.fontSize = this._size * LD31.settings.baseSize;
        this._parent.updateScore(this._size - oldSize);

        if (this._size <= 0) {
            this.remove();
        }
    };

    Business.prototype.remove = function () {
        this._business.remove();
        this._action.remove();
        this.active = false;
    };

    Business.prototype.getSize = function () {
        return this._size;
    };

    Business.prototype.equals = function (other) {
        return typeof other === typeof this && this._uid === other._uid;
    };

    Business.prototype.matches = function (other) {
        // returns true if they are from the same conglomerate
        return this._index === other._index;
    };

    LD31.Business = Business;
    return LD31;

})(paper, LD31 || {});
