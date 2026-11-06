const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const allowRoles = require("../middlewares/roleMiddleware");

const {
  createResource,
  getResources,
  updateResource,
  deleteResource
} = require("../controllers/resourceController");

router.use(protect);

router.get("/", getResources);

router.post("/", allowRoles("admin"), createResource);

router.put("/:id", allowRoles("admin"), updateResource);

router.delete("/:id", allowRoles("admin"), deleteResource);

module.exports = router;