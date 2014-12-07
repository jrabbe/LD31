/*
 * Business class
 */

var LD31 = (function (Phaser, LD31) {

    var BLOCKS = ['1x1', '1x2', '1x3', '2x1', '3x1', '4x1'];
    var MAX_VELOCITY = 5000;

    function Business(game, size, prefix, conglomerate) {
        Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY, prefix + '-' + BLOCKS[0]);

        this.maxVelocity = MAX_VELOCITY;
        this.health = size;
        this._prefix = prefix;
        this._conglomerate = conglomerate;
        this._init();
    }

    Business.prototype = Object.create(Phaser.Sprite.prototype);
    Business.constructor = Business;

    Business.prototype._init = function () {
        this.game.physics.arcade.enable(this);
        this.scale.set(this.health);
    };

    Business.prototype.ouch = function (damage) {
        this.damage(damage);
        this.scale.set(this.health);
        this._conglomerate.updateMarketCap();
    };

    Business.prototype.update = function () {
        var self = this;
        this._conglomerate.children.reduce(function (acc, child) {
            acc.forEach(function (accChild) {
                self.game.physics.arcade.overlap(child, accChild, function (a, b) {
                    var h = -a.health;
                    a.kill();
                    b.ouch(h);
                });
            });

            if (child.alive) {
                acc.push(child);
            }

            return acc;
        }, []);

        var v = this.maxVelocity / this.health;
        var vXCandidate = this.game.rnd.between(-v, v);
        var vYCandidate = this.game.rnd.between(-v, v);

        var vX = LD31.utils.bounds(-v, this.body.velocity.x + vXCandidate, v);
        var vY = LD31.utils.bounds(-v, this.body.velocity.y + vYCandidate, v);

        this.body.velocity.set(vXCandidate, vYCandidate);
    };

    LD31.Business = Business;
    return LD31;

})(Phaser, LD31 || {});
