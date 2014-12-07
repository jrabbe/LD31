var LD31 = (function (paper, LD31) {

    LD31.utils = {

        between: function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
        },

        negativity: function (value) {
            return value * 2 - 1;
        }

    };

    return LD31;

})(paper, LD31 || {});
