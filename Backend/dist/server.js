"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./infrastructure/config/app"));
const connectDB_1 = require("./infrastructure/config/connectDB");
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const createAdmin_1 = require("./infrastructure/services/createAdmin");
require("./infrastructure/scheduler/slotCleaner");
const socketServerConnection_1 = require("./infrastructure/services/socketServerConnection");
require("./infrastructure/scheduler/appointmentNotify");
require("./infrastructure/scheduler/slotCleaner");
dotenv_1.default.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectDB_1.connectDB)();
        const app = (0, app_1.default)();
        const server = http_1.default.createServer(app);
        const io = (0, socketServerConnection_1.createSocketChatConnection)(server);
        yield (0, createAdmin_1.createAdmin)();
        const port = process.env.PORT;
        server === null || server === void 0 ? void 0 : server.listen(port, () => {
            console.log('server is running at port ', port);
        });
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
