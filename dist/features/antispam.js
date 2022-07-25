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
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMessage = void 0;
const utils_1 = require("../utils");
/**
 * Anti spam
 * ---
 * If a message has too many emojis or contains certain keywords, the bot will log the message and delete it
 */
const MAX_EMOJI_COUNT = 16; // Flags are two symbols so 16 max emojis = max of 8 flags
const ROLES_WHITELIST = ['partner']; // Allow partners to go above the emojis limit
const INTRODUCTIONS_CHANNEL_ID = '766393115044216854';
const emojiRegex = /\p{Emoji_Presentation}/gu;
const spamKeywords = ['discord', 'nitro', 'steam', 'free', 'gift'];
const dmMessage = 'Hello there! Our automated systems detected your message as a spam message and it has been deleted. If this is an error on our side, please feel free to contact one of the moderators.';
const onMessage = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const messageAuthor = yield ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(message.author.id));
    if (!messageAuthor ||
        (0, utils_1.isStaff)(messageAuthor) ||
        messageAuthor.roles.cache.some((role) => ROLES_WHITELIST.includes(role.name.toLowerCase())))
        return;
    const emojisCount = (_c = (_b = message.content.match(emojiRegex)) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    if (emojisCount >
        (message.channelId === INTRODUCTIONS_CHANNEL_ID
            ? MAX_EMOJI_COUNT * 5
            : MAX_EMOJI_COUNT)) {
        yield message.author.send(dmMessage);
        yield (0, utils_1.logAndDelete)(client, message, 'Too many emojis');
        return;
    }
    const messageHasPingKeywords = ['@everyone', '@here'].some((pingKeyword) => message.content.includes(pingKeyword));
    const messageHasSpamKeywords = message.content
        .split(' ')
        .some((word) => spamKeywords.includes(word.toLowerCase()));
    if (messageHasPingKeywords && messageHasSpamKeywords) {
        yield message.author.send(dmMessage);
        yield (0, utils_1.logAndDelete)(client, message, 'Spam keywords');
    }
});
exports.onMessage = onMessage;
//# sourceMappingURL=antispam.js.map