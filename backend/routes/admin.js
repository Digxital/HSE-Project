const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controller/admin.controller");
 
// Create user
router.post(
  "/users",
  auth,
  authorize(["ADMIN"], ["web"]),
  createUser
);

// Get all users
router.get(
  "/users",
  auth,
  authorize(["ADMIN"], ["web"]),
  getUsers
);

// Get single user
router.get(
  "/users/:id",
  auth,
  authorize(["ADMIN"], ["web"]),
  getUserById
);

// Update user
router.put(
  "/users/:id",
  auth,
  authorize(["ADMIN"], ["web"]),
  updateUser
);

// Delete user
router.delete(
  "/users/:id",
  auth,
  authorize(["ADMIN"], ["web"]),
  deleteUser
);

module.exports = router;
