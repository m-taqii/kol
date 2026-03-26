import mongoose from 'mongoose';

const messageItemSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    senderName: { type: String, required: true },
    senderType: { type: String, enum: ['human', 'ai', 'system'], required: true },
    modelId: { type: String, required: false },
    content: { type: String, required: true },
    isSummarized: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const dailyChatSchema = new mongoose.Schema({
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: String, required: true },
    messages: [messageItemSchema]
}, { timestamps: true });

dailyChatSchema.index({ roomId: 1, date: -1 });

const DailyChat = mongoose.model('DailyChat', dailyChatSchema);
export default DailyChat;
