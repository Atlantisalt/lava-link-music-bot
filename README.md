# lava-link-music-bot

A feature-rich Discord music bot built with Discord.js, Riffy, and Lavalink. This bot provides high-quality music playback with support for YouTube, Spotify, and more.

## Features

- 🎵 High-quality music playback
- 🎧 Support for YouTube and Spotify
- 📋 Queue management system
- 🔄 Loop and shuffle modes
- 🔊 Volume control
- 🎨 Beautiful embed messages
- ⚡ Fast and reliable playback
- 🎯 Precise track control

## Commands

| Command | Description | Usage |
|---------|-------------|--------|
| `!play <query>` | tmzk l ogniya li bghiti ola lplaylist libghiti | `!play Never Gonna Give You Up` |
| `!pause` | hbs l ogniya | `!pause` |
| `!resume` | kml ogniya | `!resume` |
| `!skip` | Skipi logniya | `!skip` |
| `!stop` | kherej l bot mn vc | `!stop` |
| `!queue` | shoufl playlist dyalek | `!queue` |
| `!nowplaying` | wri des info 3la trac | `!nowplaying` |
| `!volume <0-100>` | tl3 ola hbt l volume | `!volume 50` |
| `!shuffle` | 3wd l aghani | `!shuffle` |
| `!loop` | loope l oghniya | `!loop` |
| `!remove <position>` | hyed chi oghniya | `!remove 1` |
| `!clear` | Clear laghani | `!clear` |
| `!status` | Show  status | `!status` |
| `!help` | Show this help message | `!help` |

## Screenshots

### Now Playing
![Now Playing](https://media.discordapp.net/attachments/1363985645172691076/1386087855620751400/image.png?ex=68586e69&is=68571ce9&hm=0678ffb24803b06f60fd2acdac7d951076a1497df80849febf0ad41e88278480&=&format=webp&quality=lossless)

### Queue List
![Help Menu](https://i.imgur.com/n7uBEvU.png)

### Player Status
![Player Status](https://i.imgur.com/0JhhPo3.png)

## Prerequisites

- Node.js 16.9.0 or higher
- Java 11 or higher (for Lavalink)
- A Discord Bot Token
- Spotify API credentials (optional, for Spotify support)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/friday2su/music-bot.git
cd music-bot
```

2. Install dependencies:
```bash
npm install
```

3. Download and set up Lavalink:
   - Download the latest Lavalink.jar from [GitHub](https://github.com/freyacodes/Lavalink/releases)
   - Create an `application.yml` file in the same directory as Lavalink.jar
   - Add the following configuration:
```yaml
server:
  port: 2333
  address: 127.0.0.1
spring:
  main:
    banner-mode: log
lavalink:
  server:
    password: "youshallnotpass"
    sources:
      youtube: true
      bandcamp: true
      soundcloud: true
      twitch: true
      vimeo: true
      http: true
    bufferDurationMs: 400
    youtubePlaylistLoadLimit: 6
    playerUpdateInterval: 5
    youtubeSearchEnabled: true
    soundcloudSearchEnabled: true
```

4. Configure the bot:
   - Copy `config.example.js` to `config.js`
   - Fill in your bot token and other settings:
```javascript
module.exports = {
    prefix: '!',
    nodes: [{
        host: "localhost",
        password: "youshallnotpass",
        port: 2333,
        secure: false,
        name: "Main Node"
    }],
    spotify: {
        clientId: "YOUR_SPOTIFY_CLIENT_ID",
        clientSecret: "YOUR_SPOTIFY_CLIENT_SECRET"
    },
    botToken: "YOUR_BOT_TOKEN",
    embedColor: "#FF0000"
};
```

5. Start Lavalink:
```bash
java -jar Lavalink.jar
```

6. Start the bot:
```bash
npm start
```

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/friday2su/music-bot/issues) page
2. Join our [Discord Server](https://discord.gg/EWr3GgP6fe)
3. Create a new issue if needed

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- [Discord.js](https://discord.js.org/)
- [Riffy](https://github.com/riffy-team/riffy)
- [Lavalink](https://github.com/freyacodes/Lavalink)
- [Spotify API](https://developer.spotify.com/)
