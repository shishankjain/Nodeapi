"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = require("./database");
var express_1 = __importDefault(require("express"));
var amqp = __importStar(require("amqplib/callback_api"));
amqp.connect('amqps://glfakzdj:3X6eWPsZwTTBUC0V0Z_PJeO4MF-311Uh@chimpanzee.rmq.cloudamqp.com/glfakzdj', function (error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        var app = express_1.default();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.pool.query('SELECT * FROM users')];
                    case 1:
                        response = _a.sent();
                        res.status(200).json(response.rows);
                        return [2 /*return*/];
                }
            });
        }); });
        app.get('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var id, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = parseInt(req.params.id);
                        return [4 /*yield*/, database_1.pool.query('SELECT * FROM users WHERE id = $1', [id])];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, res.json(response.rows)];
                }
            });
        }); });
        app.post('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var _a, name, dept, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, name = _a.name, dept = _a.dept;
                        return [4 /*yield*/, database_1.pool.query('INSERT INTO users (name, dept) VALUES ($1, $2)', [name, dept])];
                    case 1:
                        response = _b.sent();
                        channel.sendToQueue('added_name', Buffer.from((name)));
                        channel.sendToQueue('added_dept', Buffer.from((dept)));
                        res.json({
                            message: 'User Added successfully',
                            body: {
                                user: { name: name, dept: dept }
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
        app.put('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var id, _a, name, dept, response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        id = parseInt(req.params.id);
                        _a = req.body, name = _a.name, dept = _a.dept;
                        channel.sendToQueue('updated_id', Buffer.from(req.params.id));
                        channel.sendToQueue('updated_name', Buffer.from((name)));
                        channel.sendToQueue('updated_dept', Buffer.from((dept)));
                        return [4 /*yield*/, database_1.pool.query('UPDATE users SET name = $1, dept = $2 WHERE id = $3', [
                                name,
                                dept,
                                id
                            ])];
                    case 1:
                        response = _b.sent();
                        res.json('User Updated Successfully');
                        return [2 /*return*/];
                }
            });
        }); });
        app.delete('/users/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = parseInt(req.params.id);
                        channel.sendToQueue('deleted_id', Buffer.from(req.params.id));
                        return [4 /*yield*/, database_1.pool.query('DELETE FROM users where id = $1', [
                                id
                            ])];
                    case 1:
                        _a.sent();
                        res.json("User " + id + " deleted Successfully");
                        return [2 /*return*/];
                }
            });
        }); });
        console.log('Listening to port: 3002');
        app.listen(3002, function () {
            console.log("Started server on 3002");
        });
    });
});
