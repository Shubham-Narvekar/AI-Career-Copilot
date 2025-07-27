import mongoose, { Document, Schema } from 'mongoose';

export interface IJobRole extends Document {
    title: string;
    description?: string;
    requiredSkills: mongoose.Types.ObjectId[];
    recommendedLearningPaths: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const JobRoleSchema: Schema = new Schema<IJobRole>(
    {
        title: { type: String, required: true },
        description: { type: String },
        requiredSkills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
        recommendedLearningPaths: [{ type: Schema.Types.ObjectId, ref: 'LearningPath' }],
    },
    { timestamps: true }
);

export default mongoose.model<IJobRole>('JobRole', JobRoleSchema); 