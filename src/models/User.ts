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
    verificationCode: {
        type: String,
        required: true
    },
    verificationCodeExpires: {
        type: Date,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    membershipDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Membership'
    }
})

export const User = mongoose.model('User', userSchema)