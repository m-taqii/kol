import mongoose, { Document } from "mongoose";

export interface IInvite extends Document {
    room: mongoose.Types.ObjectId;
    code: string;               // short, URL-safe token
    createdAt: Date;
}

const inviteSchema = new mongoose.Schema<IInvite>({
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    code: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: 604800 } // Link expires in 7 days
});

export default mongoose.model<IInvite>("Invite", inviteSchema);
