const Event = require("../models/event");
const mongoose = require("mongoose");

createEvent = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const event = new Event(body);

  if (!event) {
    return res.status(400).json({ success: false, error: err });
  }

  event
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: event._id,
        message: "Event created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Event not created!",
      });
    });
};

confirmEvent = async (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Event.findOne({ _id: req.params.id }, (err, event) => {
    if (err) {
      return res.status(404).json({
        err,
        message: "Event not found!",
      });
    }
    event.name = body.name;
    event.time = body.time;
    event.rating = body.rating;
    event
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: event._id,
          message: "Event updated!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          error,
          message: "Event not updated!",
        });
      });
  });
};

deleteEvent = async (req, res) => {
  await Event.findOneAndDelete({ _id: req.params.id }, (err, event) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!event) {
      return res.status(404).json({ success: false, error: `Event not found` });
    }

    return res.status(200).json({ success: true, data: event });
  }).catch((err) => console.log(err));
};

getEventById = async (req, res) => {
  await Event.findOne({ _id: req.params.id }, (err, event) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!event) {
      return res.status(404).json({ success: false, error: `Event not found` });
    }
    return res.status(200).json({ success: true, data: event });
  }).catch((err) => console.log(err));
};

getEvents = async (req, res) => {
  await Event.find({}, (err, events) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!events.length) {
      return res.status(404).json({ success: false, error: `Event not found` });
    }
    return res.status(200).json({ success: true, data: events });
  }).catch((err) => console.log(err));
};

module.exports = {
  createEvent,
  confirmEvent,
  deleteEvent,
  getEvents,
  getEventById,
};
