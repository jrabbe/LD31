
var LD31 = (function (paper, LD31) {

    function World () {}

    World.prototype.init = function () {
        this.width = paper.view.size.width * LD31.settings.zoomFactor;
        this.height = paper.view.size.height * LD31.settings.zoomFactor;
        this.zoomedWidth = this.width / LD31.settings.zoomFactor;
        this.zoomedHeight = this.height / LD31.settings.zoomFactor;
        this.zoomed = false;
        this.paused = false;
    };

    World.prototype.getCenter = function () {
        return new paper.Point(this.width / 2, this.height / 2);
    };

    World.prototype.zoom = function (pos) {
        if (this.zoomed) {
            paper.view.zoom = 1/LD31.settings.zoomFactor;
            paper.view.center = LD31.world.getCenter();
        } else {
            paper.view.zoom = 1;
            paper.view.center = [LD31.utils.bounds(this.zoomedWidth / 2, pos.x, this.width - this.zoomedWidth / 2),
                                 LD31.utils.bounds(this.zoomedHeight / 2, pos.y, this.height - this.zoomedHeight / 2)];
        }

        this.zoomed = !this.zoomed;
        paper.view.draw();
    };

    World.prototype.randomX = function (endOffset) {
        endOffset = endOffset || 0;
        return LD31.utils.between(0, this.width - endOffset);
    };

    World.prototype.randomY = function (endOffset) {
        endOffset = endOffset || 0;
        var _offset = LD31.settings.scoreBaseHeight * LD31.settings.zoomFactor;
        return LD31.utils.between(_offset, this.height - endOffset - _offset);
    };

    World.prototype.getBounds = function () {
        var _offset = LD31.settings.scoreBaseHeight * LD31.settings.zoomFactor;
        return new paper.Rectangle(0, _offset, this.width, this.height - 2 * _offset);
    };

    LD31.world = new World();
    return LD31;

})(paper, LD31 || {});
