const JobType = require("../../model/jobType.model");

exports.createJobType = async (req, res) => {
  const { name, description, requiredCertifications } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name is required",
      data: {}
    });
  }

  try {
    const jobType = await JobType.create({
      name: name.trim(),
      description: description ? description.trim() : "",
      requiredCertifications: requiredCertifications || []
    });

    return res.status(201).json({
      success: true,
      message: "Job type created",
      data: jobType
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job type already exists",
        data: {}
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create job type",
      data: {}
    });
  }
};

exports.getJobTypes = async (req, res) => {
  try {
    const jobTypes = await JobType.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Job types fetched",
      data: jobTypes
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job types",
      data: {}
    });
  }
};

exports.updateJobType = async (req, res) => {
  const { name, description, requiredCertifications } = req.body;

  if (name !== undefined && !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Name cannot be empty",
      data: {}
    });
  }

  try {
    const jobType = await JobType.findByIdAndUpdate(
      req.params.id,
      {
        ...(name !== undefined ? { name: name.trim() } : {}),
        ...(description !== undefined ? { description: description.trim() } : {}),
        ...(requiredCertifications !== undefined ? { requiredCertifications } : {})
      },
      { new: true, runValidators: true }
    );

    if (!jobType) {
      return res.status(404).json({
        success: false,
        message: "Job type not found",
        data: {}
      });
    }

    return res.json({
      success: true,
      message: "Job type updated",
      data: jobType
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Job type already exists",
        data: {}
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update job type",
      data: {}
    });
  }
};

exports.deleteJobType = async (req, res) => {
  try {
    const jobType = await JobType.findByIdAndDelete(req.params.id);

    if (!jobType) {
      return res.status(404).json({
        success: false,
        message: "Job type not found",
        data: {}
      });
    }

    return res.json({
      success: true,
      message: "Job type deleted",
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete job type",
      data: {}
    });
  }
};
