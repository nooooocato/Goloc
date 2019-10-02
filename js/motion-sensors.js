var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.__esModule = true;
    // @ts-check
    var slot = window["__sensor__"] = Symbol("__sensor__");
    var orientation = {};
    if (screen.orientation) {
        orientation = screen.orientation;
    }
    else if (screen.msOrientation) {
        orientation = screen.msOrientation;
    }
    else {
        Object.defineProperty(orientation, "angle", {
            get: function () { return (window.orientation || 0); }
        });
    }
    function defineProperties(target, descriptions) {
        for (var property in descriptions) {
            Object.defineProperty(target, property, {
                configurable: true,
                value: descriptions[property]
            });
        }
    }
    exports.EventTargetMixin = function (superclass) {
        var eventNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            eventNames[_i - 1] = arguments[_i];
        }
        return /** @class */ (function (_super) {
            __extends(class_1, _super);
            function class_1() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.call(this, args) || this;
                var eventTarget = document.createDocumentFragment();
                _this.addEventListener = function (type) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    return eventTarget.addEventListener.apply(eventTarget, __spreadArrays([type], args));
                };
                _this.removeEventListener = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return eventTarget.removeEventListener.apply(eventTarget, args);
                };
                _this.dispatchEvent = function (event) {
                    defineProperties(event, { currentTarget: _this });
                    if (!event.target) {
                        defineProperties(event, { target: _this });
                    }
                    var methodName = "on" + event.type;
                    if (typeof _this[methodName] == "function") {
                        _this[methodName](event);
                    }
                    var retValue = eventTarget.dispatchEvent(event);
                    if (retValue && _this.parentNode) {
                        _this.parentNode.dispatchEvent(event);
                    }
                    defineProperties(event, { currentTarget: null, target: null });
                    return retValue;
                };
                return _this;
            }
            return class_1;
        }(superclass));
    };
    var EventTarget = /** @class */ (function (_super) {
        __extends(EventTarget, _super);
        function EventTarget() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EventTarget;
    }(exports.EventTargetMixin(Object)));
    exports.EventTarget = EventTarget;
    function defineReadonlyProperties(target, slot, descriptions) {
        var propertyBag = target[slot] || (target[slot] = new WeakMap());
        var _loop_1 = function (property) {
            propertyBag[property] = descriptions[property];
            Object.defineProperty(target, property, {
                get: function () { return propertyBag[property]; }
            });
        };
        for (var property in descriptions) {
            _loop_1(property);
        }
    }
    function defineOnEventListener(target, name) {
        Object.defineProperty(target, "on" + name, {
            enumerable: true,
            configurable: false,
            writable: true,
            value: null
        });
    }
    var SensorState = {
        ERROR: 0,
        IDLE: 1,
        ACTIVATING: 2,
        ACTIVE: 3
    };
    var Sensor = /** @class */ (function (_super) {
        __extends(Sensor, _super);
        function Sensor(options) {
            var _this = _super.call(this) || this;
            _this[slot] = new WeakMap();
            defineOnEventListener(_this, "reading");
            defineOnEventListener(_this, "activate");
            defineOnEventListener(_this, "error");
            defineReadonlyProperties(_this, slot, {
                activated: false,
                hasReading: false,
                timestamp: null
            });
            _this[slot].setState = function (value) {
                switch (value) {
                    case SensorState.ERROR: {
                        var error = new SensorErrorEvent("error", {
                            error: new DOMException("Could not connect to a sensor")
                        });
                        _this.dispatchEvent(error);
                        _this.stop(); // Moves to IDLE state.
                        break;
                    }
                    case SensorState.IDLE: {
                        _this[slot].activated = false;
                        _this[slot].hasReading = false;
                        _this[slot].timestamp = null;
                        break;
                    }
                    case SensorState.ACTIVATING: {
                        break;
                    }
                    case SensorState.ACTIVE: {
                        var activate = new Event("activate");
                        _this[slot].activated = true;
                        _this.dispatchEvent(activate);
                        break;
                    }
                }
            };
            _this[slot].frequency = null;
            if (window && window.parent != window.top) {
                throw new DOMException("Only instantiable in a top-level browsing context", "SecurityError");
            }
            if (options && typeof (options.frequency) == "number") {
                if (options.frequency > 60) {
                    _this.frequency = options.frequency;
                }
            }
            return _this;
        }
        Sensor.prototype.start = function () { };
        Sensor.prototype.stop = function () { };
        return Sensor;
    }(EventTarget));
    exports.Sensor = Sensor;
    var DeviceOrientationMixin = function (superclass) {
        var eventNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            eventNames[_i - 1] = arguments[_i];
        }
        return /** @class */ (function (_super) {
            __extends(class_2, _super);
            function class_2() {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var _this = _super.call(this, args) || this;
                for (var _a = 0, eventNames_1 = eventNames; _a < eventNames_1.length; _a++) {
                    var eventName = eventNames_1[_a];
                    if ("on" + eventName in window) {
                        _this[slot].eventName = eventName;
                        break;
                    }
                }
                return _this;
            }
            class_2.prototype.start = function () {
                _super.prototype.start.call(this);
                this[slot].setState(SensorState.ACTIVATING);
                window.addEventListener(this[slot].eventName, this[slot].handleEvent, { capture: true });
            };
            class_2.prototype.stop = function () {
                _super.prototype.stop.call(this);
                this[slot].setState(SensorState.IDLE);
                window.removeEventListener(this[slot].eventName, this[slot].handleEvent, { capture: true });
            };
            return class_2;
        }(superclass));
    };
    function toQuaternionFromEuler(alpha, beta, gamma) {
        var degToRad = Math.PI / 180;
        var x = (beta || 0) * degToRad;
        var y = (gamma || 0) * degToRad;
        var z = (alpha || 0) * degToRad;
        var cZ = Math.cos(z * 0.5);
        var sZ = Math.sin(z * 0.5);
        var cY = Math.cos(y * 0.5);
        var sY = Math.sin(y * 0.5);
        var cX = Math.cos(x * 0.5);
        var sX = Math.sin(x * 0.5);
        var qx = sX * cY * cZ - cX * sY * sZ;
        var qy = cX * sY * cZ + sX * cY * sZ;
        var qz = cX * cY * sZ + sX * sY * cZ;
        var qw = cX * cY * cZ - sX * sY * sZ;
        return [qx, qy, qz, qw];
    }
    function rotateQuaternionByAxisAngle(quat, axis, angle) {
        var sHalfAngle = Math.sin(angle / 2);
        var cHalfAngle = Math.cos(angle / 2);
        var transformQuat = [
            axis[0] * sHalfAngle,
            axis[1] * sHalfAngle,
            axis[2] * sHalfAngle,
            cHalfAngle
        ];
        function multiplyQuaternion(a, b) {
            var qx = a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1];
            var qy = a[1] * b[3] + a[3] * b[1] + a[2] * b[0] - a[0] * b[2];
            var qz = a[2] * b[3] + a[3] * b[2] + a[0] * b[1] - a[1] * b[0];
            var qw = a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2];
            return [qx, qy, qz, qw];
        }
        function normalizeQuaternion(quat) {
            var length = Math.sqrt(Math.pow(quat[0], 2) + Math.pow(quat[1], 2) + Math.pow(quat[2], 2) + Math.pow(quat[3], 2));
            if (length === 0) {
                return [0, 0, 0, 1];
            }
            return quat.map(function (v) { return v / length; });
        }
        return normalizeQuaternion(multiplyQuaternion(quat, transformQuat));
    }
    function toMat4FromQuat(mat, q) {
        var typed = mat instanceof Float32Array || mat instanceof Float64Array;
        if (typed && mat.length >= 16) {
            mat[0] = 1 - 2 * (Math.pow(q[1], 2) + Math.pow(q[2], 2));
            mat[1] = 2 * (q[0] * q[1] - q[2] * q[3]);
            mat[2] = 2 * (q[0] * q[2] + q[1] * q[3]);
            mat[3] = 0;
            mat[4] = 2 * (q[0] * q[1] + q[2] * q[3]);
            mat[5] = 1 - 2 * (Math.pow(q[0], 2) + Math.pow(q[2], 2));
            mat[6] = 2 * (q[1] * q[2] - q[0] * q[3]);
            mat[7] = 0;
            mat[8] = 2 * (q[0] * q[2] - q[1] * q[3]);
            mat[9] = 2 * (q[1] * q[2] + q[0] * q[3]);
            mat[10] = 1 - 2 * (Math.pow(q[0], 2) + Math.pow(q[1], 2));
            mat[11] = 0;
            mat[12] = 0;
            mat[13] = 0;
            mat[14] = 0;
            mat[15] = 1;
        }
        return mat;
    }
    var SensorErrorEvent = /** @class */ (function (_super) {
        __extends(SensorErrorEvent, _super);
        function SensorErrorEvent(type, errorEventInitDict) {
            var _this = _super.call(this, type, errorEventInitDict) || this;
            if (!errorEventInitDict || !errorEventInitDict.error instanceof DOMException) {
                throw TypeError("Failed to construct 'SensorErrorEvent':" +
                    "2nd argument much contain 'error' property");
            }
            Object.defineProperty(_this, "error", {
                configurable: false,
                writable: false,
                value: errorEventInitDict.error
            });
            return _this;
        }
        return SensorErrorEvent;
    }(Event));
    function worldToScreen(quaternion) {
        return !quaternion ? null :
            rotateQuaternionByAxisAngle(quaternion, [0, 0, 1], -orientation.angle * Math.PI / 180);
    }
    exports.RelativeOrientationSensor = window.RelativeOrientationSensor || /** @class */ (function (_super) {
        __extends(RelativeOrientationSensor, _super);
        function RelativeOrientationSensor(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            switch (options.coordinateSystem || 'world') {
                case 'screen':
                    Object.defineProperty(_this, "quaternion", {
                        get: function () { return worldToScreen(_this[slot].quaternion); }
                    });
                    break;
                case 'world':
                default:
                    Object.defineProperty(_this, "quaternion", {
                        get: function () { return _this[slot].quaternion; }
                    });
            }
            _this[slot].handleEvent = function (event) {
                // If there is no sensor we will get values equal to null.
                if (event.absolute || event.alpha === null) {
                    // Spec: The implementation can still decide to provide
                    // absolute orientation if relative is not available or
                    // the resulting data is more accurate. In either case,
                    // the absolute property must be set accordingly to reflect
                    // the choice.
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].timestamp = performance.now();
                _this[slot].quaternion = toQuaternionFromEuler(event.alpha, event.beta, event.gamma);
                _this[slot].hasReading = true;
                _this.dispatchEvent(new Event("reading"));
            };
            return _this;
        }
        RelativeOrientationSensor.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].quaternion = null;
        };
        RelativeOrientationSensor.prototype.populateMatrix = function (mat) {
            toMat4FromQuat(mat, this.quaternion);
        };
        return RelativeOrientationSensor;
    }(DeviceOrientationMixin(Sensor, "deviceorientation")));
    exports.AbsoluteOrientationSensor = window.AbsoluteOrientationSensor || /** @class */ (function (_super) {
        __extends(AbsoluteOrientationSensor, _super);
        function AbsoluteOrientationSensor(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this, options) || this;
            switch (options.coordinateSystem || 'world') {
                case 'screen':
                    Object.defineProperty(_this, "quaternion", {
                        get: function () { return worldToScreen(_this[slot].quaternion); }
                    });
                    break;
                case 'world':
                default:
                    Object.defineProperty(_this, "quaternion", {
                        get: function () { return _this[slot].quaternion; }
                    });
            }
            _this[slot].handleEvent = function (event) {
                // If absolute is set, or webkitCompassHeading exists,
                // absolute values should be available.
                var isAbsolute = event.absolute === true || "webkitCompassHeading" in event;
                var hasValue = event.alpha !== null || event.webkitCompassHeading !== undefined;
                if (!isAbsolute || !hasValue) {
                    // Spec: If an implementation can never provide absolute
                    // orientation information, the event should be fired with
                    // the alpha, beta and gamma attributes set to null.
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].hasReading = true;
                _this[slot].timestamp = performance.now();
                var heading = event.webkitCompassHeading != null ? 360 - event.webkitCompassHeading : event.alpha;
                _this[slot].quaternion = toQuaternionFromEuler(heading, event.beta, event.gamma);
                _this.dispatchEvent(new Event("reading"));
            };
            return _this;
        }
        AbsoluteOrientationSensor.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].quaternion = null;
        };
        AbsoluteOrientationSensor.prototype.populateMatrix = function (mat) {
            toMat4FromQuat(mat, this.quaternion);
        };
        return AbsoluteOrientationSensor;
    }(DeviceOrientationMixin(Sensor, "deviceorientationabsolute", "deviceorientation")));
    exports.Gyroscope = window.Gyroscope || /** @class */ (function (_super) {
        __extends(Gyroscope, _super);
        function Gyroscope(options) {
            var _this = _super.call(this, options) || this;
            _this[slot].handleEvent = function (event) {
                // If there is no sensor we will get values equal to null.
                if (event.rotationRate.alpha === null) {
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].timestamp = performance.now();
                _this[slot].x = event.rotationRate.alpha;
                _this[slot].y = event.rotationRate.beta;
                _this[slot].z = event.rotationRate.gamma;
                _this[slot].hasReading = true;
                _this.dispatchEvent(new Event("reading"));
            };
            defineReadonlyProperties(_this, slot, {
                x: null,
                y: null,
                z: null
            });
            return _this;
        }
        Gyroscope.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].x = null;
            this[slot].y = null;
            this[slot].z = null;
        };
        return Gyroscope;
    }(DeviceOrientationMixin(Sensor, "devicemotion")));
    exports.Accelerometer = window.Accelerometer || /** @class */ (function (_super) {
        __extends(Accelerometer, _super);
        function Accelerometer(options) {
            var _this = _super.call(this, options) || this;
            _this[slot].handleEvent = function (event) {
                // If there is no sensor we will get values equal to null.
                if (event.accelerationIncludingGravity.x === null) {
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].timestamp = performance.now();
                _this[slot].x = event.accelerationIncludingGravity.x;
                _this[slot].y = event.accelerationIncludingGravity.y;
                _this[slot].z = event.accelerationIncludingGravity.z;
                _this[slot].hasReading = true;
                _this.dispatchEvent(new Event("reading"));
            };
            defineReadonlyProperties(_this, slot, {
                x: null,
                y: null,
                z: null
            });
            return _this;
        }
        Accelerometer.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].x = null;
            this[slot].y = null;
            this[slot].z = null;
        };
        return Accelerometer;
    }(DeviceOrientationMixin(Sensor, "devicemotion")));
    exports.LinearAccelerationSensor = window.LinearAccelerationSensor || /** @class */ (function (_super) {
        __extends(LinearAccelerationSensor, _super);
        function LinearAccelerationSensor(options) {
            var _this = _super.call(this, options) || this;
            _this[slot].handleEvent = function (event) {
                // If there is no sensor we will get values equal to null.
                if (event.acceleration.x === null) {
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].timestamp = performance.now();
                _this[slot].x = event.acceleration.x;
                _this[slot].y = event.acceleration.y;
                _this[slot].z = event.acceleration.z;
                _this[slot].hasReading = true;
                _this.dispatchEvent(new Event("reading"));
            };
            defineReadonlyProperties(_this, slot, {
                x: null,
                y: null,
                z: null
            });
            return _this;
        }
        LinearAccelerationSensor.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].x = null;
            this[slot].y = null;
            this[slot].z = null;
        };
        return LinearAccelerationSensor;
    }(DeviceOrientationMixin(Sensor, "devicemotion")));
    exports.GravitySensor = window.GravitySensor || /** @class */ (function (_super) {
        __extends(GravitySensor, _super);
        function GravitySensor(options) {
            var _this = _super.call(this, options) || this;
            _this[slot].handleEvent = function (event) {
                // If there is no sensor we will get values equal to null.
                if (event.acceleration.x === null || event.accelerationIncludingGravity.x === null) {
                    _this[slot].setState(SensorState.ERROR);
                    return;
                }
                if (!_this[slot].activated) {
                    _this[slot].setState(SensorState.ACTIVE);
                }
                _this[slot].timestamp = performance.now();
                _this[slot].x = event.accelerationIncludingGravity.x - event.acceleration.x;
                _this[slot].y = event.accelerationIncludingGravity.y - event.acceleration.y;
                _this[slot].z = event.accelerationIncludingGravity.z - event.acceleration.z;
                _this[slot].hasReading = true;
                _this.dispatchEvent(new Event("reading"));
            };
            defineReadonlyProperties(_this, slot, {
                x: null,
                y: null,
                z: null
            });
            return _this;
        }
        GravitySensor.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this[slot].x = null;
            this[slot].y = null;
            this[slot].z = null;
        };
        return GravitySensor;
    }(DeviceOrientationMixin(Sensor, "devicemotion")));
});
//# sourceMappingURL=motion-sensors.js.map