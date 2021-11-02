const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Placement = new Schema(
    {
        name: {type: String, required: true},
        linkedin: {type: String, required: false},
        imageSrc: { type: String, required: true },
        post: { type: String, required: true },
        logo: { type: String, required: true },
        content: {type: String},
        isInternship: { type: Boolean, required: true}
    },
    { timestamps: true },
)

module.exports = mongoose.model('placements', Placement)