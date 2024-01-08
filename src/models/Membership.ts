import IMembership from "../types/interfaces/IMembership"
import mongoose, { Schema } from "mongoose"

const membershipSchema = new Schema<IMembership>({
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

export const Membership = mongoose.model('Membership', membershipSchema)