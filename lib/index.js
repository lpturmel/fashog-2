"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = require("body-parser");
var fs_1 = __importDefault(require("fs"));
var https_1 = __importDefault(require("https"));
var privateKey = fs_1.default.readFileSync(__dirname + "certs/selfsigned.key", "utf8");
var certificate = fs_1.default.readFileSync(__dirname + "certs/selfsigned.crt", "utf8");
var app = express_1.default();
var port = 3000;
// your express configuration here
app.use(body_parser_1.json());
app.post("/", function (req, res) {
    if (req.body.type === 1) {
        res.json({
            type: 1,
        });
    }
});
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https_1.default.createServer(credentials, app);
httpsServer.listen(port, function () {
    console.log("Fashog 2 listening at http://localhost:" + port);
});
