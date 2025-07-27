import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
    name: string;
    description?: string;
    category?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SkillSchema: Schema = new Schema<ISkill>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        category: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<ISkill>('Skill', SkillSchema); 