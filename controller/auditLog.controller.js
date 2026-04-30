const mongoose = require("mongoose");
const AuditLog = require("../model/auditLog.model");

/**
 * Get all audit logs for a tenant
 * Admin only
 */
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, resourceType, userId } = req.query;
    const tenantId = req.user.tenantId;

    // Build filter
    const filter = { tenantId };
    if (action) filter.action = action;
    if (resourceType) filter.resourceType = resourceType;
    if (userId) filter.userId = userId;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await AuditLog.countDocuments(filter);

    // Get logs with pagination
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "firstName lastName email")
      .populate("resourceId");

    res.json({
      success: true,
      message: "Audit logs retrieved successfully",
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      data: {}
    });
  }
};

/**
 * Get audit logs for a specific user
 * User can view their own logs, admins can view anyone's
 */
exports.getUserAuditLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, action } = req.query;
    const requestingUserId = req.user.id;
    const requestingUserRole = req.user.role;
    const tenantId = req.user.tenantId;

    // Authorization check
    if (userId !== requestingUserId && requestingUserRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only view your own audit logs",
        data: {}
      });
    }

    // Build filter
    const filter = { tenantId, userId };
    if (action) filter.action = action;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await AuditLog.countDocuments(filter);

    // Get logs
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      message: "User audit logs retrieved successfully",
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching user audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      data: {}
    });
  }
};

/**
 * Get audit logs for a specific resource
 * Admin only
 */
exports.getResourceAuditLogs = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const tenantId = req.user.tenantId;

    // Build filter
    const filter = { tenantId, resourceId };

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count
    const total = await AuditLog.countDocuments(filter);

    // Get logs
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "firstName lastName email");

    res.json({
      success: true,
      message: "Resource audit logs retrieved successfully",
      data: {
        logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error("Error fetching resource audit logs:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      data: {}
    });
  }
};

/**
 * Get audit log details
 * Admin only
 */
exports.getAuditLogDetail = async (req, res) => {
  try {
    const { logId } = req.params;
    const tenantId = req.user.tenantId;

    const log = await AuditLog.findOne({
      _id: logId,
      tenantId
    }).populate("userId", "firstName lastName email");

    if (!log) {
      return res.status(404).json({
        success: false,
        message: "Audit log not found",
        data: {}
      });
    }

    res.json({
      success: true,
      message: "Audit log retrieved successfully",
      data: log
    });
  } catch (error) {
    console.error("Error fetching audit log detail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch audit log",
      data: {}
    });
  }
};

/**
 * Get audit logs summary/statistics
 * Admin only
 */
exports.getAuditLogsSummary = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { days = 7 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Convert tenantId to ObjectId if it's a string
    let tenantIdObjectId = tenantId;
    if (typeof tenantId === "string") {
      tenantIdObjectId = new mongoose.Types.ObjectId(tenantId);
    }

    // Get various statistics
    const [
      totalLogs,
      logsByAction,
      logsByResourceType,
      loginAttempts,
      failedLogins,
      userCreations,
      userUpdates,
      roleChanges,
      deletions
    ] = await Promise.all([
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        createdAt: { $gte: startDate }
      }),
      AuditLog.aggregate([
        {
          $match: {
            tenantId: tenantIdObjectId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: "$action",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      AuditLog.aggregate([
        {
          $match: {
            tenantId: tenantIdObjectId,
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: "$resourceType",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "LOGIN",
        createdAt: { $gte: startDate }
      }),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "LOGIN_FAILED",
        createdAt: { $gte: startDate }
      }),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "USER_CREATED",
        createdAt: { $gte: startDate }
      }),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "USER_UPDATED",
        createdAt: { $gte: startDate }
      }),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "ROLE_CHANGED",
        createdAt: { $gte: startDate }
      }),
      AuditLog.countDocuments({
        tenantId: tenantIdObjectId,
        action: "RECORD_DELETED",
        createdAt: { $gte: startDate }
      })
    ]);

    res.json({
      success: true,
      message: "Audit logs summary retrieved successfully",
      data: {
        period: `Last ${days} days`,
        totalLogs,
        statistics: {
          loginAttempts,
          failedLogins,
          userCreations,
          userUpdates,
          roleChanges,
          deletions
        },
        byAction: logsByAction,
        byResourceType: logsByResourceType
      }
    });
  } catch (error) {
    console.error("Error getting audit logs summary:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get audit logs summary",
      data: {}
    });
  }
};
