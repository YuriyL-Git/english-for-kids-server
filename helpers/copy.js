"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function copyFolderSync(from, to) {
    fs_1.default.mkdirSync(to);
    fs_1.default.readdirSync(from).forEach((element) => {
        if (fs_1.default.lstatSync(path_1.default.join(from, element)).isFile()) {
            fs_1.default.copyFileSync(path_1.default.join(from, element), path_1.default.join(to, element));
        }
        else {
            copyFolderSync(path_1.default.join(from, element), path_1.default.join(to, element));
        }
    });
}
exports.default = copyFolderSync;
//# sourceMappingURL=copy.js.map