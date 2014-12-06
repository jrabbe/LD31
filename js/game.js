/**
 * Main game script
 */

var LD31 = (function (Phaser, LD31) {

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

    var ENTITIES = ['blue', 'green', 'orange', 'red'];

    function Game (game) {}

    Game.prototype = {
        preload: function () {
            ENTITIES.forEach(function (prefix) {
                game.load.image(prefix + '-corner', 'assets/'+ prefix + '-corner.png');

                game.load.image(prefix + '-1x1', 'assets/' + prefix + '-1x1.png');
                game.load.image(prefix + '-1x1R', 'assets/' + prefix + '-1x1-rounded.png');
                game.load.image(prefix + '-1x2', 'assets/' + prefix + '-1x2.png');
                game.load.image(prefix + '-1x3', 'assets/' + prefix + '-1x3.png');
                game.load.image(prefix + '-2x1', 'assets/' + prefix + '-2x1.png');
                game.load.image(prefix + '-3x1', 'assets/' + prefix + '-3x1.png');
                game.load.image(prefix + '-4x1', 'assets/' + prefix + '-4x1.png');
            });
        },
        create: function () {
            // Reponsive and centered canvas
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            this.world.setBounds(0, 0, this.game.width * 10, this.game.height * 10);

            // Set internal state object
            var self = this;
            this.__ = {};

            this.__.conglomerates = this.game.add.group();
            ENTITIES.forEach(function (prefix, index) {
                self.__.conglomerates.add(new LD31.Conglomerate(self.game, prefix, index));
            });

            this.__.zoomKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.__.zoomKey.onDown.add(this.zoomWorld, this);

            this.__.touchArea = this.game.add.sprite(0, 0);
            this.__.touchArea.width = this.world.width;
            this.__.touchArea.height = this.world.height;
            this.__.touchArea.inputEnabled  = true;
            this.__.touchArea.events.onInputDown.add(this.zoomWorld, this);

            this.__.score = this.game.add.group();
            this.__.conglomerates.children.forEach(function (conglomerate) {
                console.log(conglomerate);
                self.__.score.add(conglomerate.createScore());
            });

            this.__.conglomerates.scale.set(0.1, 0.1);
            this.__.zoomed = false;
        },
        update: function () {

        },
        render: function () {
            this.game.debug.cameraInfo(this.camera, 32, 32);
        },

        zoomWorld: function () {
            var scale = this.__.conglomerates.scale.x;
            var x = this.input.worldX / scale;
            var y = this.input.worldY / scale;

            if (this.__.zoomed) {
                this.__.conglomerates.scale.set(0.1, 0.1);
                this.camera.focusOnXY(0, 0);
                this.__.score.visible = true;
            } else {
                this.__.score.visible = false;
                this.__.conglomerates.scale.set(1, 1);
                this.camera.focusOnXY(x, y);
            }

            this.__.zoomed = !this.__.zoomed;
        }
    };

    var game = new Phaser.Game('100%', '100%', Phaser.AUTO, 'gameboard', null, true);
    game.state.add('game', Game);
    game.state.start('game');

    // Debug structure
    LD31._biz = game;

    return LD31;

})(Phaser, LD31 || {});
