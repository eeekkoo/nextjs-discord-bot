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
exports.onReactionRemove = exports.onReactionAdd = void 0;
const LANGUAGES = {
    javascript: '913086422351769610',
    typescript: '913086489229918238',
    tailwind: '913086567042674719',
    rust: '913086533387567165',
    swr: '915643752406720592',
    mdx: '935666082100957234',
};
// Make sure to update this message ID when bot generates a new one
const LANGUAGES_MESSAGE_ID = '913092687924695071';
const onReactionAdd = (client, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = reaction;
    // if message isn't the welcome message, exit
    if (message.id !== LANGUAGES_MESSAGE_ID) {
        console.log('msg is NOT in the welcome channel');
        return;
    }
    else {
        console.log('msg is in the welcome channel');
    }
    // If reaction isn't one of the ones provided above, exit
    if (!Object.keys(LANGUAGES).includes(reaction.emoji.name)) {
        console.log('emoji is NOT in there');
        return;
    }
    else {
        console.log('emoji is in there');
    }
    // Now we've certified a valid emoji and message ID, assign role to user
    const member = yield message
        .guild.members.fetch(user.id)
        .catch((err) => console.log(err.message));
    if (!member)
        return;
    const language = LANGUAGES[reaction.emoji.toString().split(':')[1]];
    member.roles.add(language).catch((err) => console.log(err.message));
});
exports.onReactionAdd = onReactionAdd;
const onReactionRemove = (client, reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = reaction;
    // if message isn't the welcome message, exit
    if (message.id !== LANGUAGES_MESSAGE_ID) {
        console.log('msg is NOT in the welcome channel');
        return;
    }
    else {
        console.log('msg is in the welcome channel');
    }
    // If reaction isn't one of the ones provided above, exit
    if (!Object.keys(LANGUAGES).includes(reaction.emoji.name)) {
        console.log('emoji is NOT in there');
        return;
    }
    else {
        console.log('emoji is in there');
    }
    // Now we've certified a valid emoji and message ID, assign role to user
    const member = yield message
        .guild.members.fetch(user.id)
        .catch((err) => console.log(err.message));
    if (!member)
        return;
    const language = LANGUAGES[reaction.emoji.toString().split(':')[1]];
    member.roles.remove(language).catch((err) => console.log(err.message));
});
exports.onReactionRemove = onReactionRemove;
//# sourceMappingURL=welcomeQuestions.js.map