/*
 * Business class
 */

var LD31 = (function (Phaser, LD31) {

    var BLOCKS = ['1x1', '1x2', '1x3', '2x1', '3x1', '4x1'];

    function Business(game, size, prefix, parent) {
        Phaser.Group.call(this, game, parent);

        this._size = size;
        this._prefix = prefix;
        this._init();
    }

    Business.prototype = Object.create(Phaser.Group.prototype);
    Business.constructor = Business;

    Business.prototype._init = function () {
        this.enableBody = true;
        this.x = this.game.world.randomX;
        this.y = this.game.world.randomY;

        this.create(0, 0, this._prefix + '-' + BLOCKS[0]);
        this.scale.set(this._size);
    };

    LD31.Business = Business;
    return LD31;

})(Phaser, LD31 || {});
