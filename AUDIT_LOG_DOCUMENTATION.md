# Audit Log System Implementation Guide

## Overview

The Audit Log system tracks all critical system activities for security, compliance, and operational monitoring. It logs:

- **User creation/updates** - Track when users are created or their profiles are modified
- **Certification uploads** - Log when certifications are uploaded for users
- **Login attempts** - Monitor successful and failed login attempts (including SSO)
- **Record deletions** - Track when records are deleted from the system
- **Role/permission changes** - Log when user roles or permissions are modified

## Architecture

### Database Models

#### AuditLog Model (`/Backend/model/auditLog.model.js`)

Stores all audit log entries with the following key fields:

```javascript
{
  tenantId,           // Which tenant/organization this belongs to
  userId,             // Who performed the action
  userEmail,          // Email of the user who performed the action
  action,             // Type of action (LOGIN, USER_CREATED, CERTIFICATION_UPLOADED, etc.)
  resourceType,       // Type of resource affected (USER, CERTIFICATION, INCIDENT, etc.)
  resourceId,         // ID of the affected resource
  resourceName,       // Name/identifier of the affected resource
  description,        // Human-readable description
  details,            // Additional context-specific data
  changes: {
    before: {},       // For updates: the values before the change
    after: {}         // For updates: the values after the change
  },
  ipAddress,          // IP address of the requester (for security)
  userAgent,          // Browser/client information
  status,             // SUCCESS or FAILURE
  statusMessage,      // Reason if failed (e.g., "Invalid password")
  createdAt,          // Timestamp
  updatedAt           // Last modified timestamp
}
```

### Utility Functions (`/Backend/utils/auditLog.js`)

Helper functions for logging activities:

- `logAudit()` - Core function to log any audit activity
- `logLogin()` - Log login attempts (success/failure)
- `logUserCreation()` - Log when new users are created
- `logUserUpdate()` - Log user profile/data updates
- `logRoleChange()` - Log role assignment changes
- `logCertificationUpload()` - Log certification uploads
- `logRecordDeletion()` - Log record deletions
- `logProfileUpdate()` - Log self-profile updates
- `getClientIp()` - Extract IP address from request
- `getUserAgent()` - Extract user agent from request

### Controller (`/Backend/controller/auditLog.controller.js`)

Endpoints for retrieving and analyzing audit logs (admin only):

- `getAuditLogs()` - Get all audit logs with filtering and pagination
- `getUserAuditLogs()` - Get logs for specific user
- `getResourceAuditLogs()` - Get logs for specific resource
- `getAuditLogDetail()` - Get detailed view of a single log entry
- `getAuditLogsSummary()` - Get statistics and summary of audit activities

### Routes (`/Backend/routes/auditLog.js`)

**Base URL:** `/api/auditlogs`

All routes require authentication. Most require admin role.

```
GET    /api/auditlogs                    - Get all audit logs
GET    /api/auditlogs/summary             - Get audit logs summary/statistics
GET    /api/auditlogs/user/:userId        - Get logs for a specific user
GET    /api/auditlogs/resource/:resourceId - Get logs for a specific resource
GET    /api/auditlogs/:logId              - Get detailed view of a log entry
```

## Integrated Logging Points

### 1. Authentication (`/Backend/controller/auth.controller.js`)

**User Login:**
- Successful login attempts logged with status SUCCESS
- Failed login attempts (invalid credentials, account not active, etc.) logged with status FAILURE
- IP address and user agent captured for security analysis

**Profile Update:**
- When users update their own profile (firstName, lastName, location)
- Captures before/after values for audit trail

### 2. Admin Authentication (`/Backend/controller/admin.auth.controller.js`)

**Admin Login:**
- Successful admin logins logged
- Failed admin login attempts logged with specific failure reasons
- Captures admin-specific access patterns

### 3. User Management (`/Backend/controller/admin.controller.js`)

**User Creation:**
- When admins create new users
- Logs role assignment at creation time
- Captures all initial user data

**User Updates:**
- When user data is modified by admins
- Logs before/after values for all changes
- Tracks role assignments separately for compliance

**User Deletion:**
- When users are deleted from the system
- Stores full record of deleted user data
- Important for compliance and dispute resolution

### 4. Certification Management (`/Backend/controller/certification.controller.js`)

**Certification Upload:**
- When certifications are uploaded for users
- Logs certification name, issuing authority, dates
- Tracks who uploaded the certification
- Records file URL for audit trail

**Certification Deletion:**
- When certifications are removed
- Stores full certification data before deletion
- Prevents tampering with compliance records

## Query Examples

### Get All Login Attempts in Last 7 Days

```javascript
GET /api/auditlogs?action=LOGIN
```

### Get Failed Login Attempts

```javascript
GET /api/auditlogs?action=LOGIN_FAILED
```

### View Specific User's Audit Trail

```javascript
GET /api/auditlogs/user/:userId?page=1&limit=50
```

### Get Summary Statistics

```javascript
GET /api/auditlogs/summary?days=30
```

### Get All Certification Upload Activity

```javascript
GET /api/auditlogs?action=CERTIFICATION_UPLOADED
```

### Get All User Deletions

```javascript
GET /api/auditlogs?action=RECORD_DELETED&resourceType=USER
```

### Get Role Change History

```javascript
GET /api/auditlogs?action=ROLE_CHANGED
```

### Get All Changes to a Specific User

```javascript
GET /api/auditlogs/resource/:userId
```

## Response Examples

### Get Audit Logs Response

```json
{
  "success": true,
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "tenantId": "507f1f77bcf86cd799439010",
        "userId": "507f1f77bcf86cd799439012",
        "userEmail": "admin@example.com",
        "action": "LOGIN",
        "resourceType": "USER",
        "resourceId": "507f1f77bcf86cd799439012",
        "resourceName": "admin@example.com",
        "description": "Login successful for admin@example.com",
        "details": {},
        "changes": { "before": {}, "after": {} },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "status": "SUCCESS",
        "statusMessage": null,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 50,
      "pages": 3
    }
  }
}
```

### Get Summary Statistics Response

```json
{
  "success": true,
  "message": "Audit logs summary retrieved successfully",
  "data": {
    "period": "Last 7 days",
    "totalLogs": 342,
    "statistics": {
      "loginAttempts": 125,
      "failedLogins": 8,
      "userCreations": 12,
      "userUpdates": 18,
      "roleChanges": 5,
      "deletions": 3
    },
    "byAction": [
      { "_id": "LOGIN", "count": 125 },
      { "_id": "USER_CREATED", "count": 12 },
      { "_id": "USER_UPDATED", "count": 18 },
      { "_id": "ROLE_CHANGED", "count": 5 },
      { "_id": "CERTIFICATION_UPLOADED", "count": 45 },
      { "_id": "LOGIN_FAILED", "count": 8 }
    ],
    "byResourceType": [
      { "_id": "USER", "count": 215 },
      { "_id": "CERTIFICATION", "count": 89 },
      { "_id": "INCIDENT", "count": 38 }
    ]
  }
}
```

## Best Practices

### Security Considerations

1. **Access Control:** Only admins can view full audit logs
2. **Users can only view their own logs:** Non-admin users can only access their own audit trail
3. **IP Logging:** Always captures IP address for security investigation
4. **Failed Attempts:** Failed login attempts are logged with reasons for investigation
5. **Immutability:** Audit logs should never be deleted or modified

### Compliance

1. **Retention:** Consider implementing data retention policies (e.g., keep logs for 2 years)
2. **User Transparency:** Users can request their own audit trail via `GET /api/audit-logs/user/:userId`
3. **Before/After:** Update logs capture both before and after values for regulatory compliance
4. **User Consent:** Ensure users are informed about audit logging

### Performance

1. **Indexing:** Database indexes are created on frequently queried fields (tenantId, userId, action, createdAt)
2. **Pagination:** Always use pagination when querying large datasets
3. **Async Logging:** Audit logging is non-blocking - failures don't affect main operations
4. **Regular Cleanup:** Consider archiving old logs to a separate database

## Future Enhancements

1. **Microsoft 365 SSO Logging:** Extend loginAudit to capture SSO-specific information
2. **Email Notifications:** Alert admins of suspicious activities (failed login attempts, deletions)
3. **Audit Reports:** Generate compliance reports from audit logs
4. **Real-time Alerts:** Webhook notifications for critical actions
5. **Audit Log Export:** Allow exporting audit logs in various formats (CSV, JSON, PDF)
6. **Search Enhancement:** Full-text search across audit logs
7. **Role-based Filtering:** Filter what different admin roles can see in audit logs

## Testing the Audit Log System

### Test User Creation

```bash
POST /api/admin/users
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "SUPERVISOR"
}

# Then check logs:
GET /api/auditlogs?action=USER_CREATED
```

### Test Login Tracking

```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

# Check logs:
GET /api/auditlogs?action=LOGIN
```

### Test Certification Upload

```bash
POST /api/admin/users/:userId/certifications
{
  "certificationName": "Safety Certificate",
  "issuingAuthority": "ISO",
  "issueDate": "2023-01-01",
  "expiryDate": "2025-01-01",
  "fileUrl": "https://..."
}

# Check logs:
GET /api/auditlogs?action=CERTIFICATION_UPLOADED
```

## Troubleshooting

### Logs Not Being Created

1. Check that `auditLog` utility is properly imported in the controller
2. Verify `req.user` is populated (requires auth middleware)
3. Check MongoDB connection and permissions
4. Look for errors in server console

### Query Issues

1. Use proper pagination to avoid timeouts
2. Verify tenantId is correct
3. Check that user has admin role for full log access
4. Use filters to narrow results

### Performance Issues

1. Ensure database indexes are created
2. Use pagination with reasonable limits
3. Archive old logs to separate database
4. Consider using read replicas for queries

## Security Notes

- All audit log endpoints require authentication
- Non-admin users can only view their own logs
- IP addresses are logged for security investigations
- Failed attempts are tracked separately for suspicious activity detection
- Audit logs should be monitored for security breaches
