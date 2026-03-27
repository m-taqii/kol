import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    profilePicture: string;
    password: string;
    friends: mongoose.Types.ObjectId[];
    friendRequests: mongoose.Types.ObjectId[]; // incoming pending requests
    online: boolean;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-z0-9_]{3,20}$/ // 3-20 chars, letters/numbers/underscore only
    },
    profilePicture: { type: String, default: "" },
    password: { type: String, required: true, select: false },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
    online: { type: Boolean, default: false },
});

userSchema.pre("save", async function (this: IUser) {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;