/*
 * Conglomerate class
 */

var LD31 = (function (Phaser, LD31) {

    var SCORE_CORNER_SIZE = 32;
    var INITIAL_MARKET_CAP = 100;
    var MAX_INITIAL_BIZ_SIZE = 5;
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
            var bizSize = this.game.rnd.between(1, Math.min(marketCap, MAX_INITIAL_BIZ_SIZE));
            marketCap -= bizSize;

            this.add(new LD31.Business(this.game, bizSize, this._prefix));
        }

    };

    Conglomerate.prototype.setScore = function (score) {
        this._setScore(score);
    };

    Conglomerate.prototype.createScore = function () {
        var group = this.game.add.group();
        group.enableBody = true;

        var corner = CORNERS[this._index];
        var scoreContainer = group.create(corner.x * this.game.width - SCORE_CORNER_SIZE,
            corner.y * this.game.height - SCORE_CORNER_SIZE, this._prefix + '-corner');
        scoreContainer.body.immovable = true;

        var scoreText = new Phaser.Text(this.game,
            corner.x * (this.game.width - SCORE_CORNER_SIZE / 2) - (corner.x - 1) * 4,
            corner.y * (this.game.height - SCORE_CORNER_SIZE / 2 - 8),
            '0', // initialize to zero
            {font: '16pt Helvetica Neue', fill: '#303B3E', align: 'center'});
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
