const Lecture = require('../models/lecture')
const mongoose = require('mongoose')

createLecture = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'No details found..',
        })
    }

    const lecture = new Lecture(body)

    if (!lecture) {
        return res.status(400).json({ success: false, error: err })
    }

    lecture
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: lecture._id,
                message: 'Lecture created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error: error,
                body: body,
                message: 'Lecture not created!',
            })
        })
}


getLectureById = async (req, res) => {
    await Lecture.findOne({ _id: req.params.id }, (err, lecture) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!lecture) {
            return res
                .status(404)
                .json({ success: false, error: `Lecture not found` })
        }
        return res.status(200).json({ success: true, data: lecture })
    }).catch(err => console.log(err))
}

getLectures = async (req, res) => {
    await Lecture.find({}, (err, lectures) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!lectures.length) {
            return res
                .status(404)
                .json({ success: false, error: `Lecture not found` })
        }
        return res.status(200).json({ success: true, data: lectures })
    }).catch(err => console.log(err))
}

getLecturesByTopic = async (req, res) => {
    await Lecture.find({topic: req.params.topic}, (err, lectures) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!lectures.length) {
            return res
                .status(404)
                .json({ success: false, error: `Lecture not found` })
        }
        return res.status(200).json({ success: true, data: lectures })
    }).catch(err => console.log(err))
}

getLecturesBySubtopic = async (req, res) => {
    await Lecture.find({topic: req.params.topic, subtopic: req.params.subtopic}, (err, lectures) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!lectures.length) {
            return res
                .status(404)
                .json({ success: false, error: `Lecture not found` })
        }
        return res.status(200).json({ success: true, data: lectures })
    }).catch(err => console.log(err))
}

module.exports = {
    createLecture,
    getLectures,
    getLecturesByTopic,
    getLecturesBySubtopic,
    getLectureById,
}