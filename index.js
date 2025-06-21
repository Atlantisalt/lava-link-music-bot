const { Client, GatewayDispatchEvents } = require("discord.js");
const { Riffy } = require("riffy");
const { Spotify } = require("riffy-spotify");
const config = require("./config.js");
const messages = require("./utils/messages.js");
const emojis = require("./emojis.js");

// Import keep-alive server
require("./keep-alive.js");

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "GuildMessageReactions",
        "MessageContent",
        "DirectMessages",
    ],
});

const spotify = new Spotify({
    clientId: config.spotify.clientId,
    clientSecret: config.spotify.clientSecret
});

client.riffy = new Riffy(client, config.nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4",
    plugins: [spotify]
});

// Command definitions for help command
const commands = [
    { name: 'play <query>', description: 'tmzk l ogniya li bghiti ola lplaylist libghiti' },
    { name: 'pause', description: 'hbs l ogniya' },
    { name: 'resume', description: 'kml ogniya' },
    { name: 'skip', description: 'Skipi logniya' },
    { name: 'stop', description: 'kherej l bot mn vc' },
    { name: 'queue', description: 'shoufl playlist dyalek' },
    { name: 'nowplaying', description: 'wri des info 3la trac' },
    { name: 'volume <0-100>', description: 'tl3 ola hbt l volume' },
    { name: 'shuffle', description: '3wd l aghani' },
    { name: 'loop', description: 'loope l oghniya' },
    { name: 'remove <position>', description: 'hyed chi oghniya' },
    { name: 'clear', description: 'Clear laghani' },
    { name: 'status', description: 'Show  status' },
    { name: 'help', description: 'Show this help message' }
];

client.on("ready", () => {
    client.riffy.init(client.user.id);
    console.log(`${emojis.success} Logged in as ${client.user.tag}`);
    console.log(`${emojis.info} Bot is ready and serving ${client.guilds.cache.size} guilds!`);
});

client.on("messageCreate", async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    // Check if user is in a voice channel for music commands
    const musicCommands = ["play", "skip", "stop", "pause", "resume", "queue", "nowplaying", "volume", "shuffle", "loop", "remove", "clear"];
    if (musicCommands.includes(command)) {
        if (!message.member.voice.channel) {
            return messages.error(message.channel, "You must be in a voice channel!");
        }
    }

    switch (command) {
        case "help": {
            messages.help(message.channel, commands);
            break;
        }

        case "play": {
            const query = args.join(" ");
            if (!query) return messages.error(message.channel, "adak w9 rah link khataa !");

            try {
                const player = client.riffy.createConnection({
                    guildId: message.guild.id,
                    voiceChannel: message.member.voice.channel.id,
                    textChannel: message.channel.id,
                    deaf: true,
                });

                const resolve = await client.riffy.resolve({
                    query: query,
                    requester: message.author,
                });

                const { loadType, tracks, playlistInfo } = resolve;

                if (loadType === "playlist") {
                    for (const track of resolve.tracks) {
                        track.info.requester = message.author;
                        player.queue.add(track);
                    }

                    messages.addedPlaylist(message.channel, playlistInfo, tracks);
                    if (!player.playing && !player.paused) return player.play();
                } else if (loadType === "search" || loadType === "track") {
                    const track = tracks.shift();
                    track.info.requester = message.author;
                    const position = player.queue.length + 1;
                    player.queue.add(track);
                    
                    messages.addedToQueue(message.channel, track, position);
                    if (!player.playing && !player.paused) return player.play();
                } else {
                    return messages.error(message.channel, "wach tadwi 3la chab l3arbi! rah rah makaynach had l oghniya");
                }
            } catch (error) {
                console.error(error);
                return messages.error(message.channel, "An error occurred while playing the track! Please try again later.");
            }
            break;
        }

        case "skip": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (!player.queue.length) return messages.error(message.channel, "No more tracks in queue to skip to!");
            
            player.stop();
            messages.success(message.channel, "Skippi a 3bd sami3!");
            break;
        }

        case "stop": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            
            player.destroy();
            messages.success(message.channel, "Stopped the music and cleared the queue!");
            break;
        }

        case "pause": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (player.paused) return messages.error(message.channel, "The player is already paused!");
            
            player.pause(true);
            messages.success(message.channel, "puse a w9!");
            break;
        }

        case "resume": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (!player.paused) return messages.error(message.channel, "The player is already playing!");
            
            player.pause(false);
            messages.success(message.channel, "Resumed the music!");
            break;
        }

        case "queue": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            
            const queue = player.queue;
            if (!queue.length && !player.queue.current) {
                return messages.error(message.channel, "Queue is empty! Add some tracks with the play command.");
            }

            messages.queueList(message.channel, queue, player.queue.current);
            break;
        }

        case "nowplaying": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (!player.queue.current) return messages.error(message.channel, "No track is currently playing!");

            messages.nowPlaying(message.channel, player.queue.current);
            break;
        }

        case "volume": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            
            const volume = parseInt(args[0]);
            if (!volume && volume !== 0 || isNaN(volume) || volume < 0 || volume > 100) {
                return messages.error(message.channel, "Please provide a valid volume between 0 and 100!");
            }

            player.setVolume(volume);
            messages.success(message.channel, `Set volume to ${volume}%`);
            break;
        }

        case "shuffle": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (!player.queue.length) return messages.error(message.channel, "Not enough tracks in queue to shuffle!");

            player.queue.shuffle();
            messages.success(message.channel, `${emojis.shuffle} Shuffled the queue!`);
            break;
        }

        case "loop": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");

            // Get the current loop mode and toggle between NONE and QUEUE
            const currentMode = player.loop;
            const newMode = currentMode === "none" ? "queue" : "none";
            
            player.setLoop(newMode);
            messages.success(message.channel, `${newMode === "queue" ? "Enabled" : "Disabled"} loop mode!`);
            break;
        }

        case "remove": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            
            const position = parseInt(args[0]);
            if (!position || isNaN(position) || position < 1 || position > player.queue.length) {
                return messages.error(message.channel, `Please provide a valid track position between 1 and ${player.queue.length}!`);
            }

            const removed = player.queue.remove(position - 1);
            messages.success(message.channel, `Removed **${removed.info.title}** from the queue!`);
            break;
        }

        case "clear": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "Nothing is playing!");
            if (!player.queue.length) return messages.error(message.channel, "Queue is already empty!");

            player.queue.clear();
            messages.success(message.channel, "Cleared the queue!");
            break;
        }

        case "status": {
            const player = client.riffy.players.get(message.guild.id);
            if (!player) return messages.error(message.channel, "No active player found!");

            messages.playerStatus(message.channel, player);
            break;
        }
    }
});

client.riffy.on("nodeConnect", (node) => {
    console.log(`${emojis.success} Node "${node.name}" connected.`);
});

client.riffy.on("nodeError", (node, error) => {
    console.log(`${emojis.error} Node "${node.name}" encountered an error: ${error.message}.`);
});

client.riffy.on("trackStart", async (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    messages.nowPlaying(channel, track);
});

client.riffy.on("queueEnd", async (player) => {
    const channel = client.channels.cache.get(player.textChannel);
    player.destroy();
    messages.queueEnded(channel);
});

client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
});

// Enhanced error handling for production
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

// Login with error handling
client.login(config.botToken).catch(error => {
    console.error('Failed to login:', error);
    process.exit(1);
});
