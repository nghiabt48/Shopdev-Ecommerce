'use strict'

const { Client, GatewayIntentBits } = require("discord.js")

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ]
    })
    this.channelId = process.env.DISCORD_CHANNEL_ID
    this.client.on('ready', () => {
      console.log(`Logged is ${this.client.user.tag}`)
    })
    this.client.login(process.env.DISCORD_TOKEN)
  }
  sendMessage(message = 'something') {
    const channel = this.client.channels.cache.get(this.channelId)
    if(!channel) return console.error(`No channel found. channelId: ${this.channelId}`)
    channel.send(message).catch(e => console.error(e))
  }
  pushLogToDiscord(log = {}) {
    const { payload, message, time, title = 'Request Error' } = log
    const logMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          description: '```json\n' + JSON.stringify(payload, null, 2)+ '\n```',
          time,
          title
        }
      ]
    }
    this.sendMessage(logMessage)
  }
}
module.exports = new LoggerService()