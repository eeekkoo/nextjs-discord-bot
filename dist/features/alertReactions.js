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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.onReactionAdd = exports.onStartup = void 0;
const utils_1 = require("../utils");
/**
 * Alert Reactions module
 * ---
 * When some staff member reacts to a message using the warning emoji (⚠️) the message will be logged in
 * the mod log channel
 */
const MOD_LOG_CHANNEL_ID = (_a = process.env.MOD_LOG_CHANNEL_ID) !== null && _a !== void 0 ? _a : '763149438951882792';
const TRIGGER_EMOJI = '⚠️';
let isEnabled = false;
// We will keep a memory cache of warned messages to avoid showing multiple warnings
// for the same message if someone reacts, remove the reaction and add it again
const warnedMessageIds = [];
const onStartup = (client) => __awaiter(void 0, void 0, void 0, function* () {
    if (!client.channels.cache.get(MOD_LOG_CHANNEL_ID)) {
        console.warn(`No mod-log channel found (using the ID ${MOD_LOG_CHANNEL_ID}), skipping the Alert Reactions module!`);
        return;
    }
    isEnabled = true;
});
exports.onStartup = onStartup;
const onReactionAdd = (client, reaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    if (!isEnabled || reaction.emoji.toString() !== TRIGGER_EMOJI)
        return;
    const { message } = reaction;
    if (!message.guild ||
        !message.author ||
        message.author.id === ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id) ||
        warnedMessageIds.includes(message.id)) {
        return;
    }
    const messageAuthor = yield message.guild.members.fetch(message.author.id);
    if (!messageAuthor || (0, utils_1.isStaff)(messageAuthor))
        return;
    yield reaction.users.fetch();
    const membersWhoReacted = yield Promise.all(reaction.users.cache.map((user) => { var _a; return (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.fetch(user.id); }));
    const staffWhoReacted = membersWhoReacted.filter((user) => (0, utils_1.isStaff)(user));
    // We want to trigger the warning only for staff members but not more than once,
    // this could happen if the bot is restarted (losing the memory cache) and some other staff
    // add a reaction to the message
    if (staffWhoReacted.length !== 1)
        return;
    const modLogChannel = client.channels.cache.get(MOD_LOG_CHANNEL_ID);
    modLogChannel.send({
        embeds: [
            {
                title: '⚠️ Message Warned',
                description: '```' + message.content + '```',
                color: 16098851,
                author: {
                    name: messageAuthor.displayName,
                    iconURL: messageAuthor.user.displayAvatarURL(),
                },
                fields: [
                    {
                        name: 'Author profile',
                        value: `<@${messageAuthor.id}>`,
                        inline: true,
                    },
                    {
                        name: 'Jump to message',
                        value: `[Click here](${message.url})`,
                        inline: true,
                    },
                ],
                footer: {
                    icon_url: (_c = staffWhoReacted[0]) === null || _c === void 0 ? void 0 : _c.user.displayAvatarURL(),
                    text: `Warned by ${(_d = staffWhoReacted[0]) === null || _d === void 0 ? void 0 : _d.displayName}`,
                },
            },
        ],
    });
    warnedMessageIds.push(message.id);
});
exports.onReactionAdd = onReactionAdd;
//# sourceMappingURL=alertReactions.js.map