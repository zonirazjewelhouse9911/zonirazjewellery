const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");

// Public routes for user frontend
router.get("/blogs", blogController.getAllBlogs);
router.get("/blogs/:slug", blogController.getBlogBySlug);

// Admin routes for portal
router.get("/admin/blogs", blogController.getAdminBlogs);
router.post("/admin/blogs", blogController.createBlog);
router.put("/admin/blogs/:id", blogController.updateBlog);
router.delete("/admin/blogs/:id", blogController.deleteBlog);

module.exports = router;
