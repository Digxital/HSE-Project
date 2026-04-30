const Certification = require("../model/certification.model");
const User = require("../model/user.model");
const JobType = require("../model/jobType.model");
const Notification = require("../model/notification.model");
const mongoose = require("mongoose");
const { calculateComplianceStatus } = require("../utils/compliance");
const { logCertificationUpload, logRecordDeletion } = require("../utils/auditLog");


//    GET /users/:id/certifications
//    Return all certifications for a specific user
 
exports.getUserCertifications = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        data: {}
      });
    }

    // Check authorization - only admin or the same user
    if (req.user.id !== userId && req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only view your own certifications",
        data: {}
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {}
      });
    }

    // Get certifications
    const certifications = await Certification.find({ userId })
      .sort({ createdAt: -1 });

    // Format response
    const formattedCertifications = certifications.map(cert => ({
      certificationId: cert._id.toString(),
      referenceId: cert.externalId,
      userId: cert.userId.toString(),
      certificationName: cert.certificationName,
      issuingAuthority: cert.issuingAuthority,
      issueDate: cert.issueDate.toISOString().split('T')[0],
      expiryDate: cert.expiryDate.toISOString().split('T')[0],
      fileUrl: cert.fileUrl,
      status: cert.status,
      createdBy: cert.createdBy.toString(),
      createdAt: cert.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      message: "Certifications retrieved successfully",
      data: formattedCertifications
    });
  } catch (err) {
    console.error("Error fetching user certifications:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certifications",
      data: {}
    });
  }
};

/**
 * GET /admin/certifications
 * Admin only - Return all certifications for all users
 */
exports.getAllCertifications = async (req, res) => {
  try {
    // Get all certifications sorted by createdAt descending
    const certifications = await Certification.find()
      .sort({ createdAt: -1 });

    // Format response
    const formattedCertifications = certifications.map(cert => ({
      certificationId: cert._id.toString(),
      referenceId: cert.externalId,
      userId: cert.userId.toString(),
      certificationName: cert.certificationName,
      issuingAuthority: cert.issuingAuthority,
      issueDate: cert.issueDate.toISOString().split('T')[0],
      expiryDate: cert.expiryDate.toISOString().split('T')[0],
      fileUrl: cert.fileUrl,
      status: cert.status,
      createdBy: cert.createdBy.toString(),
      createdAt: cert.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      message: "All certifications retrieved successfully",
      data: formattedCertifications
    });
  } catch (err) {
    console.error("Error fetching all certifications:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch certifications",
      data: {}
    });
  }
};

    // GET /job-types/:id/requirements
    // Return required certifications for a job type

exports.getJobTypeRequirements = async (req, res) => {
  try {
    const jobTypeId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobTypeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job type ID format",
        data: {}
      });
    }

    const jobType = await JobType.findById(jobTypeId);
    if (!jobType) {
      return res.status(404).json({
        success: false,
        message: "Job type not found",
        data: {}
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job type requirements retrieved successfully",
      data: {
        jobTypeId: jobType._id,
        jobTypeName: jobType.name,
        description: jobType.description,
        requiredCertifications: jobType.requiredCertifications
      }
    });
  } catch (err) {
    console.error("Error fetching job type requirements:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch job type requirements",
      data: {}
    });
  }
};

/**
 * GET /users/:id/compliance-status
 * Compare user's certifications with job type requirements
 */
exports.getUserComplianceStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { jobTypeId } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        data: {}
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {}
      });
    }

    let requiredCertifications = [];

    // If jobTypeId provided, get requirements from that job type
    if (jobTypeId) {
      if (!mongoose.Types.ObjectId.isValid(jobTypeId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job type ID format",
          data: {}
        });
      }

      const jobType = await JobType.findById(jobTypeId);
      if (!jobType) {
        return res.status(404).json({
          success: false,
          message: "Job type not found",
          data: {}
        });
      }

      requiredCertifications = jobType.requiredCertifications;
    }

    // Calculate compliance
    const complianceStatus = await calculateComplianceStatus(
      userId,
      requiredCertifications
    );

    return res.status(200).json({
      success: true,
      message: "Compliance status retrieved successfully",
      data: {
        userId,
        jobTypeId: jobTypeId || null,
        ...complianceStatus
      }
    });
  } catch (err) {
    console.error("Error fetching compliance status:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch compliance status",
      data: {}
    });
  }
};

/**
 * POST /api/admin/users/:userId/certifications
 * Admin only - Create a certification for a user
 */
exports.createCertification = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { id, certificationName, issuingAuthority, issueDate, expiryDate, fileUrl } =
      req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        data: {}
      });
    }

    // Validate required fields
    if (!certificationName || !certificationName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Certification name is required",
        data: {}
      });
    }

    if (!issueDate) {
      return res.status(400).json({
        success: false,
        message: "Issue date is required",
        data: {}
      });
    }

    if (!expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date is required",
        data: {}
      });
    }

    // Validate dates
    const issueDateObj = new Date(issueDate);
    const expiryDateObj = new Date(expiryDate);

    if (isNaN(issueDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid issue date format",
        data: {}
      });
    }

    if (isNaN(expiryDateObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid expiry date format",
        data: {}
      });
    }

    if (expiryDateObj <= issueDateObj) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after issue date",
        data: {}
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {}
      });
    }

    // Determine status based on expiry date
    const now = new Date();
    const status = expiryDateObj < now ? "EXPIRED" : "VALID";

    // Create certification
    const certification = await Certification.create({
      externalId: id || null,
      userId,
      certificationName: certificationName.trim(),
      issuingAuthority: issuingAuthority ? issuingAuthority.trim() : null,
      issueDate: issueDateObj,
      expiryDate: expiryDateObj,
      fileUrl: fileUrl ? fileUrl.trim() : null,
      status,
      createdBy: req.user.id
    });

    // Log certification upload
    let adminEmail = req.user.email;
    if (!adminEmail) {
        const adminUser = await User.findById(req.user.id);
        adminEmail = adminUser?.email || "system@admin.com";
    }

    await logCertificationUpload({
      tenantId: req.user.tenantId,
      uploadedBy: req.user.id,
      uploadedByEmail: adminEmail,
      certificationId: certification._id,
      userId,
      certificationName: certification.certificationName,
      fileUrl: certification.fileUrl,
      req
    });

    // Create notification for the user
    try {
      console.log("Creating certificate_added notification for userId:", userId);
      const notification = await Notification.create({
        user: userId,
        type: "certificate_added",
        title: "New Certificate Added",
        description: `A new certificate "${certificationName.trim()}" has been added to your profile by an admin.`,
        data: {
          certificationId: certification._id.toString(),
          certificationName: certification.certificationName,
          expiryDate: certification.expiryDate.toISOString().split('T')[0]
        }
      });
      console.log("Certificate notification created successfully:", notification._id);
    } catch (notificationErr) {
      console.error("Error creating certificate_added notification:", notificationErr.message);
      console.error("Stack:", notificationErr.stack);
    }

    // Format response to match API contract
    return res.status(201).json({
      success: true,
      message: "Certification created successfully",
      data: {
        certificationId: certification._id.toString(),
        referenceId: certification.externalId,
        userId: certification.userId.toString(),
        certificationName: certification.certificationName,
        issuingAuthority: certification.issuingAuthority,
        issueDate: certification.issueDate.toISOString().split('T')[0],
        expiryDate: certification.expiryDate.toISOString().split('T')[0],
        fileUrl: certification.fileUrl,
        status: certification.status,
        createdBy: req.user.id,
        createdAt: certification.createdAt.toISOString()
      }
    });
  } catch (err) {
    console.error("Error creating certification:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create certification",
      data: {}
    });
  }
};

/**
 * PUT /certifications/:id
 * Admin only - Update certification
 * BLOCK update if user.isUnderInvestigation === true
 */
exports.updateCertification = async (req, res) => {
  try {
    const certificationId = req.params.id;
    const { certificationName, issuingAuthority, issueDate, expiryDate, fileUrl } =
      req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID format",
        data: {}
      });
    }

    // Check if certification exists
    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
        data: {}
      });
    }

    // Check if user is under investigation
    const user = await User.findById(certification.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: {}
      });
    }

    if (user.isUnderInvestigation === true) {
      return res.status(403).json({
        success: false,
        message:
          "Cannot update certification for user under investigation. Certification data is read-only.",
        data: {}
      });
    }

    // Validate dates if provided
    if (issueDate || expiryDate) {
      const issueDateObj = issueDate ? new Date(issueDate) : certification.issueDate;
      const expiryDateObj = expiryDate ? new Date(expiryDate) : certification.expiryDate;

      if (issueDate && isNaN(issueDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid issue date format",
          data: {}
        });
      }

      if (expiryDate && isNaN(expiryDateObj.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid expiry date format",
          data: {}
        });
      }

      if (expiryDateObj <= issueDateObj) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be after issue date",
          data: {}
        });
      }
    }

    // Prepare update object
    const updateData = {};

    if (certificationName !== undefined && certificationName.trim()) {
      updateData.certificationName = certificationName.trim();
    }

    if (issuingAuthority !== undefined) {
      updateData.issuingAuthority = issuingAuthority ? issuingAuthority.trim() : null;
    }

    if (issueDate !== undefined) {
      updateData.issueDate = new Date(issueDate);
    }

    if (expiryDate !== undefined) {
      updateData.expiryDate = new Date(expiryDate);
    }

    if (fileUrl !== undefined) {
      updateData.fileUrl = fileUrl ? fileUrl.trim() : null;
    }

    // Update certification
    const updatedCertification = await Certification.findByIdAndUpdate(
      certificationId,
      updateData,
      { new: true, runValidators: true }
    );

    // Create notification for the user about the update
    try {
      console.log("Creating certificate_updated notification for userId:", updatedCertification.userId);
      const notification = await Notification.create({
        user: updatedCertification.userId,
        type: "certificate_updated",
        title: "Certificate Updated",
        description: `Your certificate "${updatedCertification.certificationName}" has been updated by an admin.`,
        data: {
          certificationId: updatedCertification._id.toString(),
          certificationName: updatedCertification.certificationName,
          expiryDate: updatedCertification.expiryDate.toISOString().split('T')[0]
        }
      });
      console.log("Certificate update notification created successfully:", notification._id);
    } catch (notificationErr) {
      console.error("Error creating certificate_updated notification:", notificationErr.message);
      console.error("Stack:", notificationErr.stack);
    }

    return res.status(200).json({
      success: true,
      message: "Certification updated successfully",
      data: {
        certificationId: updatedCertification._id.toString(),
        referenceId: updatedCertification.externalId,
        userId: updatedCertification.userId.toString(),
        certificationName: updatedCertification.certificationName,
        issuingAuthority: updatedCertification.issuingAuthority,
        issueDate: updatedCertification.issueDate.toISOString().split('T')[0],
        expiryDate: updatedCertification.expiryDate.toISOString().split('T')[0],
        fileUrl: updatedCertification.fileUrl,
        status: updatedCertification.status,
        createdBy: updatedCertification.createdBy.toString(),
        createdAt: updatedCertification.createdAt.toISOString()
      }
    });
  } catch (err) {
    console.error("Error updating certification:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update certification",
      data: {}
    });
  }
};

/**
 * DELETE /certifications/:id
 * Admin only - Delete certification
 */
exports.deleteCertification = async (req, res) => {
  try {
    const certificationId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(certificationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid certification ID format",
        data: {}
      });
    }

    const certification = await Certification.findById(certificationId);
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: "Certification not found",
        data: {}
      });
    }

    // Check if user is under investigation
    const user = await User.findById(certification.userId);
    if (user && user.isUnderInvestigation === true) {
      return res.status(403).json({
        success: false,
        message:
          "Cannot delete certification for user under investigation. Certification data is read-only.",
        data: {}
      });
    }

    await Certification.findByIdAndDelete(certificationId);

    // Get admin email from token or from database
    let adminEmail = req.user.email;
    if (!adminEmail) {
        const adminUser = await User.findById(req.user.id);
        adminEmail = adminUser?.email || "system@admin.com";
    }

    // Log certification deletion
    await logRecordDeletion({
      tenantId: req.user.tenantId,
      deletedBy: req.user.id,
      deletedByEmail: adminEmail,
      recordId: certification._id,
      recordType: "CERTIFICATION",
      recordName: certification.certificationName,
      recordData: {
        certificationName: certification.certificationName,
        userId: certification.userId.toString(),
        issuingAuthority: certification.issuingAuthority,
        issueDate: certification.issueDate,
        expiryDate: certification.expiryDate,
        status: certification.status
      },
      req
    });

    return res.status(200).json({
      success: true,
      message: "Certification deleted successfully",
      data: {}
    });
  } catch (err) {
    console.error("Error deleting certification:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete certification",
      data: {}
    });
  }
};
