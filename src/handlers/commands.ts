import { ClientType, CommandType } from "../utils/types";
import path from 'path'
import fs from 'fs'
import dotenv from 'dotenv'

import { PermissionsBitField, REST } from "discord.js";
import { Routes } from "discord-api-types/v10";

dotenv.config()

export default async (bot: ClientType) => {
    return new Promise(async resolve => {
        const commands: Array<CommandType | any> = []
        const rest = new REST({ version: '10' }).setToken(process.env.BOTTOKEN as string);

        console.log(`Loading Commands...`)
        await loadCommands(bot, commands, path.join(__dirname, '..', 'commands'))
        console.log(`Loaded All Commands!`)
    
        registerCommands(commands, rest)
        resolve(true)
    })
};

const loadCommands = async (bot: ClientType, commands: Array<CommandType | any>, dir:string) => {
    return new Promise(resolve => {fs.readdirSync(dir).forEach(async childDir => {
        const cmdFiles = fs.readdirSync(`${dir}/${childDir}`).filter(file => file.endsWith('.ts' || '.js'))
        for (const file of cmdFiles) {
            const cmd = (await import(`${dir}/${childDir}/${file}`)).default as CommandType
            commands.push({
                name: cmd.name,
                description: cmd.description,
                type: cmd.type,
                options: cmd.options ? cmd.options : null,
                default_permission: cmd.default_permission ? cmd.default_permission : null,
                default_member_permissions: cmd.default_member_permissions ? PermissionsBitField.resolve(cmd.default_member_permissions).toString() : null,
            });
            bot.commands?.set(cmd.name, cmd)
            console.log(`Loaded command ${cmd.name}`)
        }
    });
    resolve(true)})
}

const registerCommands = async (commands: Array<CommandType | any>, rest: REST) => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENTID as string, process.env.GUILDID as string),
            { body: commands}
        )
    } catch (e) {
    console.error(e)
    }
};