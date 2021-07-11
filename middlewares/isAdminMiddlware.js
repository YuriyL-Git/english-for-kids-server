"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const isAdminMiddleware = (req, res, next) => {
    const { user } = req;
    if (user) {
        User_1.default.findOne({ username: user.username }, (err, doc) => {
            if (err)
                throw err;
            if (doc === null || doc === void 0 ? void 0 : doc.isAdmin) {
                next();
            }
            else {
                res.send("Sorry, only admin's can perform this.");
            }
        });
    }
    else {
        res.send('Sorry, you arent logged in.');
    }
};
exports.default = isAdminMiddleware;
//# sourceMappingURL=isAdminMiddlware.js.map