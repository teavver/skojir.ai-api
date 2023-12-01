import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
        required: true
    },
    verificationCode: {
        type: String,
    },
    verificationCodeExpires: {
        type: Date,
    },
    membershipDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Membership',
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    }
})

export const User = mongoose.model('User', userSchema)