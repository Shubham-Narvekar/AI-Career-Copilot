import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAnswer {
    question: mongoose.Types.ObjectId;
    answer: string;
}

export interface IAssessmentResult extends Document {
    user: mongoose.Types.ObjectId;
    answers: IAssessmentAnswer[];
    score?: number;
    createdAt: Date;
}

const AssessmentResultSchema: Schema = new Schema<IAssessmentResult>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        answers: [
            {
                question: { type: Schema.Types.ObjectId, ref: 'AssessmentQuestion', required: true },
                answer: { type: String, required: true },
            },
        ],
        score: { type: Number },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAssessmentResult>('AssessmentResult', AssessmentResultSchema); 