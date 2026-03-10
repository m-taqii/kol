import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password: string;
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
    password: { type: String, required: true, select: false },
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;