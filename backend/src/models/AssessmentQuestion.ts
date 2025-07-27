import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentQuestion extends Document {
    questionText: string;
    options: string[];
    correctAnswer?: string;
    skill: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const AssessmentQuestionSchema: Schema = new Schema<IAssessmentQuestion>(
    {
        questionText: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: String },
        skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IAssessmentQuestion>('AssessmentQuestion', AssessmentQuestionSchema); 