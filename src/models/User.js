import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        required: true
    },
    specialization: {
        type: String,
        enum: ['cardiology', 'neurology', 'orthopedics', 'pediatrics', 'general',"ENT"],
        required: function() { return this.role === 'doctor'; }
    },
}, {timestamps: true});

module.exports = mongoose.model("User", userSchema);