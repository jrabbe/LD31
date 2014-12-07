/*
 * Utils class
 */

var LD31 = (function (Phaser, LD31) {

    LD31.utils = {
        bounds: function (low, value, upper) {
            return Math.max(low, Math.min(value, upper));
        }
    };


    return LD31;

})(Phaser, LD31 || {});
