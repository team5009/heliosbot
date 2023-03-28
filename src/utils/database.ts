import dotenv from 'dotenv'
import { connect } from 'mongoose'
dotenv.config()

export default async () => {
    const link = process.env.MONGO_URL
    const connection = link?.replace('{password}', process.env.MONGO_PASS as string).replace('{username}', process.env.MONGO_USER as string)
    const db = await connect(connection as string, {
        keepAlive: true,
    })

    return db
}