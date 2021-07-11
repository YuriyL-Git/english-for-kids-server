"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const User_1 = __importDefault(require("./models/User"));
const CardShema_1 = __importDefault(require("./models/CardShema"));
const paspost_1 = __importDefault(require("./servises/auth/paspost"));
const admin_router_1 = __importDefault(require("./routes/admin/admin-router"));
const PORT = process.env.PORT || 4000;
dotenv_1.default.config();
mongoose_1.default.connect('mongodb+srv://LipcheyY:ekmnhfabjktn16@cluster0.lo9lo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }, (err) => {
    if (err)
        throw new Error(`Error connecting to mongo:`);
    console.log('Connected to Mongo');
});
/*
// -- set default cards data
setTimeout(() => {
  console.log(cardsData);
  const mogoCards = new CardsShema({
    data: cardsData,
  });
  mogoCards.save();
}, 5000);
 */
// Middlewares
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.use(cors_1.default({ origin: 'http://localhost:3000', credentials: true }));
app.use(express_session_1.default({
    secret: 'secretcode',
    resave: true,
    saveUninitialized: true,
}));
app.use(cookie_parser_1.default());
app.use(paspost_1.default.initialize());
app.use(paspost_1.default.session());
app.use(express_1.default.static(`${__dirname}/public`));
app.use(express_fileupload_1.default());
app.use(express_1.default.static('files'));
// ============= Routes ===============================================
app.use('/', admin_router_1.default);
/* ------- user register ---------------------------------------------*/
app.post('/register', async (req, res) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(req.body.password, salt);
    const newUser = new User_1.default({
        username: req.body.username,
        password: hashedPassword,
        isAdmin: true,
    });
    await newUser.save();
    res.send('Success');
});
/* ------------------------------------------------------------------- */
app.post('/login', paspost_1.default.authenticate('local'), (req, res) => {
    res.send('success');
});
app.get('/logout', (req, res) => {
    req.logout();
    res.send('success');
});
app.get('/user', (req, res) => {
    res.send(req.user);
});
app.get('/cards-data', async (req, res) => {
    const dataCards = Array.from(await CardShema_1.default.find()).pop();
    const cardsArray = dataCards.data;
    res.send(cardsArray);
});
app.listen(PORT, () => {
    console.log('Server started on port: ', PORT);
});
//# sourceMappingURL=main.js.map