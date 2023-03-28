import {
    Client, Collection, GatewayIntentBits,
} from 'discord.js'
import dotenv from 'dotenv'
import { ClientType, CommandType } from './utils/types'
import dbConnect from './utils/database'

dotenv.config()

const load = (dir:string, bot: ClientType) => {
    return new Promise(async resolve => {
        const module = await import(`./handlers/${dir}`)
        module.default(bot)
        resolve(true)
    })
}

const bot: ClientType = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.MessageContent
    ],
});
bot.commands = new Collection<string, CommandType>()
bot.database = dbConnect().then(
    (db) => {
        console.log('Database connected!')
        return db
    }
)


load('commands', bot).then(() => {
    load('events', bot).then(() => {
        bot.once('ready', () => {
            console.log(`Logged in as ${bot.user?.tag}!`)
        })
        bot.login(process.env.BOTTOKEN)
    })
});




