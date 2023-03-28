import { ApplicationCommand, ApplicationCommandType } from "discord.js";
import { CommandType } from "../../utils/types";

export default {
    name: 'ping',
    description: 'responds with pong!',
    type: ApplicationCommandType.ChatInput,
    run(client, interaction) {
        console.log(Date.now())
        console.log(interaction.createdTimestamp)
        interaction.reply(
            `🏓 Pong! Latency is ${interaction.createdTimestamp - Date.now()}ms. API Latency is ${client.ws.ping}ms`
        )
    },
} as CommandType