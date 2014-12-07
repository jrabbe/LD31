/*
 * Conglomerate class
 */

var LD31 = (function (Phaser, LD31) {

    var SCORE_CORNER_SIZE = 32;
    var INITIAL_MARKET_CAP = 20;
    var MIN_INITIAL_BIZ_SIZE = 5;
    var MAX_INITIAL_BIZ_SIZE = 10;
    var CORNERS = [new Phaser.Point(0, 0), new Phaser.Point(0, 1), new Phaser.Point(1, 0), new Phaser.Point(1, 1)];

    function Conglomerate (game, prefix, index, parent) {
        Phaser.Group.call(this, game, parent);

        this._prefix = prefix;
        this._index = index;
        this._marketCap = INITIAL_MARKET_CAP;
        this._init();
    }

    Conglomerate.prototype = Object.create(Phaser.Group.prototype);
    Conglomerate.constructor = Conglomerate;

    Conglomerate.prototype._init = function () {
        this.enableBody = true;

        var marketCap = this._marketCap = INITIAL_MARKET_CAP;
        while (marketCap > 0) {
            var bizSize = this.game.rnd.between(MIN_INITIAL_BIZ_SIZE, Math.min(marketCap, MAX_INITIAL_BIZ_SIZE));
            marketCap -= bizSize;

            this.add(new LD31.Business(this.game, bizSize, this._prefix, this));
        }
    };

    Conglomerate.prototype.setScore = function (score) {
        this._setScore(score);
    };

    Conglomerate.prototype.updateMarketCap = function () {

        var m = this.children.reduce(function (acc, child) {
            if (child.alive) {
                acc += child.health;
            }

            return acc;
        }, 0);

        this._marketCap = Math.round(m);
        this._setScore(this._marketCap);
    };

    Conglomerate.prototype.createScore = function () {
        var group = this.game.add.group();
        group.enableBody = true;

        var corner = CORNERS[this._index];
        var scoreContainer = group.create(corner.x * this.game.width - SCORE_CORNER_SIZE,
            corner.y * this.game.height - SCORE_CORNER_SIZE, this._prefix + '-corner');
        scoreContainer.body.immovable = true;

        var alignment = !corner.x ? 'left' : 'right';
        var scoreText = new Phaser.Text(this.game,
            corner.x * (this.game.width - SCORE_CORNER_SIZE / 2) - (corner.x - 1) * 4,
            corner.y * (this.game.height - SCORE_CORNER_SIZE / 2 - 8),
            '0', // initialize to zero
            {font: '11pt Helvetica Neue', fill: '#303B3E', align: alignment});
        group.add(scoreText);

        this._score = group;
        this._setScore = function (score) {
            scoreText.text = score;
        };

        return group;
    };

    LD31.Conglomerate = Conglomerate;
    return LD31;

})(Phaser, LD31 || {});
