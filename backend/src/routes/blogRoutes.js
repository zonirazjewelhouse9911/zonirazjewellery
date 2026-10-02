const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const httpCache = require("../middleware/httpCache");

// Public routes for user frontend
router.get("/blogs", httpCache(60), blogController.getAllBlogs);
router.get("/blogs/:slug", httpCache(60), blogController.getBlogBySlug);

// Dedicated Blog Writer Login
router.post("/blogs/login", blogController.blogWriterLogin);

// Admin routes for portal
router.get("/admin/blogs", blogController.getAdminBlogs);
router.post("/admin/blogs", blogController.createBlog);
router.put("/admin/blogs/:id", blogController.updateBlog);
router.delete("/admin/blogs/:id", blogController.deleteBlog);

// Blog Writer Access Management routes
router.get("/admin/blogs/access", blogController.getBlogAccessCredentials);
router.post("/admin/blogs/access", blogController.setBlogAccessCredentials);

module.exports = router;

