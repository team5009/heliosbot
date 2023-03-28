import { ApplicationCommandType, ChatInputCommandInteraction } from "discord.js";
import { ClientType, EventType } from "../../utils/types";

export default {
    name: 'Command Handler',
    description: 'Ready Event',
    run(bot) {
        bot.on('interactionCreate', async interaction => {           

            if (interaction.isChatInputCommand()) {
                const command = bot.commands?.get(interaction.commandName);
                if (!command) bot.commands?.delete(interaction.commandName);

                if (!command) return 
                try {
                    await command.run(bot, interaction);
                } catch (e) {
                    console.error(e);
                }
            } else if (interaction.isAutocomplete()) {
                const command = bot.commands?.get(interaction.commandName);

                if (!command) {
                    console.error(`Command ${interaction.commandName} not found`)
                }
                try {
                    await command?.autocomplete!(bot, interaction);
                } catch (e) {
                    console.error(e);
                }
            }


        })
    },
} as EventType;