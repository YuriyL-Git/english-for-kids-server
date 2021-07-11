"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const LocalStrategy = passport_local_1.default.Strategy;
passport_1.default.use(new LocalStrategy((username, password, done) => {
    User_1.default.findOne({ username }, (err, user) => {
        if (err)
            throw err;
        if (!user)
            return done(null, false);
        bcryptjs_1.default.compare(password, user.password, (error, result) => {
            if (error)
                throw error;
            if (result) {
                return done(null, user);
            }
            return done(null, false);
        });
    });
}));
passport_1.default.serializeUser((user, cb) => {
    cb(null, user.id);
});
passport_1.default.deserializeUser((id, cb) => {
    User_1.default.findOne({ _id: id }, (err, user) => {
        const userInformation = {
            username: user === null || user === void 0 ? void 0 : user.username,
            isAdmin: user === null || user === void 0 ? void 0 : user.isAdmin,
            id: user === null || user === void 0 ? void 0 : user.id,
        };
        cb(err, userInformation);
    });
});
exports.default = passport_1.default;
//# sourceMappingURL=paspost.js.map