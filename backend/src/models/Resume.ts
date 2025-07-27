import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
    user: mongoose.Types.ObjectId;
    content: any;
    createdAt: Date;
    updatedAt: Date;
}

const ResumeSchema: Schema = new Schema<IResume>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: Schema.Types.Mixed, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IResume>('Resume', ResumeSchema); 