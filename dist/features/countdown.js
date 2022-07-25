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
exports.onStartup = void 0;
const utils_1 = require("../utils");
/**
 * Countdown module
 * ---
 * The bot will keep track of a countdown, updating a voice channel name so all the members can see it
 */
const TITLE_VOICE_CHANNEL_ID = '902455952048029696';
const COUNTDOWN_VOICE_CHANNEL_ID = '902456113298022420';
const TARGET_TIME = '26 Oct 2021 09:00:00 GMT-0700';
let enabled = false;
const onStartup = (client) => __awaiter(void 0, void 0, void 0, function* () {
    if (!enabled)
        return;
    const voiceChannel = client.channels.cache.get(COUNTDOWN_VOICE_CHANNEL_ID);
    if (!voiceChannel) {
        console.warn(`No countdown voice channel found (using the ID ${COUNTDOWN_VOICE_CHANNEL_ID}), skipping the countdown module!`);
        return;
    }
    const targetDate = new Date(TARGET_TIME);
    const updateChannelName = () => {
        if (!enabled)
            return false;
        const timeDiff = targetDate.getTime() - Date.now();
        if (timeDiff <= 0) {
            const channelName = `Next.js Conf started!`;
            voiceChannel.setName(channelName);
            const titleVoiceChannel = client.channels.cache.get(TITLE_VOICE_CHANNEL_ID);
            titleVoiceChannel === null || titleVoiceChannel === void 0 ? void 0 : titleVoiceChannel.delete();
            enabled = false;
            return;
        }
        const { days, hours, minutes } = (0, utils_1.remainingTime)(Date.now(), targetDate.getTime());
        const channelName = `${days} Days ${hours} Hours ${minutes} Mins`;
        voiceChannel.setName(channelName);
    };
    // We can only update it every 5 minutes (Discord rate limiting)
    const interval = 5 * 1000 * 60;
    setInterval(updateChannelName, interval);
    updateChannelName();
});
exports.onStartup = onStartup;
//# sourceMappingURL=countdown.js.map