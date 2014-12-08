
var LD31 = (function (LD31) {

    LD31._listeners = {};

    LD31.on = function (eventName, callback) {
        if (!LD31._listeners.hasOwnProperty(eventName)) {
            LD31._listeners[eventName] = [];
        }

        LD31._listeners[eventName].push(callback);
    };

    LD31.emit = function (eventName, data) {
        if (LD31._listeners.hasOwnProperty(eventName)) {
            var callbacks = LD31._listeners[eventName];
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i](data);
            }
        }
    };

    return LD31;

})(LD31 || {});
