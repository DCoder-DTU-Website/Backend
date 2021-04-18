const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Event = new Schema(
    {
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        title: { type: String, required: true },
        desc: { type: String, required: false },
        image: { type: String, required: false }
    },
    { timestamps: true },
)

module.exports = mongoose.model('events', Event)