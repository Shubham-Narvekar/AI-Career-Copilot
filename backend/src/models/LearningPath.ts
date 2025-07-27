import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningStep {
    title: string;
    description?: string;
    resourceLink?: string;
}

export interface ILearningPath extends Document {
    title: string;
    description?: string;
    steps: ILearningStep[];
    relatedSkills: mongoose.Types.ObjectId[];
    users: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const LearningStepSchema: Schema = new Schema<ILearningStep>({
    title: { type: String, required: true },
    description: { type: String },
    resourceLink: { type: String },
});

const LearningPathSchema: Schema = new Schema<ILearningPath>(
    {
        title: { type: String, required: true },
        description: { type: String },
        steps: [LearningStepSchema],
        relatedSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
        users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

export default mongoose.model<ILearningPath>('LearningPath', LearningPathSchema); 