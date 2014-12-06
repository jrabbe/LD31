/*
 * Conglomerate class
 */

var LD31 = (function (Phaser, LD31) {

    var SCORE_CORNER_SIZE = 32;
    var INITIAL_MARKET_CAP = 100;
    var MAX_INITIAL_BIZ_SIZE = 5;
    var CORNERS = [new Phaser.Point(0, 0), new Phaser.Point(0, 1), new Phaser.Point(1, 0), new Phaser.Point(1, 1)];
    var BLOCKS = ['1x1', '1x2', '1x3', '2x1', '3x1', '4x1'];

    function Conglomerate (game, name, index) {
        this.__ = {
            name: name,
            game: game,
            index: index
        };

        this._initConglomerates(name, game);

        return this.__.businesses;
    }

    Conglomerate.prototype._initConglomerates = function (prefix, game) {
        var group = game.add.group();
        group.enableBody = true;

        var marketCap = this.__.marketCap = INITIAL_MARKET_CAP;
        while (marketCap > 0) {
            var bizSize = game.rnd.between(1, Math.min(marketCap, MAX_INITIAL_BIZ_SIZE));
            marketCap -= bizSize;

            var biz = new Phaser.Group(game, group);
            biz.enableBody = true;
            biz.x = game.world.randomX;
            biz.y = game.world.randomY;


            biz.create(0, 0, prefix + '-' + BLOCKS[game.rnd.between(0, BLOCKS.length - 1)]);
        }

        group.createScore = this.createScoreFunction();

        this.__.businesses = group;
    };

    Conglomerate.prototype.setScore = function (score) {
        this.__.setScore(score);
    };

    Conglomerate.prototype.createScoreFunction = function () {
        var __ = this.__;
        return function () {
            var group = __.game.add.group();
            group.enableBody = true;

            var corner = CORNERS[__.index];
            var scoreContainer = group.create(corner.x * __.game.width - SCORE_CORNER_SIZE,
                corner.y * __.game.height - SCORE_CORNER_SIZE, __.name + '-corner');
            scoreContainer.body.immovable = true;

            var scoreText = new Phaser.Text(__.game,
                corner.x * (__.game.width - SCORE_CORNER_SIZE / 2) - (corner.x - 1) * 4,
                corner.y * (__.game.height - SCORE_CORNER_SIZE / 2 - 8),
                '0', // initialize to zero
                {font: '16pt Helvetica Neue', fill: '#303B3E', align: 'center'});
            group.add(scoreText);

            __.score = group;
            __.setScore = function (score) {
                scoreText.text = score;
            };

            return group;
        };
    };

    LD31.Conglomerate = Conglomerate;

    return LD31;

})(Phaser, LD31 || {});
