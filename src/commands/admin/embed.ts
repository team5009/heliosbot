import { ApplicationCommandType, AutocompleteInteraction, ChatInputCommandInteraction, GuildChannel, TextChannel } from "discord.js"
import { CommandType } from "../../utils/types"
import path from 'path'
import fs from 'fs'

export default {
    name: "embed",
    description: "Sends an embed",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: "send",
            description: "Sends an embed",
            type: 1,
            options: [
                {
                    name: 'name',
                    description: 'The name of the embed',
                    required: true,
                    type: 3,
                    autocomplete: true,
                },
                {
                    name: 'channel',
                    description: 'The channel to send the embed in',
                    required: true,
                    type: 7,
                }
            ],
        }
    ],
    async autocomplete(client, interaction) {
        const command = interaction.options.getSubcommand()
        switch(command) {
            case 'send': {
                const focusedOption = interaction.options.getFocused(true);
                if (focusedOption.name === 'name') {
                    const choicesRes = [loadChoices()]
                    const choices = (await Promise.all(choicesRes))[0]
                    const filtered = choices.filter(choice => choice.name.toLowerCase().startsWith(focusedOption.value))
                    interaction.respond(
                        filtered.map((choice: { name: any; value: any }) => ({
                            name: choice.name,
                            value: choice.value,
                        }))
                    )
                }
            } break;

        }
        

    },
    async run(client, interaction) {
        const {options, guildId} = interaction

        const command = options.getSubcommand()
        switch(command) {
            case 'send': {
                const name = options.getString('name')
                const channel = options.getChannel('channel') as TextChannel
                

                if (!name || !channel) return

                const embedDir = path.join(__dirname, '..', '..', 'embeds')
                const embeds = (await import(`${embedDir}/${name.toLowerCase()}.json`)).default
                await channel.send({embeds: embeds.content.embeds, components: embeds.content.components})
                interaction.reply({content: `Sent **${name}** embed to ${channel}`, ephemeral: true})
            }
        }
    },
} as CommandType


const loadChoices: () => Promise<Array<{ name: any; value: any }>> = () => {
    return new Promise(resolve => {
        const choices: { name: any; value: any }[] = []
        const embedDir = path.join(__dirname, '..', '..', 'embeds')
        fs.readdirSync(embedDir).forEach(async file => {
            const embed = (await import(`${embedDir}/${file}`)).default
            choices.push({
                name: embed.name,
                value: embed.name.toLowerCase(),
            })
        })
        resolve(choices)
    })
}