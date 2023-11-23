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
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    membershipDetails: {
        type: Schema.Types.ObjectId,
        ref: 'Membership'
    }
})

const membershipSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    endDate: {
        type: Date
    }
})

const User = mongoose.model('User', userSchema)
const Membership = mongoose.model('Membership', membershipSchema)

export { User, Membership }