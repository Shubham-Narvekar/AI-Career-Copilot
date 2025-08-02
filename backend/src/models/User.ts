import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role?: string;
    currentPosition?: string;
    experience?: string;
    education?: string;
    location?: string;
    bio?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: 'user' },
        currentPosition: { type: String },
        experience: { type: String },
        education: { type: String },
        location: { type: String },
        bio: { type: String },
        linkedin: { type: String },
        github: { type: String },
        website: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema); 