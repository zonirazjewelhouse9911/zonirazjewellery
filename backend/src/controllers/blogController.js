const Blog = require("../models/blogModel");
const BlogAccess = require("../models/blogAccessModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateSitemap } = require("../utils/sitemapGenerator");

const SECRET_KEY = process.env.SECRET_KEY || "zoniraz_admin_secret_key_9911";


// Helper function to create URL slug from string
const slugify = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // Remove all non-word chars except space and dash
    .replace(/[\s_-]+/g, '-')   // Replace spaces, underscores & multiple dashes with single dash
    .replace(/^-+|-+$/g, '');   // Remove leading & trailing dashes
};

// Initial static blogs to seed into database if collection is empty
const initialBlogs = [
  {
    title: "10 Timeless Gold Earring Styles Every Woman Must Own in 2026",
    slug: "timeless-gold-earring-styles-2026",
    category: "GOLD DAILY WEAR",
    tags: ["Gold", "Daily Wear", "Earrings"],
    excerpt: "Gold earrings have always been the cornerstone of Indian jewellery. Whether it's a pair of delicate studs for the office or bold jhumkas for a festive evening, the right gold earrings can elevate any look. In 2026, wearable luxury is all about pieces that move with you — lightweight, hallmarked, and crafted to last a lifetime.",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&q=80&w=800",
    author: "Zoniraz Team",
    isPublished: true,
    content: [
      { type: "intro", text: "Gold earrings have always been the cornerstone of Indian jewellery. Whether it's a pair of delicate studs for the office or bold jhumkas for a festive evening, the right gold earrings can elevate any look. In 2026, wearable luxury is all about pieces that move with you — lightweight, hallmarked, and crafted to last a lifetime." },
      { type: "heading", text: "1. Classic Gold Studs" },
      { type: "para", text: "Simple, clean, and eternally stylish — gold studs are the foundation of every jewellery wardrobe. Available in 18k and 22k gold, they suit every face shape and can be worn daily without any hassle. At Zoniraz, our BIS hallmarked gold studs are crafted to maintain their shine for decades." },
      { type: "heading", text: "2. Diamond Drops" },
      { type: "para", text: "Drop earrings add instant elegance to any outfit. A pair of certified diamond drops from Zoniraz can transform a simple kurti into a statement look. The combination of 18k gold and VS-clarity diamonds creates that perfect balance of luxury and wearability." },
      { type: "heading", text: "3. Hoops — The Timeless Classic" },
      { type: "para", text: "Gold hoops never go out of style. In 2026, the trend is towards larger, lighter hoops that make a statement without weighing you down. Our Dancing Hoops collection offers exactly that — lightweight 22k gold hoops with a brushed finish." },
      { type: "heading", text: "4. Traditional Jhumkas" },
      { type: "para", text: "For festive occasions and weddings, jhumkas remain the top choice for Indian women. Our heritage gold jhumkas are inspired by classic Rajasthani and South Indian designs, handcrafted by master artisans with over 50 years of experience." },
      { type: "heading", text: "5. Chandelier Earrings" },
      { type: "para", text: "When you want to make a grand entrance, chandelier earrings are your best friend. These multi-tiered gold and diamond earrings cascade beautifully, catching every light in the room. Perfect for weddings, engagements, and gala events." },
      { type: "tip", text: "Pro Tip: Always check for the BIS hallmark (916 for 22k gold, 750 for 18k gold) when buying gold earrings. This ensures you get the purity you're paying for." },
      { type: "heading", text: "Why Choose Zoniraz for Gold Earrings?" },
      { type: "para", text: "At Zoniraz Jewel House, every piece of gold jewellery undergoes rigorous quality checks. With 50+ years of craftsmanship and a commitment to customer transparency, we offer certified gold earrings at fair prices with flexible exchange options." }
    ]
  },

  {
    title: "The Ultimate Bridal Jewellery Guide: From Maang Tikka to Bangles",
    slug: "ultimate-bridal-jewellery-guide",
    category: "BRIDAL STYLING",
    tags: ["Bridal", "Styling", "Gold"],
    excerpt: "Your wedding day deserves jewellery that tells a story. From the delicate shimmer of a maang tikka to the bold statement of stacked gold bangles, bridal jewellery is an art form. Discover how to build a complete bridal set that complements your lehenga, reflects your personality, and becomes a treasured heirloom for generations.",
    date: "July 10, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    author: "Zoniraz Team",
    isPublished: true,
    content: [
      { type: "intro", text: "Your wedding day deserves jewellery that tells a story. From the delicate shimmer of a maang tikka to the bold statement of stacked gold bangles, bridal jewellery is an art form. Discover how to build a complete bridal set that complements your lehenga and becomes a treasured heirloom." },
      { type: "heading", text: "The Maang Tikka: Crown of the Bride" },
      { type: "para", text: "No Indian bridal look is complete without a maang tikka. This elegant head ornament symbolises purity and grace. Choose a gold maang tikka studded with diamonds or polkis that complements your necklace set. At Zoniraz, our bridal maang tikkas are available in 22k gold with certified stone settings." },
      { type: "heading", text: "The Bridal Necklace: Make Your Statement" },
      { type: "para", text: "The necklace is the centrepiece of your bridal look. A layered bridal set with a choker, a long necklace, and a satlada creates a regal appearance. For modern brides, a single heavy diamond necklace with matching earrings creates a clean, luxurious look." },
      { type: "heading", text: "Earrings: Jhumkas vs Chandbalis" },
      { type: "para", text: "Traditional jhumkas are perfect for classic bridal looks while chandbalis (crescent-shaped earrings) suit contemporary brides. For heavy lehengas, choose statement earrings that hold their own. For lighter outfits, intricate chandbalis or kundan studs work beautifully." },
      { type: "tip", text: "Styling Tip: Don't over-accessorise. If your necklace is heavy and elaborate, choose simpler earrings. Let one piece be the hero of your look." },
      { type: "heading", text: "Bangles: The Sound of Celebration" },
      { type: "para", text: "Gold bangles symbolise prosperity and good fortune in Indian weddings. Brides traditionally wear sets of 7, 11, or 21 bangles. Mix gold bangles with polki or diamond bangles for a layered look. At Zoniraz, our bridal bangle sets are handcrafted in 22k gold." },
      { type: "heading", text: "Building Your Bridal Budget" },
      { type: "para", text: "Plan your bridal jewellery budget systematically. Prioritise pieces that you'll wear beyond your wedding day — diamond earrings, a classic gold necklace, and a statement ring can be restyled for future events. At Zoniraz, we also offer our Gold Mine saving scheme to plan your bridal jewellery investment in advance." }
    ]
  },
  {
    title: "Gold Saving Scheme: The Smartest Way to Invest in Gold Monthly",
    slug: "gold-saving-scheme-smartest-investment",
    category: "GOLD INVESTMENT",
    tags: ["Gold", "Trending", "Editor's Picks"],
    excerpt: "Buying gold all at once can be a heavy investment. That's why a smart gold saving scheme — where you invest a fixed amount every month — is the modern way to build your gold portfolio. Zoniraz's Gold Mine plan lets you accumulate gold systematically, benefiting from rupee-cost averaging and flexible redemption in jewellery.",
    date: "June 28, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&q=80&w=800",
    author: "Zoniraz Team",
    isPublished: true,
    content: [
      { type: "intro", text: "Buying gold all at once can be a heavy investment. That's why a smart gold saving scheme — where you invest a fixed amount every month — is the modern way to build your gold portfolio. Zoniraz's Gold Mine plan lets you accumulate gold systematically." },
      { type: "heading", text: "What is a Gold Saving Scheme?" },
      { type: "para", text: "A gold saving scheme (also called a gold SIP or gold chit fund) allows you to invest a fixed amount every month towards buying gold. Instead of buying a large quantity at once, you accumulate gold gradually over 6, 11, or 24 months. This way, you benefit from rupee-cost averaging — buying more gold when prices are low and less when prices are high." },
      { type: "heading", text: "How Does Zoniraz Gold Mine Work?" },
      { type: "para", text: "Zoniraz's Gold Mine plan is simple: you pay a fixed monthly installment for a chosen period. At the end of the tenure, you can redeem your accumulated value in beautiful jewellery from our collection — gold earrings, rings, necklaces, or any piece you desire. The bonus? Zoniraz adds extra value on your last installment." },
      { type: "tip", text: "Smart Investment: Gold has historically delivered 10-12% annual returns over the long term. A monthly gold saving scheme is one of the safest ways to build wealth while also saving for jewellery." },
      { type: "heading", text: "Benefits of a Gold Saving Scheme" },
      { type: "para", text: "No large upfront investment is required. You benefit from averaging out gold price fluctuations. It's a disciplined saving habit that grows over time. At the end, you get beautiful jewellery from a trusted brand with 50+ years of heritage. Flexible tenures from 6 to 24 months." },
      { type: "heading", text: "Who Should Join the Gold Mine Plan?" },
      { type: "para", text: "The Gold Mine plan is ideal for anyone planning a wedding in the next 1-2 years, parents saving for their daughter's wedding jewellery, young professionals building a gold investment portfolio, and anyone who wants to buy quality jewellery without financial strain." }
    ]
  },
  {
    title: "Old Gold Exchange: How to Get the Best Value for Your Old Jewellery",
    slug: "old-gold-exchange-best-value",
    category: "GOLD EXCHANGE",
    tags: ["Gold", "Styling"],
    excerpt: "Is your old gold gathering dust in a locker? Turn it into something beautiful. The old gold exchange process at Zoniraz is transparent, fair, and hassle-free. We evaluate your gold at current market rates using certified BIS standards, giving you full value to upgrade into our latest hallmarked collections — diamonds, necklaces, or custom rings.",
    date: "June 15, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1569397288884-4d43d6738fbd?auto=format&fit=crop&q=80&w=800",
    author: "Zoniraz Team",
    isPublished: true,
    content: [
      { type: "intro", text: "Is your old gold gathering dust in a locker? Turn it into something beautiful. The old gold exchange process at Zoniraz is transparent, fair, and hassle-free. We evaluate your gold at current market rates using certified BIS standards." },
      { type: "heading", text: "Why Exchange Your Old Gold?" },
      { type: "para", text: "Old gold sitting unused in a locker is a wasted asset. Gold prices have never been higher, making this the perfect time to exchange your old jewellery for new, modern designs. Whether it's inherited pieces that feel outdated or jewellery you no longer wear, an exchange gives them new life." },
      { type: "heading", text: "How the Zoniraz Old Gold Exchange Works" },
      { type: "para", text: "Step 1: Bring your old gold jewellery to Zoniraz Jewel House. Step 2: Our expert evaluators test your gold purity using a certified BIS testing method (X-ray fluorescence or acid testing). Step 3: You receive a fair valuation based on current live gold market rates. Step 4: Use the full value towards your new jewellery purchase. No hidden deductions, no unfair making charges on old gold." },
      { type: "tip", text: "Important: Always get a written valuation receipt before agreeing to any exchange. At Zoniraz, we provide a detailed breakdown of how your old gold value is calculated." },
      { type: "heading", text: "What Types of Old Gold Do We Accept?" },
      { type: "para", text: "We accept all types of old gold jewellery — 14k, 18k, 22k, and 24k gold. We also accept gold coins, broken jewellery, and antique pieces. The only requirement is that the gold must be genuine — we do not accept gold-plated items." },
      { type: "heading", text: "Maximising Your Exchange Value" },
      { type: "para", text: "Exchange when gold prices are high. Bring any original purchase bills or certificates. Clean your jewellery before bringing it in. Choose to upgrade into higher-purity gold for better long-term value." }
    ]
  },
  {
    title: "Gold Pendant Necklaces: The Art of Layering for Every Occasion",
    slug: "gold-pendant-necklace-layering-guide",
    category: "STYLING PENDANTS",
    tags: ["Gold", "Styling", "Daily Wear"],
    excerpt: "A gold pendant necklace is the most versatile piece in any jewellery wardrobe. Whether you layer delicate chains for a bohemian office look or wear a single bold diamond pendant to a wedding, the right necklace frames your face and completes your outfit. Explore Zoniraz's curated range of 18k and 22k gold pendants designed for everyday luxury.",
    date: "June 5, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800",
    author: "Zoniraz Team",
    isPublished: true,
    content: [
      { type: "intro", text: "A gold pendant necklace is the most versatile piece in any jewellery wardrobe. Whether you layer delicate chains for a bohemian office look or wear a single bold diamond pendant to a wedding, the right necklace frames your face and completes your outfit." },
      { type: "heading", text: "The Art of Layering Gold Necklaces" },
      { type: "para", text: "Layering is the biggest jewellery trend of 2026. The key to perfect layering is varying the lengths and weights of your chains. Start with a delicate choker (14-16 inches), add a medium pendant chain (18-20 inches), and finish with a longer statement chain (22-24 inches). The result is an effortlessly luxurious look." },
      { type: "heading", text: "Choosing the Right Pendant" },
      { type: "para", text: "Your pendant should reflect your personality. Classic solitaire diamond pendants are timeless and suit every outfit. Geometric pendants (triangles, hexagons, circles) are modern and minimalist. Floral or nature-inspired pendants are feminine and romantic. Religious pendants like Om, Ganesh, or Cross carry deep meaning." },
      { type: "tip", text: "Style Rule: When wearing a bold necklace, keep your earrings simple. When wearing delicate layered chains, you can add statement earrings for drama." },
      { type: "heading", text: "Gold Karat Guide for Pendants" },
      { type: "para", text: "For daily wear pendants, 18k gold (750 purity) offers the best balance of durability and luxury. For special occasion pendants with gemstones, 22k gold (916 purity) provides a rich, warm colour. For modern minimalist designs, 14k gold is lightweight and durable." },
      { type: "heading", text: "Zoniraz Pendant Collections" },
      { type: "para", text: "Explore Zoniraz's curated range of gold and diamond pendants — from our bestselling infinity necklaces to our contemporary layered pendant sets. Every piece is BIS hallmarked, certified, and comes with a detailed quality certificate. Shop online or visit our showroom in Jaipur for a personalised experience." }
    ]
  }
];

// Helper to seed initial blogs if database is empty
const seedInitialBlogs = async () => {
  try {
    await Blog.deleteMany({ slug: "diamond-engagement-ring-complete-guide-2026" });
    const count = await Blog.countDocuments();
    if (count === 0) {
      await Blog.insertMany(initialBlogs);
      console.log("[Blog Controller] Initial blogs seeded successfully.");
    }
  } catch (err) {
    console.error("[Blog Controller] Error seeding initial blogs:", err);
  }
};

// Auto seed on load
seedInitialBlogs();

// ── Public Endpoints ─────────────────────────────────────────────────────────

// GET /api/blogs - Fetch published blogs for frontend, sorted latest first
exports.getAllBlogs = async (req, res) => {
  try {
    await seedInitialBlogs();
    const { category, tag, search } = req.query;

    let query = { isPublished: true, slug: { $ne: "diamond-engagement-ring-complete-guide-2026" } };

    if (category && category !== "All Blogs") {
      query.category = { $regex: new RegExp(category, "i") };
    }

    if (tag && tag !== "All Blogs") {
      query.tags = { $in: [new RegExp(tag, "i")] };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    // Sort by createdAt descending so LATEST blog is first!
    const blogs = await Blog.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};

// GET /api/blogs/:slug - Fetch single blog by slug for frontend
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await Blog.findOne({ slug, isPublished: true });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog post",
      error: error.message
    });
  }
};

// ── Admin Endpoints ──────────────────────────────────────────────────────────

// GET /api/admin/blogs - Fetch all blogs for admin portal
exports.getAdminBlogs = async (req, res) => {
  try {
    await seedInitialBlogs();
    const blogs = await Blog.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error("Error fetching admin blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin blogs",
      error: error.message
    });
  }
};

// POST /api/admin/blogs - Create new blog article
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, category, tags, excerpt, content, image, date, readTime, author, isPublished } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Blog title is required"
      });
    }

    const finalSlug = slug && slug.trim() ? slugify(slug) : slugify(title);

    // Check if slug already exists
    const existing = await Blog.findOne({ slug: finalSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A blog post with slug '${finalSlug}' already exists. Please choose a different title or slug.`
      });
    }

    const formattedDate = date || new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const parsedTags = Array.isArray(tags)
      ? tags
      : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);

    const newBlog = await Blog.create({
      title,
      slug: finalSlug,
      category: category || "JEWELLERY",
      tags: parsedTags,
      excerpt: excerpt || "",
      content: content || [],
      image: image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
      date: formattedDate,
      readTime: readTime || "5 min read",
      author: author || "Zoniraz Team",
      isPublished: isPublished !== undefined ? isPublished : true
    });

    // Auto update sitemap XML!
    try {
      await generateSitemap();
      console.log(`[Sitemap] Updated successfully after creating blog '${newBlog.slug}'`);
    } catch (sitemapErr) {
      console.error("[Sitemap] Failed to update sitemap after creating blog:", sitemapErr);
    }

    return res.status(201).json({
      success: true,
      message: "Blog article created successfully",
      data: newBlog
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog article",
      error: error.message
    });
  }
};

// PUT /api/admin/blogs/:id - Update existing blog article
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, category, tags, excerpt, content, image, date, readTime, author, isPublished } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found"
      });
    }

    if (title) blog.title = title;
    if (slug) blog.slug = slugify(slug);
    if (category) blog.category = category;
    if (tags) {
      blog.tags = Array.isArray(tags)
        ? tags
        : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []);
    }
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (content !== undefined) blog.content = content;
    if (image !== undefined) blog.image = image;
    if (date !== undefined) blog.date = date;
    if (readTime !== undefined) blog.readTime = readTime;
    if (author !== undefined) blog.author = author;
    if (isPublished !== undefined) blog.isPublished = isPublished;

    await blog.save();

    // Auto update sitemap XML!
    try {
      await generateSitemap();
      console.log(`[Sitemap] Updated successfully after updating blog '${blog.slug}'`);
    } catch (sitemapErr) {
      console.error("[Sitemap] Failed to update sitemap after updating blog:", sitemapErr);
    }

    return res.status(200).json({
      success: true,
      message: "Blog article updated successfully",
      data: blog
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update blog article",
      error: error.message
    });
  }
};

// DELETE /api/admin/blogs/:id - Delete blog article
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog article not found"
      });
    }

    // Auto update sitemap XML!
    try {
      await generateSitemap();
      console.log(`[Sitemap] Updated successfully after deleting blog '${blog.slug}'`);
    } catch (sitemapErr) {
      console.error("[Sitemap] Failed to update sitemap after deleting blog:", sitemapErr);
    }

    return res.status(200).json({
      success: true,
      message: "Blog article deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog article",
      error: error.message
    });
  }
};

// ── Blog Writer Access Credentials Management ────────────────────────────────

// GET /api/admin/blogs/access - Fetch current Blog Writer Access accounts
exports.getBlogAccessCredentials = async (req, res) => {
  try {
    const accessList = await BlogAccess.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: accessList.length,
      data: accessList
    });
  } catch (error) {
    console.error("Error fetching blog access credentials:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog access credentials",
      error: error.message
    });
  }
};

// POST /api/admin/blogs/access - Set / Update Blog Writer credentials
exports.setBlogAccessCredentials = async (req, res) => {
  try {
    const { email, username, password, name, isActive } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and Password are required"
      });
    }

    const trimmedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcrypt.hash(password, 10);

    let writer = await BlogAccess.findOne({ email: trimmedEmail });
    if (writer) {
      writer.password = hashedPassword;
      if (username !== undefined) writer.username = username;
      if (name !== undefined) writer.name = name;
      if (isActive !== undefined) writer.isActive = isActive;
      await writer.save();
    } else {
      writer = await BlogAccess.create({
        email: trimmedEmail,
        username: username || trimmedEmail.split("@")[0],
        password: hashedPassword,
        name: name || "Blog Writer",
        role: "blog_writer",
        isActive: isActive !== undefined ? isActive : true
      });
    }

    return res.status(200).json({
      success: true,
      message: `Blog Writer credentials for '${trimmedEmail}' updated successfully`,
      data: {
        id: writer._id,
        email: writer.email,
        username: writer.username,
        name: writer.name,
        isActive: writer.isActive,
        role: writer.role
      }
    });

  } catch (error) {
    console.error("Error setting blog access credentials:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to set blog access credentials",
      error: error.message
    });
  }
};

// POST /api/blogs/login - Dedicated login endpoint for Blog Writer
exports.blogWriterLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Username/Email and password required" });
    }

    const input = email.toLowerCase().trim();
    const writer = await BlogAccess.findOne({
      $or: [{ email: input }, { username: input }],
      isActive: true
    });

    if (!writer) {
      return res.status(401).json({ success: false, message: "Invalid credentials or inactive account" });
    }

    const isMatch = await bcrypt.compare(password, writer.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: writer._id, email: writer.email, role: "blog_writer" },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Blog Writer authentication successful",
      token,
      user: {
        id: writer._id,
        email: writer.email,
        username: writer.username,
        name: writer.name,
        role: "blog_writer"
      }
    });

  } catch (error) {
    console.error("Error in blogWriterLogin:", error);
    return res.status(500).json({ success: false, message: "Internal server error during authentication" });
  }
};

