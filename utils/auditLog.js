const AuditLog = require("../model/auditLog.model");

/**
 * Logs an audit activity to the database
 * @param {Object} options - Audit log options
 * @param {string} options.tenantId - Tenant ID
 * @param {string} options.userId - User ID performing the action
 * @param {string} options.userEmail - User email
 * @param {string} options.action - Action type (LOGIN, USER_CREATED, etc.)
 * @param {string} options.resourceType - Type of resource affected
 * @param {string} [options.resourceId] - ID of the resource affected
 * @param {string} [options.resourceName] - Name of the resource affected
 * @param {string} options.description - Description of the action
 * @param {Object} [options.details] - Additional details
 * @param {Object} [options.changes] - Before/after changes { before: {}, after: {} }
 * @param {string} [options.ipAddress] - User's IP address
 * @param {string} [options.userAgent] - User's browser user agent
 * @param {string} [options.status] - SUCCESS or FAILURE
 * @param {string} [options.statusMessage] - Status message for failures
 * @returns {Promise<Object>} - Created audit log document
 */
exports.logAudit = async (options) => {
  try {
    const {
      tenantId,
      userId,
      userEmail,
      action,
      resourceType,
      resourceId = null,
      resourceName = null,
      description,
      details = {},
      changes = {},
      ipAddress = null,
      userAgent = null,
      status = "SUCCESS",
      statusMessage = null
    } = options;

    // Validate required fields
    if (!tenantId || !userId || !userEmail || !action || !resourceType || !description) {
      throw new Error("Missing required audit log fields");
    }

    const auditLog = await AuditLog.create({
      tenantId,
      userId,
      userEmail,
      action,
      resourceType,
      resourceId,
      resourceName,
      description,
      details,
      changes,
      ipAddress,
      userAgent,
      status,
      statusMessage
    });

    return auditLog;
  } catch (error) {
    console.error("Error logging audit:", error);
    // Don't throw - audit failures shouldn't break the main operation
    return null;
  }
};

/**
 * Get user's IP address from request
 * @param {Object} req - Express request object
 * @returns {string} - IP address
 */
exports.getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    "UNKNOWN"
  );
};

/**
 * Get user agent from request
 * @param {Object} req - Express request object
 * @returns {string} - User agent string
 */
exports.getUserAgent = (req) => {
  return req.headers["user-agent"] || "UNKNOWN";
};

/**
 * Log a login attempt
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logLogin = async (options) => {
  const { tenantId, userId, userEmail, success = true, req, statusMessage = null } = options;

  return exports.logAudit({
    tenantId,
    userId,
    userEmail,
    action: success ? "LOGIN" : "LOGIN_FAILED",
    resourceType: "USER",
    resourceId: userId,
    resourceName: userEmail,
    description: success ? `Login successful for ${userEmail}` : `Login failed for ${userEmail}`,
    ipAddress: exports.getClientIp(req),
    userAgent: exports.getUserAgent(req),
    status: success ? "SUCCESS" : "FAILURE",
    statusMessage: statusMessage || null
  });
};

/**
 * Log a user creation
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logUserCreation = async (options) => {
  const { tenantId, createdBy, createdByEmail, userId, userEmail, userData, req } = options;

  return exports.logAudit({
    tenantId,
    userId: createdBy,
    userEmail: createdByEmail,
    action: "USER_CREATED",
    resourceType: "USER",
    resourceId: userId,
    resourceName: userEmail,
    description: `User created: ${userEmail} with role ${userData.role || "NO_ROLE"}`,
    details: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      email: userEmail
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};

/**
 * Log a user update
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logUserUpdate = async (options) => {
  const { tenantId, updatedBy, updatedByEmail, userId, userEmail, before, after, req } = options;

  return exports.logAudit({
    tenantId,
    userId: updatedBy,
    userEmail: updatedByEmail,
    action: "USER_UPDATED",
    resourceType: "USER",
    resourceId: userId,
    resourceName: userEmail,
    description: `User updated: ${userEmail}`,
    changes: {
      before: before || {},
      after: after || {}
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};

/**
 * Log a role/permission change
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logRoleChange = async (options) => {
  const { tenantId, changedBy, changedByEmail, userId, userEmail, oldRole, newRole, req } = options;

  return exports.logAudit({
    tenantId,
    userId: changedBy,
    userEmail: changedByEmail,
    action: "ROLE_CHANGED",
    resourceType: "USER",
    resourceId: userId,
    resourceName: userEmail,
    description: `Role changed for ${userEmail} from ${oldRole || "NONE"} to ${newRole}`,
    changes: {
      before: { role: oldRole || null },
      after: { role: newRole }
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};

/**
 * Log a certification upload
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logCertificationUpload = async (options) => {
  const {
    tenantId,
    uploadedBy,
    uploadedByEmail,
    certificationId,
    userId,
    certificationName,
    fileUrl,
    req
  } = options;

  return exports.logAudit({
    tenantId,
    userId: uploadedBy,
    userEmail: uploadedByEmail,
    action: "CERTIFICATION_UPLOADED",
    resourceType: "CERTIFICATION",
    resourceId: certificationId,
    resourceName: certificationName,
    description: `Certification uploaded: ${certificationName} for user ${userId}`,
    details: {
      fileUrl,
      targetUserId: userId,
      certificationName
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};

/**
 * Log a record deletion
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logRecordDeletion = async (options) => {
  const {
    tenantId,
    deletedBy,
    deletedByEmail,
    recordId,
    recordType,
    recordName,
    recordData = {},
    req
  } = options;

  return exports.logAudit({
    tenantId,
    userId: deletedBy,
    userEmail: deletedByEmail,
    action: "RECORD_DELETED",
    resourceType: recordType,
    resourceId: recordId,
    resourceName: recordName,
    description: `${recordType} deleted: ${recordName}`,
    details: {
      deletedRecord: recordData
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};

/**
 * Log a profile update
 * @param {Object} options
 * @returns {Promise<Object>}
 */
exports.logProfileUpdate = async (options) => {
  const { tenantId, userId, userEmail, before, after, req } = options;

  return exports.logAudit({
    tenantId,
    userId,
    userEmail,
    action: "PROFILE_UPDATED",
    resourceType: "USER",
    resourceId: userId,
    resourceName: userEmail,
    description: `Profile updated by ${userEmail}`,
    changes: {
      before: before || {},
      after: after || {}
    },
    ipAddress: req ? exports.getClientIp(req) : null,
    userAgent: req ? exports.getUserAgent(req) : null
  });
};
