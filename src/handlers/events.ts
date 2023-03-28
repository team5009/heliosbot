import { ClientType, EventType } from "../utils/types";
import path from 'path'
import fs from 'fs'

export default async (bot: ClientType) => {
    return new Promise(async resolve => {
        console.log(`Loading Events...`)
        await loadEvents(bot, path.join(__dirname, '..', 'events'))
        console.log(`Loaded All Events!`)
        resolve(true)
    })
}
const loadEvents = (bot:ClientType, dir:string) => {
    return new Promise(resolve => {
        fs.readdirSync(dir).forEach(async childDir => {
            const eventFiles = fs.readdirSync(`${dir}/${childDir}`).filter(file => file.endsWith('.ts' || '.js'))
            for (const file of eventFiles) {
                const event = (await import(`${dir}/${childDir}/${file}`)).default as EventType
                event.run(bot)
                console.log(`Loaded event ${event.name}`)
            }
        })
        resolve(true)
    })
}
