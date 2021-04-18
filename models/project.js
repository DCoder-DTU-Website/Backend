const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Project = new Schema(
    {
        title: { type: String, required: true },
        dev: { type: String, required: true },
        linkedin: { type: String, required: false },
        image: { type: String, required: false },
        github: { type: String, required: false },
        desc: { type: String, required: true },
        techStack: { type: String, required: true },
        confirmed: { type: Boolean, default: 0, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('projects', Project)