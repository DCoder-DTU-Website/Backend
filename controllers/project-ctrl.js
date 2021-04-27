const Project = require("../models/project");
const mongoose = require("mongoose");

createProject = (req, res) => {
  const body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "No details found..",
    });
  }

  const project = new Project(body);

  if (!project) {
    return res.status(400).json({ success: false, error: err });
  }

  project
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        id: project._id,
        message: "Project created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: error,
        body: body,
        message: "Project not created!",
      });
    });
};

confirmProject = (req, res) => {
  Project.findOne({ _id: req.params.id }, (err, project) => {
    if (err || project == null) {
      return res.status(404).json({
        succcess: false,
        error: err,
        message: "Project not found!",
      });
    }
    if (project.confirmed == true) {
      return res.status(400).json({
        success: false,
        message: "Project is already confirmed!",
      });
    }
    project.confirmed = true;
    project
      .save()
      .then(() => {
        return res.status(200).json({
          success: true,
          id: project._id,
          message: "Project confirmed!",
        });
      })
      .catch((error) => {
        return res.status(404).json({
          success: false,
          error: error,
          message: "Project not confirmed!",
        });
      });
  });
};

deleteProject = (req, res) => {
  Project.findOneAndDelete({ _id: req.params.id }, (err, project) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: `Project not found` });
    }

    return res.status(200).json({ success: true, data: project });
  }).catch((err) => console.log(err));
};

getProjectById = async (req, res) => {
  await Project.findOne({ _id: req.params.id }, (err, project) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    if (!project) {
      return res
        .status(404)
        .json({ success: false, error: `Project not found` });
    }
    return res.status(200).json({ success: true, data: project });
  }).catch((err) => console.log(err));
};

getProjects = async (req, res) => {
  await Project.find({}, (err, projects) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!projects.length) {
      return res
        .status(404)
        .json({ success: false, error: `Project not found` });
    }
    return res.status(200).json({ success: true, data: projects });
  }).catch((err) => console.log(err));
};
getUnconfirmedProjects = async (req, res) => {
  await Project.find({ confirmed: false }, (err, projects) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!projects.length) {
      return res
        .status(404)
        .json({ success: false, error: `Project not found` });
    }
    return res.status(200).json({ success: true, data: projects });
  }).catch((err) => console.log(err));
};

module.exports = {
  createProject,
  confirmProject,
  deleteProject,
  getProjects,
  getProjectById,
  getUnconfirmedProjects,
};
