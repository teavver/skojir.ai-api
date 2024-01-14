import { Schema } from "mongoose"

export const refreshTokenSchema = new Schema({
    // 16 byte UUID
    deviceId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, { _id: false })
