'use strict'

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
})
client.on('ready', () => {
  console.log(`Logged is ${client.user.tag}`)
})
const token = ''
client.login(token)
client.on('messageCreate', (message) => {
  if(message.author.bot) return 
  if(message.content === 'hello') {
    message.reply('Ola!')
  }
})