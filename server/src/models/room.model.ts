import mongoose, { Document } from 'mongoose'
import crypto from 'crypto'

interface IRoom extends Document {
    name: string;
    owner: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    aiMembers: string[];
    memory: string;
    messageCount: number;
    inviteCode: string;
    createdAt: Date;
    updatedAt: Date;
}

const roomSchema = new mongoose.Schema<IRoom>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    aiMembers: {
        type: [String],
        default: []
    },
    memory: {
        type: String,
        default: ''
    },
    messageCount: {
        type: Number,
        default: 0
    },
    inviteCode: {
        type: String,
        unique: true,
        default: () => crypto.randomBytes(6).toString('hex')
    }
}, {
    timestamps: true
})

const Room = mongoose.model<IRoom>('Room', roomSchema)
export default Room