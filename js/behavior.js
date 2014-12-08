
var LD31 = (function (LD31) {

    // Actions: none [N], merge [M], takeover [T]
    // - N : Do nothing, all businesses are repulsive
    // - M : All businesses of same color are attractive
    // - T : All businesses of different colors are attractive

    function Behavior (business) {
        this._action = 'N';
        this._business = business;
        this.velocity = new paper.Point();

        var self = this;
        LD31.on('update', function () {
            self._handleContact();
            self._handleInformation();
        });

        LD31.on('action', function (action) {
            self.setAction(action);
        });
    }

    Behavior.prototype.setAction = function (action) {
        if (['M', 'T', 'N'].indexOf(action) > -1) {
            this._action = action;
            this._business._action.content = action;
        }
    };

    Behavior.prototype.getAction = function () {
        return this._action;
    };

    Behavior.prototype._handleContact = function () {
        var ob = this._business.getBusinessesWithin(LD31.settings.informationDistance);
        if (!!ob) {
            for (var i = 0, len = ob.length; i < len; i++) {
                if (ob[i].type === 'Business') {
                    var b = ob[i].__;

                    if (b.active && ob[i].intersects(this._business.getPath()) && !this._business.equals(b)) {
                        // console.log('this was hit by %o', b);
                        var tb = this._business;

                        if (tb.matches(b)) {
                            // then merge
                            var h = b.getSize();
                            b.remove();
                            tb.resize(h);
                        } else {
                            // do the damage
                            h1 = tb.getSize();
                            h2 = b.getSize();
                            d = Math.abs(h1 - h2);
                            d1 = d / h1;
                            d2 = d / h2;
                            tb.resize(-d1);
                            b.resize(-d2);
                        }
                    }
                }
            }
        }
    };

    Behavior.prototype._handleInformation = function () {
        var v = new paper.Point();
        var ob = this._business.getBusinessesWithin(LD31.settings.informationDistance);
        var a = 0;
        if (!!ob) {
            for (var i = 0, len = ob.length; i < len; i++) {
                if (ob[i].type === 'Business') {
                    var b = ob[i].__;

                    if (!this._business.equals(b)) {
                        a++;
                        v = v.add(this._calculateVector(b));
                        // console.log('v is now %o, %o', v.x, v.y);
                    }
                }
            }
        }

        // console.log('considered %o other businesses', a);
        // console.log('all vectors amounted to %o, %o', v.x, v.y);

        this.velocity = this.velocity.add(v);

        if (this.velocity.length > LD31.settings.maxVelocity) {
            this.velocity.length = LD31.settings.maxVelocity;
        }

        var next = this._business.getCenter().add(this.velocity);
        var bd = LD31.world.getBounds();
        if (!bd.contains(next)) {
            this.velocity.length = -this.velocity.length;
        }

        // console.log('new velocity = %o, %o', this.velocity.x, this.velocity.y);

        this._business.move(this.velocity);
    };

    Behavior.prototype._calculateVector = function (other) {
        // calculates a vector giving the attribution to the velocity based on the other business
        var repulse;
        switch (this._action) {
        case 'N':
            repulse = true;
            break;
        case 'M':
            repulse = this._business.matches(other);
            break;
        case 'T':
            repulse = !this._business.matches(other);
            break;
        }

        var b1 = this._business.getCenter();
        var b2 = other.getCenter();
        var v = b1.subtract(b2);
        var angle = v.angle;
        var distance = v.length;

        // console.log('b1 = %o, %o ; b2 = %o, %o ; angle = %o ; d = %o', b1.x, b1.y, b2.x, b2.y, angle, distance);

        var w1 = this._business.getSize();
        var w2 = other.getSize();

        var weight = (w2 * w2) / w1;

        var vector = new paper.Point();
        vector.length = weight / distance + (repulse ? 1 : -1) * LD31.settings.maxAcceleration / w1;
        vector.angle = angle;

        // console.log('calculated %o, %o based on w = %o, d = %o, a = %o', vector.x, vector.y, weight, distance, angle);

        return vector;
    };

    LD31.Behavior = Behavior;
    return LD31;

})(paper, LD31 || {});
