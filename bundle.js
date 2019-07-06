(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var helpers_1 = require("../helpers");
var Synapse = (function () {
    function Synapse(port) {
        var _this = this;
        this.getUserIp = function () {
            return _this.myIp;
        };
        this.setUserIp = function () { return __awaiter(_this, void 0, void 0, function () {
            var myPeerConnection, pc, localIps, ipRegex, rTCSessionDescription, sdpArray, _i, sdpArray_1, sdpItem, sdpIMArray, _a, sdpIMArray_1, item;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        myPeerConnection = helpers_1.getRTCPeerConnection();
                        pc = new myPeerConnection({ iceServers: [] });
                        localIps = [];
                        ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;
                        pc.createDataChannel("");
                        return [4, pc.createOffer()];
                    case 1:
                        rTCSessionDescription = _b.sent();
                        sdpArray = rTCSessionDescription.sdp.split("\n");
                        if (sdpArray && sdpArray.length > 0) {
                            for (_i = 0, sdpArray_1 = sdpArray; _i < sdpArray_1.length; _i++) {
                                sdpItem = sdpArray_1[_i];
                                if (sdpItem.indexOf("candidate") < 0)
                                    break;
                                sdpIMArray = sdpItem.match(ipRegex);
                                if (sdpIMArray) {
                                    for (_a = 0, sdpIMArray_1 = sdpIMArray; _a < sdpIMArray_1.length; _a++) {
                                        item = sdpIMArray_1[_a];
                                        helpers_1.iterateIP(item, localIps);
                                    }
                                }
                            }
                            pc.setLocalDescription(rTCSessionDescription);
                        }
                        pc.onicecandidate = function (ice) {
                            if (ice &&
                                ice.candidate &&
                                ice.candidate.candidate &&
                                ice.candidate.candidate.match(ipRegex)) {
                                var iceCandidates = ice.candidate.candidate.match(ipRegex);
                                for (var _i = 0, iceCandidates_1 = iceCandidates; _i < iceCandidates_1.length; _i++) {
                                    var iceCandidate = iceCandidates_1[_i];
                                    helpers_1.iterateIP(iceCandidate, localIps);
                                }
                                if (localIps.length > 0)
                                    _this.setMiIp(localIps[0]);
                            }
                        };
                        return [2, localIps];
                }
            });
        }); };
        this.setMiIp = function (e) {
            if (!e || e === "")
                return;
            _this.myIp = e;
        };
        this.myIp = "";
        this.port = port;
        this.setUserIp();
    }
    Synapse.prototype.findServers = function (maxInParallel, timeout, addServersInProgress, addServersInFinish) {
        var ipCurrent = 0, numInParallel = 0, servers = [];
        var ipHigh = 255;
        var baseIp = this.getUserIp();
        var port = this.port.toString();
        var toSplit = baseIp;
        var ipBase = toSplit.split(".", 3);
        var ipWS = ipBase[0] + "." + ipBase[1] + "." + ipBase[2] + ".";
        function tryIp(ip) {
            ++numInParallel;
            var address = "ws://" + ipWS + ip + ":" + port;
            var socket = new WebSocket(address);
            var timer = setTimeout(function () {
                var s = socket;
                socket = null;
                s.close();
                --numInParallel;
                next();
            }, timeout);
            socket.onopen = function () {
                if (socket) {
                    clearTimeout(timer);
                    servers.push(socket.url);
                    if (addServersInProgress != null &&
                        addServersInProgress != undefined &&
                        typeof addServersInProgress === "function")
                        addServersInProgress(socket.url);
                    --numInParallel;
                    next();
                }
            };
            socket.onerror = function (err) {
                if (socket) {
                    clearTimeout(timer);
                    --numInParallel;
                    next();
                }
            };
        }
        function next() {
            while (ipCurrent <= ipHigh && numInParallel < maxInParallel) {
                tryIp(ipCurrent++);
            }
            if (numInParallel === 0) {
                if (addServersInFinish != null &&
                    addServersInFinish != undefined &&
                    typeof addServersInFinish === "function")
                    addServersInFinish(servers);
            }
        }
        next();
        return servers;
    };
    return Synapse;
}());
exports.Synapse = Synapse;
window.Synapse = Synapse;

},{"../helpers":3}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var types_1 = require("../types");
function getRTCPeerConnection() {
    return webkitRTCPeerConnection || types_1.mozRTCPeerConnection || RTCPeerConnection;
}
exports.getRTCPeerConnection = getRTCPeerConnection;
function iterateIP(ip, localIp) {
    if (ip.match(types_1.ipRegex)) {
        localIp.push(ip);
        return;
    }
}
exports.iterateIP = iterateIP;

},{"../types":4}],3:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./helpers"));

},{"./helpers":2}],4:[function(require,module,exports){
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
__export(require("./types"));

},{"./types":5}],5:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.ipRegex = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/g;

},{}]},{},[1]);
