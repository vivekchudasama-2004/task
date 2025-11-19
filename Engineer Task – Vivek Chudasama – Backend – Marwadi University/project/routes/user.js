const { Router } = require("express");
const UserController = require("../controller/UserController");
const { checkJwt, checkRole } = require("../middleware/auth");

const router = Router();

// Public routes
router.post("/login", UserController.login);
router.post("/register", UserController.register);

// Admin only route
router.get("/", [checkJwt, checkRole(["admin"])], UserController.listAll);

// Authenticated route (RBAC handled inside controller)
router.get("/:id", [checkJwt], UserController.getOneById);

module.exports = router;