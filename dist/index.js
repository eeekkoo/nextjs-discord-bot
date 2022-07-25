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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const discord_js_1 = __importStar(require("discord.js"));
dotenv_1.default.config();
const INTRO_CHANNEL_ID = '766393115044216854';
const VERIFIED_ROLE = '930202099264938084';
if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error('No bot token found!');
}
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
const features = [];
const featureFiles = fs_1.default
    .readdirSync(path_1.default.resolve(__dirname, './features'))
    // Look for files as TS (dev) or JS (built files)
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
for (const featureFile of featureFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const feature = require(`./features/${featureFile}`);
    features.push(feature);
}
client.on('ready', () => {
    var _a;
    console.log(`Logged in as ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.tag}!`);
    features.forEach((f) => { var _a; return (_a = f.onStartup) === null || _a === void 0 ? void 0 : _a.call(f, client); });
});
client.on('messageCreate', (message) => {
    var _a;
    if (message.author.bot)
        return;
    // if user types into the intros channel, give them the verified role
    if (message.channel.id == INTRO_CHANNEL_ID) {
        (_a = message.member) === null || _a === void 0 ? void 0 : _a.roles.add(VERIFIED_ROLE).catch((err) => console.log(err.message, 'Verify'));
    }
    features.forEach((f) => { var _a; return (_a = f.onMessage) === null || _a === void 0 ? void 0 : _a.call(f, client, message); });
});
client.on('messageReactionAdd', (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.partial) {
        try {
            yield user.fetch();
        }
        catch (error) {
            console.log('Error while trying to fetch an user', error);
        }
    }
    if (reaction.message.partial) {
        try {
            yield reaction.message.fetch();
        }
        catch (error) {
            console.log('Error while trying to fetch a reaction message', error);
        }
    }
    if (reaction.partial) {
        try {
            const fetchedReaction = yield reaction.fetch();
            features.forEach((f) => { var _a; return (_a = f.onReactionAdd) === null || _a === void 0 ? void 0 : _a.call(f, client, fetchedReaction, user); });
        }
        catch (error) {
            console.log('Error while trying to fetch a reaction', error);
        }
    }
    else {
        features.forEach((f) => { var _a; return (_a = f.onReactionAdd) === null || _a === void 0 ? void 0 : _a.call(f, client, reaction, user); });
    }
}));
client.on('messageReactionRemove', (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.partial) {
        try {
            yield user.fetch();
        }
        catch (error) {
            console.log('Error while trying to fetch an user', error);
        }
    }
    if (reaction.message.partial) {
        try {
            yield reaction.message.fetch();
        }
        catch (error) {
            console.log('Error while trying to fetch a reaction message', error);
        }
    }
    if (reaction.partial) {
        try {
            const fetchedReaction = yield reaction.fetch();
            features.forEach((f) => { var _a; return (_a = f.onReactionRemove) === null || _a === void 0 ? void 0 : _a.call(f, client, fetchedReaction, user); });
        }
        catch (error) {
            console.log('Error while trying to fetch a reaction', error);
        }
    }
    else {
        features.forEach((f) => { var _a; return (_a = f.onReactionRemove) === null || _a === void 0 ? void 0 : _a.call(f, client, reaction, user); });
    }
}));
// Wake up 🤖
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=index.js.map