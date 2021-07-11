"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const copy_1 = __importDefault(require("../../helpers/copy"));
const isAdminMiddlware_1 = __importDefault(require("../../middlewares/isAdminMiddlware"));
const CardShema_1 = __importDefault(require("../../models/CardShema"));
const cards_data_1 = __importDefault(require("../../cards-data/cards-data"));
const adminRouter = express_1.Router();
adminRouter.put('/update-icon-category', isAdminMiddlware_1.default, async (req, res) => {
    const newpath = path_1.default.join(__dirname, '../../public/category-icon/');
    if (!req.files) {
        return;
    }
    const file = req.files.file;
    const filename = file.name;
    const { category } = req.body;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    dataCards.data[0].forEach((cat) => {
        if (cat.category === category)
            cat.image = file.name;
    });
    file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
            res.status(500).send({ message: 'File upload failed', code: 200 });
        }
        CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
            if (err)
                return res.send({ error: err, code: 500 });
            return res.status(200).send({ message: 'File Uploaded', code: 200 });
        });
    });
});
adminRouter.put('/update-category-name', isAdminMiddlware_1.default, async (req, res) => {
    const { oldCategoryName, newCategoryName } = req.body;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    dataCards.data[0].forEach((cat) => {
        if (cat.category === oldCategoryName)
            cat.category = newCategoryName;
    });
    CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
        if (err)
            return res.send({ error: err, code: 500 });
        return res.status(200).send({ message: 'Category updated', code: 200 });
    });
});
adminRouter.post('/remove-category', isAdminMiddlware_1.default, async (req, res) => {
    const category = req.body.category;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    const categoryIndex = dataCards.data[0].findIndex((cat) => cat.category === category);
    dataCards.data[0] = dataCards.data[0].filter((cat) => cat.category !== category);
    dataCards.data.splice(categoryIndex + 1, 1);
    CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
        if (err)
            return res.send({ error: err, code: 500 });
        return res.status(200).send({ message: 'Category updated', code: 200 });
    });
});
adminRouter.post('/add-category', isAdminMiddlware_1.default, async (req, res) => {
    const newpath = path_1.default.join(__dirname, '../../public/category-icon/');
    if (!req.files) {
        return;
    }
    const file = req.files.file;
    const filename = file.name;
    const { category } = req.body;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    dataCards.data[0].push({ category, image: filename });
    dataCards.data.push([]);
    file.mv(`${newpath}${filename}`, (err) => {
        if (err) {
            res.status(500).send({ message: 'File upload failed', code: 200 });
        }
        CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
            if (err)
                return res.send({ error: err, code: 500 });
            return res.status(200).send({ message: 'File Uploaded', code: 200 });
        });
    });
});
adminRouter.post('/reset-db', isAdminMiddlware_1.default, async (req, res) => {
    const { reset } = req.body;
    if (reset !== 'resetDb') {
        res.send({ error: 'wrong request', code: 500 });
    }
    else {
        const dataCards = Array.from(await CardShema_1.default.find()).pop();
        dataCards.data = cards_data_1.default;
        const publicPath = path_1.default.join(__dirname, '../../public/');
        const publicArchive = path_1.default.join(__dirname, '../../publicArchive/public/');
        fs_1.default.rmdirSync(publicPath, { recursive: true });
        copy_1.default(publicArchive, publicPath);
        CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
            if (err)
                return res.send({ error: err, code: 500 });
            return res.status(200).send({ message: 'Db reset to the default state', code: 200 });
        });
    }
});
adminRouter.post('/remove-word', isAdminMiddlware_1.default, async (req, res) => {
    const word = req.body.word;
    const translation = req.body.translation;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    for (let i = 1; i < dataCards.data.length; i++) {
        for (let j = 0; j < dataCards.data[i].length; j++) {
            const card = dataCards.data[i][j];
            if (card.word === word && card.translation === translation) {
                dataCards.data[i].splice(j, 1);
            }
        }
    }
    CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
        if (err)
            return res.send({ error: err, code: 500 });
        return res.status(200).send({ message: 'Words updated', code: 200 });
    });
});
adminRouter.put('/update-word-files', isAdminMiddlware_1.default, async (req, res) => {
    const pathImg = path_1.default.join(__dirname, '../../public/img/');
    const pathSound = path_1.default.join(__dirname, '../../public/audio/');
    if (!req.files) {
        return;
    }
    const fileSound = req.files.fileSound;
    const fileSoundName = (fileSound === null || fileSound === void 0 ? void 0 : fileSound.name) || '';
    const fileImg = req.files.fileImg;
    const fileImgName = (fileImg === null || fileImg === void 0 ? void 0 : fileImg.name) || '';
    if (fileImg) {
        fileImg.mv(`${pathImg}${fileImgName}`, (err) => {
            if (err) {
                res.status(500).send({ message: 'Image upload failed', code: 200 });
            }
        });
    }
    if (fileSound) {
        fileSound.mv(`${pathSound}${fileSoundName}`, (error) => {
            if (error) {
                res.status(500).send({ message: 'Sound upload failed', code: 200 });
            }
            res.status(200).send({ message: 'Files uploaded successfully', code: 200 });
        });
    }
});
adminRouter.put('/update-word', isAdminMiddlware_1.default, async (req, res) => {
    const card = req.body.card;
    const origWord = req.body.origWord;
    const origTranslation = req.body.origTranslation;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    for (let i = 1; i < dataCards.data.length; i++) {
        for (let j = 0; j < dataCards.data[i].length; j++) {
            const currentCard = dataCards.data[i][j];
            if (currentCard.word === origWord && currentCard.translation === origTranslation) {
                dataCards.data[i][j] = card;
            }
        }
    }
    CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
        if (err)
            return res.send({ error: err, code: 500 });
        return res.status(200).send({ message: 'Words updated', code: 200 });
    });
});
adminRouter.post('/add-word', isAdminMiddlware_1.default, async (req, res) => {
    const card = req.body.card;
    const category = req.body.category;
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    const categoryIndex = dataCards.data[0].findIndex((cat) => cat.category === category);
    dataCards.data[categoryIndex + 1].push(card);
    CardShema_1.default.findOneAndUpdate({ _id: dataCards._id }, dataCards, { upsert: true }, (err, doc) => {
        if (err)
            return res.send({ error: err, code: 500 });
        return res.status(200).send({ message: 'Words updated', code: 200 });
    });
});
exports.default = adminRouter;
//# sourceMappingURL=admin-router.js.map