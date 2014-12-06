/**
 * Main game script
 */

(function (Phaser, window) {

    /*
     * Color from https://app.radius.com
     *
     * base:           #303B3E;
     * white:          #ffffff;
     *
     * new:            #86c1f4;
     * open:           #f4ba6f;
     * won:            #7fcb9f;
     * lost:           #ea6d64;
     *
     * radius:         #4a789c;
     * radius-dark:    #3D6482
     * radius-light:   #F1F6FC;
     * radius-purple:  #bf8dd6;
     *
     * demure:         #E1DFE0;
     * subtext:        #999e9f;
     * subtle:         #FAFAFA;
     */

    var corners = [new Phaser.Point(0, 0), new Phaser.Point(0, 1), new Phaser.Point(1, 0), new Phaser.Point(1, 1)];

    var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameboard', {preload: preload, create: create, update: update}, true);
    var businesses = {};

    window.biz = {
        corners: corners,
        game: game,
        businesses: businesses
    };

    function preload () {
        game.load.image('blue-corner', 'assets/blue-corner.png');
        game.load.image('green-corner', 'assets/green-corner.png');
        game.load.image('orange-corner', 'assets/orange-corner.png');
        game.load.image('red-corner', 'assets/red-corner.png');
    }

    function create () {
        businesses.blue = new Business(0, 'blue', game);
        businesses.green = new Business(1, 'green', game);
        businesses.orange = new Business(2, 'orange', game);
        businesses.red = new Business(3, 'red', game);
    }

    function update () {

    }

    // ==================================================

    function Business (index, name, game) {
        this.__ = {
            name: name,
            score: this._initScoreCorner(name, corners[index], game),
            businesses: this._initBusinesses(name, game)
        };
    }

    Business.prototype._initScoreCorner = function (prefix, corner, game) {
        var group = game.add.group();
        group.enableBody = true;

        var scoreContainer = group.create(corner.x * game.width, corner.y * game.height, prefix + '-corner');
        scoreContainer.body.immovable = true;
        scoreContainer.x -= scoreContainer.width / 2;
        scoreContainer.y -= scoreContainer.height / 2;

        return group;
    };

    Business.prototype._initBusinesses = function (prefix, game) {
        var group = game.add.group();
        group.enableBody = true;

        return group;
    };

})(Phaser, window);
