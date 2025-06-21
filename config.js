module.exports = {
    prefix: process.env.BOT_PREFIX || 'B!',
    nodes: [{
        host: process.env.LAVALINK_HOST || "lavalink.jirayu.net",
        password: process.env.LAVALINK_PASSWORD || "youshallnotpass",
        port: parseInt(process.env.LAVALINK_PORT) || 13592,
        secure: process.env.LAVALINK_SECURE === 'true' || false,
        name: process.env.LAVALINK_NAME || "Main Node"
    }],
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID || "a568b55af1d940aca52ea8fe02f0d93b",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "e8199f4024fe49c5b22ea9a3dd0c4789"
    },
    botToken: process.env.DISCORD_BOT_TOKEN || "",
    embedColor: process.env.EMBED_COLOR || "#8500cb"
};
