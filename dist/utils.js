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
exports.remainingTime = exports.logAndDelete = exports.isStaff = void 0;
const MOD_LOG_CHANNEL_ID = (_a = process.env.MOD_LOG_CHANNEL_ID) !== null && _a !== void 0 ? _a : '763149438951882792';
const staffRoles = ['next.js', 'moderator', 'vercel'];
const isStaff = (member) => {
    if (!member)
        return false;
    return member.roles.cache.some((role) => staffRoles.includes(role.name.toLowerCase()));
};
exports.isStaff = isStaff;
const logAndDelete = (client, message, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const modLogChannel = client.channels.cache.get(MOD_LOG_CHANNEL_ID);
    yield modLogChannel.send({
        embeds: [
            {
                title: 'Message automatically deleted',
                description: '```' + message.content + '```',
                color: 16098851,
                fields: [
                    {
                        name: 'Author profile',
                        value: `<@${message.author.id}>`,
                        inline: true,
                    },
                    {
                        name: 'Reason',
                        value: reason,
                        inline: true,
                    },
                    {
                        name: 'Channel',
                        value: `<#${message.channel.id}>`,
                        inline: true,
                    },
                ],
            },
        ],
    });
    message.delete();
});
exports.logAndDelete = logAndDelete;
const remainingTime = (startTime, endTime) => {
    // https://stackoverflow.com/a/13904120
    // get total seconds between the times
    let delta = Math.abs(endTime - startTime) / 1000;
    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    // what's left is seconds
    const seconds = delta % 60; // in theory the modulus is not required
    return { days, hours, minutes, seconds };
};
exports.remainingTime = remainingTime;
//# sourceMappingURL=utils.js.map