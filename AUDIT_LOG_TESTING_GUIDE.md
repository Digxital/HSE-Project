# Audit Log System - Testing & Implementation Guide

## Prerequisites

1. **MongoDB Running** - Make sure MongoDB is running
2. **.env File Configured** - Ensure your `.env` has:
   ```
   MONGO_URI=mongodb://localhost:27017/aegix
   JWT_SECRET=your_secret_key
   PORT=5000
   ```
3. **Dependencies Installed** - Run `npm install` in the Backend folder
4. **Server Running** - Start the server with `npm start`

## Step 1: Start the Server

```bash
cd Backend
npm start
```

You should see:
```
MongoDB connected
Server running on port 5000
```

## Step 2: Test User Creation (to get Auth Token)

### Using Postman or curl

**Create Admin User First (if not exists):**

```bash
POST http://localhost:5000/api/admin/auth/register
Content-Type: application/json

{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Admin registered successfully",
  "data": {
    "email": "admin@example.com"
  }
}
```

### Login to Get Token

```bash
POST http://localhost:5000/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "ADMIN"
  }
}
```

**Copy the token** - You'll use it for all subsequent requests

## Step 3: Test Audit Log Creation - Login Event

When you logged in above, it created an audit log automatically. Test retrieving it:

```bash
GET http://localhost:5000/api/auditlogs
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
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
        "description": "Login successful for admin@example.com",
        "ipAddress": "::1",
        "userAgent": "PostmanRuntime/7.32.3",
        "status": "SUCCESS",
        "statusMessage": null,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 50,
      "pages": 1
    }
  }
}
```

## Step 4: Test User Creation Audit Log

Create a new user to trigger USER_CREATED logging:

```bash
POST http://localhost:5000/api/admin/users
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "John@123",
  "role": "SUPERVISOR",
  "location": "New York"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "SUPERVISOR created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013"
  }
}
```

Now retrieve audit logs filtered by USER_CREATED:

```bash
GET http://localhost:5000/api/auditlogs?action=USER_CREATED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "507f1f77bcf86cd799439014",
        "action": "USER_CREATED",
        "resourceType": "USER",
        "resourceId": "507f1f77bcf86cd799439013",
        "resourceName": "john.doe@example.com",
        "description": "User created: john.doe@example.com with role SUPERVISOR",
        "details": {
          "firstName": "John",
          "lastName": "Doe",
          "role": "SUPERVISOR",
          "email": "john.doe@example.com"
        },
        "status": "SUCCESS",
        "createdAt": "2024-01-15T10:35:00Z"
      }
    ]
  }
}
```

## Step 5: Test User Update Audit Log

Update the user to trigger USER_UPDATED logging:

```bash
PUT http://localhost:5000/api/admin/users/507f1f77bcf86cd799439013
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "firstName": "Jonathan",
  "lastName": "Doe Smith",
  "role": "HSE_OFFICER",
  "status": "ACTIVE"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": { /* updated user data */ }
}
```

Check the audit log:

```bash
GET http://localhost:5000/api/auditlogs?action=USER_UPDATED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

You'll see:
```json
{
  "action": "USER_UPDATED",
  "description": "User updated: john.doe@example.com",
  "changes": {
    "before": {
      "firstName": "John",
      "lastName": "Doe",
      "role": "SUPERVISOR",
      "status": "PENDING"
    },
    "after": {
      "firstName": "Jonathan",
      "lastName": "Doe Smith",
      "role": "HSE_OFFICER",
      "status": "ACTIVE"
    }
  }
}
```

## Step 6: Test Role Change Audit Log

The role change is tracked separately:

```bash
GET http://localhost:5000/api/auditlogs?action=ROLE_CHANGED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

You'll see:
```json
{
  "action": "ROLE_CHANGED",
  "description": "Role changed for john.doe@example.com from SUPERVISOR to HSE_OFFICER",
  "changes": {
    "before": { "role": "SUPERVISOR" },
    "after": { "role": "HSE_OFFICER" }
  }
}
```

## Step 7: Test Failed Login Audit Log

Attempt login with wrong password:

```bash
POST http://localhost:5000/api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "WrongPassword"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid admin credentials",
  "data": {}
}
```

Check failed login logs:

```bash
GET http://localhost:5000/api/auditlogs?action=LOGIN_FAILED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "action": "LOGIN_FAILED",
  "description": "Login failed for admin@example.com",
  "status": "FAILURE",
  "statusMessage": "Invalid password",
  "ipAddress": "::1"
}
```

## Step 8: Test Certification Upload Audit Log

First, create or upload a certification:

```bash
POST http://localhost:5000/api/admin/users/507f1f77bcf86cd799439013/certifications
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "certificationName": "ISO 45001 Safety",
  "issuingAuthority": "ISO International",
  "issueDate": "2023-01-01",
  "expiryDate": "2025-12-31",
  "fileUrl": "https://example.com/iso-45001.pdf"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Certification created successfully",
  "data": {
    "certificationId": "507f1f77bcf86cd799439015"
  }
}
```

Check the certification audit log:

```bash
GET http://localhost:5000/api/auditlogs?action=CERTIFICATION_UPLOADED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "action": "CERTIFICATION_UPLOADED",
  "description": "Certification uploaded: ISO 45001 Safety for user 507f1f77bcf86cd799439013",
  "resourceType": "CERTIFICATION",
  "details": {
    "fileUrl": "https://example.com/iso-45001.pdf",
    "targetUserId": "507f1f77bcf86cd799439013",
    "certificationName": "ISO 45001 Safety"
  }
}
```

## Step 9: Test User Deletion Audit Log

Delete a user:

```bash
DELETE http://localhost:5000/api/admin/users/507f1f77bcf86cd799439013
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

Check deletion audit log:

```bash
GET http://localhost:5000/api/auditlogs?action=RECORD_DELETED&resourceType=USER
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "action": "RECORD_DELETED",
  "resourceType": "USER",
  "description": "USER deleted: john.doe@example.com",
  "details": {
    "deletedRecord": {
      "firstName": "Jonathan",
      "lastName": "Doe Smith",
      "email": "john.doe@example.com",
      "role": "HSE_OFFICER",
      "status": "ACTIVE"
    }
  }
}
```

## Step 10: Test Audit Log Queries

### Get All Logs with Pagination

```bash
GET http://localhost:5000/api/auditlogs?page=1&limit=10
Authorization: Bearer <YOUR_TOKEN_HERE>
```

### Get Logs for Specific User

```bash
GET http://localhost:5000/api/auditlogs/user/507f1f77bcf86cd799439012?page=1&limit=50
Authorization: Bearer <YOUR_TOKEN_HERE>
```

### Get Summary Statistics

```bash
GET http://localhost:5000/api/auditlogs/summary?days=7
Authorization: Bearer <YOUR_TOKEN_HERE>
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period": "Last 7 days",
    "totalLogs": 15,
    "statistics": {
      "loginAttempts": 8,
      "failedLogins": 1,
      "userCreations": 3,
      "userUpdates": 2,
      "roleChanges": 1,
      "deletions": 1
    },
    "byAction": [
      { "_id": "LOGIN", "count": 8 },
      { "_id": "USER_CREATED", "count": 3 },
      { "_id": "USER_UPDATED", "count": 2 },
      { "_id": "ROLE_CHANGED", "count": 1 },
      { "_id": "CERTIFICATION_UPLOADED", "count": 1 }
    ]
  }
}
```

### Get Specific Log Detail

```bash
GET http://localhost:5000/api/auditlogs/507f1f77bcf86cd799439014
Authorization: Bearer <YOUR_TOKEN_HERE>
```

## Step 11: Test Profile Update Audit Log

Update your own profile:

```bash
POST http://localhost:5000/api/auth/updateProfile
Authorization: Bearer <YOUR_TOKEN_HERE>
Content-Type: application/json

{
  "firstName": "AdminFirst",
  "lastName": "AdminLast",
  "location": "San Francisco"
}
```

Check audit log:

```bash
GET http://localhost:5000/api/auditlogs?action=PROFILE_UPDATED
Authorization: Bearer <YOUR_TOKEN_HERE>
```

## Using cURL (Command Line)

If you prefer command line testing:

### Login and Save Token

```bash
curl -X POST http://localhost:5000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}' \
  | jq -r '.data.token' > token.txt

TOKEN=$(cat token.txt)
```

### Get All Audit Logs

```bash
curl -X GET "http://localhost:5000/api/auditlogs" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Login Logs Only

```bash
curl -X GET "http://localhost:5000/api/auditlogs?action=LOGIN" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Summary Statistics

```bash
curl -X GET "http://localhost:5000/api/auditlogs/summary?days=7" \
  -H "Authorization: Bearer $TOKEN"
```

## MongoDB Query Examples

If you want to check the logs directly in MongoDB:

```javascript
// Connect to MongoDB
use aegix

// Get all audit logs
db.auditlogs.find().pretty()

// Get login logs
db.auditlogs.find({ action: "LOGIN" }).pretty()

// Get failed login attempts
db.auditlogs.find({ action: "LOGIN_FAILED" }).pretty()

// Get logs for specific user
db.auditlogs.find({ userId: ObjectId("507f1f77bcf86cd799439012") }).pretty()

// Get logs from last 24 hours
db.auditlogs.find({
  createdAt: {
    $gte: new Date(new Date().setDate(new Date().getDate() - 1))
  }
}).pretty()

// Count total logs by action
db.auditlogs.aggregate([
  { $group: { _id: "$action", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
]).pretty()

// Get most recent 10 logs
db.auditlogs.find().sort({ createdAt: -1 }).limit(10).pretty()
```

## Quick Testing Checklist

- [ ] Server starts without errors
- [ ] Can create admin user
- [ ] Can login and get token
- [ ] LOGIN audit log is created
- [ ] Can view audit logs with GET /api/auditlogs
- [ ] Create user triggers USER_CREATED log
- [ ] Update user triggers USER_UPDATED log
- [ ] Role change triggers ROLE_CHANGED log
- [ ] Failed login triggers LOGIN_FAILED log
- [ ] Upload certification triggers CERTIFICATION_UPLOADED log
- [ ] Delete certification triggers RECORD_DELETED log
- [ ] Delete user triggers RECORD_DELETED log
- [ ] Can filter logs by action
- [ ] Can filter logs by resource type
- [ ] Pagination works
- [ ] Summary statistics endpoint works

## Troubleshooting

### No Logs Appearing

1. **Check MongoDB Connection**
   ```bash
   # In MongoDB
   use aegix
   db.auditlogs.countDocuments()
   ```

2. **Check Server Logs** - Look for errors in terminal

3. **Verify Auth Middleware** - Ensure `req.user` is populated

4. **Check Tenant ID** - Make sure tenant ID is being passed correctly

### "User can only view their own logs"

- Non-admin users can only access their own logs
- Use admin token for full access

### Logs Not Being Created

1. Verify all controllers have the audit logging imports
2. Check that `req.user` object is populated
3. Ensure tenantId is available in req.user

## Next Steps

1. **Test all endpoints** - Go through the checklist above
2. **Monitor logs** - Set up log monitoring dashboard
3. **Set retention policy** - Decide how long to keep logs
4. **Create alerts** - Set up alerts for suspicious activities
5. **Regular review** - Check logs regularly for security
6. **Backup logs** - Archive logs to external storage

## Support

If you encounter issues:
1. Check server console for errors
2. Verify MongoDB is running
3. Check token is valid (JWT)
4. Ensure user has admin role for full access
5. Check .env file configuration
