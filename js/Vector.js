/*

  Vector Class

*/
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var Vector = /** @class */ (function () {
    function Vector() {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        this.values = values;
    }
    Object.defineProperty(Vector.prototype, "dimension", {
        get: function () {
            return this.values.length;
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.add = function (vector2) {
        if (this.dimension != vector2.dimension) {
            throw new Error("Can't add vectors with different dimensions.");
        }
        var newValues = [];
        for (var i = 0; i < this.values.length; i++) {
            newValues[i] = this.values[i] + vector2.values[i];
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], newValues)))();
    };
    Vector.prototype.subtract = function (vector2) {
        if (this.dimension != vector2.dimension) {
            throw new Error("Can't subtract vectors with different dimensions.");
        }
        var newValues = [];
        for (var i = 0; i < this.values.length; i++) {
            newValues[i] = this.values[i] - vector2.values[i];
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], newValues)))();
    };
    Vector.prototype.multiply = function (multiplier) {
        if (multiplier.constructor.name == 'Number') {
            return this.multiplyWithScalar(multiplier);
        }
        if (multiplier.constructor.name == 'Vector') {
            return this.dotProduct(multiplier);
        }
        // if (multiplier.constructor.name == 'Matrix') {
        //   return this.multiplyWithMatrix(multiplier)
        // }
    };
    Vector.prototype.divide = function (scalar) {
        var newValues = [];
        for (var i = 0; i < this.values.length; i++) {
            newValues[i] = this.values[i] / scalar;
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], newValues)))();
    };
    Vector.prototype.multiplyWithScalar = function (scalar) {
        var newValues = [];
        for (var i = 0; i < this.values.length; i++) {
            newValues[i] = this.values[i] * scalar;
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], newValues)))();
    };
    Vector.prototype.dotProduct = function (vector2) {
        if (this.dimension != vector2.dimension) {
            throw new Error("Can't calculate the dot product of Vectors with different dimensions.");
        }
        var sum = 0;
        for (var i = 0; i < this.values.length; i++) {
            sum += this.values[i] * vector2.values[i];
        }
        return sum;
    };
    // multiplyWithMatrix(matrix: Matrix) {
    //   return matrix.multiplyWithVector(this)
    // }
    Vector.prototype.each = function (f) {
        var newValues = [];
        for (var i = 0; i < this.values.length; i++) {
            newValues[i] = f(this.values[i]);
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], newValues)))();
    };
    Vector.prototype.distance = function (vector2) {
        if (this.dimension != vector2.dimension) {
            throw new Error("Can't calculate the distance between Vectors with different dimensions.");
        }
        var sum = 0;
        for (var i = 0; i < this.values.length; i++) {
            sum += Math.pow((this.values[i] - vector2.values[i]), 2);
        }
        return Math.sqrt(sum);
    };
    Object.defineProperty(Vector.prototype, "sum", {
        get: function () {
            var sum = 0;
            for (var i = 0; i < this.values.length; i++) {
                sum += this.values[i];
            }
            return sum;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "angle", {
        get: function () {
            if (this.dimension == 2) {
                return Math.atan(this.values[1] / this.values[0]);
            }
            else {
                throw new Error("Can't calculate angle of a " + this.dimension + "-dimensional Vector.");
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "magnitude", {
        get: function () {
            return Math.hypot.apply(Math, this.values);
        },
        set: function (newMagnitude) {
            var _this = this;
            var newVector = this.each(function (x) { return x / _this.magnitude * newMagnitude; });
            this.values = newVector.values;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this.values[0];
        },
        set: function (newX) {
            this.values[0] = newX;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this.values[1];
        },
        set: function (newY) {
            this.values[1] = newY;
        },
        enumerable: true,
        configurable: true
    });
    Vector.fromAngle = function (angle) {
        return new Vector(Math.cos(angle), Math.sin(angle));
    };
    Vector.createRandom = function (dimension) {
        var values = new Array(dimension);
        for (var i = 0; i < dimension; i++) {
            values[i] = Math.random() * 2 - 1;
        }
        return new (Vector.bind.apply(Vector, __spreadArrays([void 0], values)))();
    };
    return Vector;
}());
