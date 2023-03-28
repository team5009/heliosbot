import { Model, Schema } from "mongoose";

const schema = new Schema({
    name: String,
})

export default new Model("example", schema);