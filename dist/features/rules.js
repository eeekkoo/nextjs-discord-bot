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
exports.onStartup = void 0;
/**
 * Rules module
 * ---
 * When the bot starts, it will post the rules defined below into the configured channel.
 * To avoid spamming the channel everytime it is started, the messages existing in the channel
 * are going to be "recycled". This means that if we edit something in the rules, we will try to edit
 * the existing messages to avoid creating pings in the channel.
 */
const RULES_CHANNEL_ID = (_a = process.env.RULES_CHANNEL_ID) !== null && _a !== void 0 ? _a : '752553802359505020';
const INTRO_CHANNEL_ID = '766393115044216854';
// const HELP_CHANNEL_ID = '752668543891276009';
// const OFFTOPIC_CHANNEL_ID = '766433464055496744';
// const SHOWCASE_CHANNEL_ID = '771729272074534922';
// const KUDOS_CHANNEL_ID = '911305422307225682';
// const GENERAL_CHANNEL_ID = '752647196419031042';
// 'https://i.imgur.com/Zqc3Nc6.png',
// `
// Welcome to the official Next.js Discord server!
// This is the place to chat about Next.js, ask questions, show off your projects, and collaborate with other developers.
// **Here's a quick breakdown of our channels:**
// <#${GENERAL_CHANNEL_ID}>:: General chat about Next.js
// <#${HELP_CHANNEL_ID}>: Ask for help with Next.js
// <#${OFFTOPIC_CHANNEL_ID}>: Anything else you want to talk about
// <#${SHOWCASE_CHANNEL_ID}>: Show off your Next.js projects
// <#${KUDOS_CHANNEL_ID}>: Shout out people who helped you out
// We abide by our Code of Conduct. Please read it: <https://github.com/vercel/next.js/blob/canary/CODE_OF_CONDUCT.md>
// `,
const RULES_MESSAGES = [
    `**To unlock the rest of the server, make sure to introduce yourself in the <#${INTRO_CHANNEL_ID}> channel!** Use this template:

🌎 I'm from: Italy
🏢 I work at: Amazon
💻 I work with this tech: Next.js, Typescript, Tailwind, and Prisma
🍎 I snack on: ☕

Also, tell us what tools you use so we can automatically add you to the relevant channels!

<:javascript:770004227366846494> : JavaScript

<:typescript:770004243545325580> : TypeScript

<:tailwind:913088128468787210> : Tailwind

<:rust:913088096692748349> : Rust

<:swr:770004547422650388> : SWR

<:mdx:935667057121439805> : MDX
  `,
];
const onStartup = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const channel = client.channels.cache.get(RULES_CHANNEL_ID);
    if (!channel) {
        console.warn(`No rules channel found (using the ID ${RULES_CHANNEL_ID}), skipping the rules module!`);
        return;
    }
    const channelMessages = yield channel.messages.fetch({ limit: 100 });
    // Filter only the messages from the bot
    const channelMessagesFromBot = channelMessages.filter((m) => { var _a; return m.author.id === ((_a = client.user) === null || _a === void 0 ? void 0 : _a.id); });
    // Sort the messages from oldest to newest (so they match the same order of the rules)
    const channelMessagesReversed = [
        ...channelMessagesFromBot.values(),
    ].reverse();
    // For each message sent in the channel...
    for (let i = 0; i < channelMessagesReversed.length; i++) {
        const message = channelMessagesReversed[i];
        // We first check if there is no rule message matching this position,
        // this means that we have more messages in the channel than in our rules, so
        // we need to delete this message (and this is going to be true to all the next messages)
        if (!RULES_MESSAGES[i]) {
            yield message.delete();
            continue;
        }
        // If the content of the message doesn't match the respective message in the rules, edit it
        if (message.content !== RULES_MESSAGES[i]) {
            yield message.edit(RULES_MESSAGES[i]);
        }
    }
    // And in the end, check if there are more messages in the rules than in the channel,
    // this means that we didn't have enough messages to edit so we need to create more
    const messagesLeftToCreate = RULES_MESSAGES.length - channelMessagesReversed.length;
    if (messagesLeftToCreate > 0) {
        // Grab the last n messages from the rules...
        const remainingMessages = RULES_MESSAGES.slice(Math.max(RULES_MESSAGES.length - messagesLeftToCreate, 0));
        // And create them!
        yield Promise.all(remainingMessages.map((message) => channel.send(message)));
    }
});
exports.onStartup = onStartup;
//# sourceMappingURL=rules.js.map