import mongoose from 'mongoose';

const { Schema } = mongoose;

const taskSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    
    title: { 
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        trim: true
    },

    category: {
        type: String,
        enum: ['Work', 'Personal', 'Study', 'Health', 'Other'],
        default: 'Work', trim: true
    },

    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },

    status: {
        type: String, enum:
        ['In progress', 'Completed', 'ToDo'],
        default: 'ToDo'
    },

    startdate: {
        type: Date,
        default: Date.now
    },

    duedate: { type: Date },

    created: {
        type: Date,
        default: Date.now
    },

    tags: {
        type: [String],
        trim: true
    }
},{
    timestamps: true
}
);

const Task = mongoose.model("Task", taskSchema);

export default Task;