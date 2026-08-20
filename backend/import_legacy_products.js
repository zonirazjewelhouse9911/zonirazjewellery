const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment configuration
dotenv.config();

const Product = require("./src/models/productModel");
const Category = require("./src/models/categoryModel");

const safeNum = (val, defaultVal = 0) => {
  if (val === null || val === undefined || val === '') return defaultVal;
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
};

const defaultCategoryMap = {
  "1": "Rings",
  "2": "Earrings",
  "3": "Pendants",
  "4": "Rings",
  "5": "Chains",
  "6": "Mangalsutra",
  "7": "Bangles",
  "8": "Tennis Bracelets",
  "9": "Bracelets",
  "10": "Nose Pins"
};

const defaultSubcategoryMap = {
  "1": "Engagement Rings",
  "2": "Solitaire Rings",
  "3": "Casual Rings",
  "4": "Cocktail Rings",
  "5": "Band Rings",
  "6": "Stud Earrings",
  "7": "Hoop Earrings",
  "8": "Drop Earrings",
  "9": "Diamond",
  "10": "colour stone ring",
  "42": "Diamond Pendant",
  "61": "Band Rings",
  "73": "Stud Earrings",
  "74": "Band Rings",
  "75": "Solitaire Rings",
  "78": "Hoop Earrings"
};

async function importProducts(filePathArg) {
  try {
    // 1. Resolve JSON File Path
    let inputPath = filePathArg;
    if (!inputPath) {
      // Look for tbl_products.json in backend directory or parent directories
      const candidates = [
        path.join(__dirname, "tbl_products.json"),
        path.join(__dirname, "../tbl_products.json"),
        path.join(process.cwd(), "tbl_products.json"),
        path.join(process.cwd(), "../tbl_products.json")
      ];
      inputPath = candidates.find(p => fs.existsSync(p));
    }

    if (!inputPath || !fs.existsSync(inputPath)) {
      console.error("❌ Error: JSON file not found!");
      console.log("Usage: node import_legacy_products.js <path_to_json_file>");
      process.exit(1);
    }

    console.log(`📁 Loading JSON data from: ${inputPath}`);
    const fileData = fs.readFileSync(inputPath, "utf8");
    let rawProducts = [];
    try {
      const parsedData = JSON.parse(fileData);
      rawProducts = Array.isArray(parsedData) ? parsedData : (parsedData ? [parsedData] : []);
    } catch (e) {
      // Handle NDJSON (JSON Lines where each line is a JSON object)
      const lines = fileData.split(/\r?\n/);
      for (const line of lines) {
        let trimmed = line.trim();
        if (trimmed) {
          if (trimmed.endsWith(',')) trimmed = trimmed.slice(0, -1).trim();
          try {
            rawProducts.push(JSON.parse(trimmed));
          } catch (err) {
            try {
              // Replace unescaped control characters in JSON strings
              const sanitizedLine = trimmed.replace(/[\r\n\t]+/g, ' ');
              rawProducts.push(JSON.parse(sanitizedLine));
            } catch (err2) {
              console.warn(`⚠️ Skipped unparseable line: ${trimmed.substring(0, 50)}...`);
            }
          }
        }
      }
    }
    console.log(`📦 Loaded ${rawProducts.length} raw product document(s).`);

    // 2. Connect to MongoDB
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.Mongo_URI);
    console.log("✅ Connected to MongoDB.");

    // 3. Build Dynamic Category Map from DB
    const dbCategories = await Category.find().lean();
    const dynamicCategoryMap = { ...defaultCategoryMap };
    dbCategories.forEach(cat => {
      if (cat.name) {
        // Normalize lookup
        const slugKey = cat.slug || cat.name.toLowerCase();
        dynamicCategoryMap[slugKey] = cat.name;
      }
    });

    // 4. Transform & Filter Products
    console.log("⚙️  Transforming product data and checking product_code constraints...");
    
    // Fetch existing product_codes from database to avoid duplicate entries & preserve existing data
    const existingDbCodes = await Product.distinct("product_code");
    const existingCodeSet = new Set(
      existingDbCodes
        .filter(Boolean)
        .map(code => String(code).trim().toLowerCase())
    );

    const validProducts = [];
    let skippedCount0000 = 0;
    let skippedCountDuplicate = 0;

    for (let idx = 0; idx < rawProducts.length; idx++) {
      const p = rawProducts[idx];
      const rawCode = String(p.product_code || "").trim();
      const codeLower = rawCode.toLowerCase();

      // Check 1: Skip if product_code is empty, "0", "00000", or all zeros
      if (!rawCode || rawCode === "00000" || /^0+$/.test(rawCode)) {
        skippedCount0000++;
        continue;
      }

      // Check 2: Skip if product_code already exists in database or earlier in this import
      if (existingCodeSet.has(codeLower)) {
        skippedCountDuplicate++;
        continue;
      }

      // Track code in set to prevent duplicate product_code in the same file
      existingCodeSet.add(codeLower);

      // Parse gallery string if needed
      let parsedGallery = p.gallery;
      if (typeof p.gallery === "string" && p.gallery.trim()) {
        try {
          parsedGallery = JSON.parse(p.gallery);
        } catch (e) {
          parsedGallery = p.gallery;
        }
      }

      // Category & Subcategory Name Resolution with Title Fallback
      const catIdStr = String(p.category_id || "");
      const subcatIdStr = String(p.subcategory_id || "");
      const title = p.product_title || p.name || `Jewellery Item ${p.product_id}`;
      const titleLower = title.toLowerCase();

      let resolvedCategory = defaultCategoryMap[catIdStr] || dynamicCategoryMap[catIdStr] || p.product_category || p.category;
      if (!resolvedCategory || catIdStr === "Other") {
        if (titleLower.includes("ring") || titleLower.includes("band")) resolvedCategory = "Rings";
        else if (titleLower.includes("earring") || titleLower.includes("tops") || titleLower.includes("hoop")) resolvedCategory = "Earrings";
        else if (titleLower.includes("pendent") || titleLower.includes("pendant")) resolvedCategory = "Pendants";
        else if (titleLower.includes("bangle") || titleLower.includes("bracelet")) resolvedCategory = "Bangles";
        else if (titleLower.includes("chain")) resolvedCategory = "Chains";
        else resolvedCategory = "Rings";
      }

      let resolvedSubcategory = defaultSubcategoryMap[subcatIdStr] || p.product_subcategory || p.subcategory;
      if (!resolvedSubcategory) {
        if (titleLower.includes("hoop")) resolvedSubcategory = "Hoop Earrings";
        else if (titleLower.includes("tops") || titleLower.includes("stud")) resolvedSubcategory = "Stud Earrings";
        else if (titleLower.includes("band") || titleLower.includes("ring")) resolvedSubcategory = "Band Rings";
        else if (titleLower.includes("pendant") || titleLower.includes("pendent")) resolvedSubcategory = "Diamond Pendant";
        else resolvedSubcategory = "";
      }

      const prodId = String(p.product_id || p.id || p._id || `PROD-${Date.now()}-${idx}`);
      const slug = p.product_slug || p.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      validProducts.push({
        product_id: prodId,
        category_id: resolvedCategory,
        subcategory_id: resolvedSubcategory,
        product_category: resolvedCategory,
        product_subcategory: resolvedSubcategory,
        category: resolvedCategory,
        subcategory: resolvedSubcategory,
        product_title: title,
        name: title,
        product_code: rawCode,
        hsn_code: String(p.hsn_code || "00"),
        product_type: String(p.product_type || "diamond"),
        product_slug: slug,
        slug: slug,
        description: String(p.description || title),

        // Numbers using safeNum to prevent NaN cast errors
        price: safeNum(p.price || p.basePrice),
        basePrice: safeNum(p.basePrice || p.price),
        discount: safeNum(p.discount),
        stock: safeNum(p.stock),

        // Selectors & Attributes
        gender: String(p.gender || "2"),
        size_id: String(p.size_id || ""),
        banglesize_id: String(p.banglesize_id || "0"),
        karat_id: String(p.karat_id || "1,2"),
        metal_type: String(p.metal_type || "2,3"),
        gallery: parsedGallery,

        // Dimensions & Weights using safeNum
        height: safeNum(p.height),
        width: safeNum(p.width),
        gold_weight: safeNum(p.gold_weight),
        diamond_weight: safeNum(p.diamond_weight),
        diamond_count: safeNum(p.diamond_count && Number(p.diamond_count) > 0 ? p.diamond_count : p.noof_gem),
        solitaires_weight: safeNum(p.solitaires_weight || p.solitaire_weight),
        product_weight: safeNum(p.product_weight),
        noof_gem: safeNum(p.noof_gem),

        // Quality & Flags
        diamond_quality: String(p.diamond_quality || "1,2"),
        solitaires_quality: String(p.solitaires_quality || "0"),
        custom_type: String(p.custom_type || "0"),
        status: String(p.status || "1"),
        feature: String(p.feature || "0"),
        topselling: String(p.topselling || "0"),
        sessional: String(p.sessional || "0"),

        // Meta tags
        meta_title: String(p.meta_title || title),
        meta_keyword: String(p.meta_keyword || title),
        meta_description: String(p.meta_description || title),
        create_date: p.create_date ? new Date(p.create_date) : new Date(),
        modify_date: p.modify_date ? new Date(p.modify_date) : new Date()
      });
    }

    console.log(`ℹ️ Filter Results:`);
    console.log(`   - Skipped (00000 / empty code) : ${skippedCount0000}`);
    console.log(`   - Skipped (Duplicate in DB/file): ${skippedCountDuplicate}`);
    console.log(`   - Valid New Products to Insert : ${validProducts.length}`);

    if (validProducts.length === 0) {
      console.log("⚠️ No new unique products to insert.");
      return;
    }

    // 5. Bulk Insert New Unique Products into Database
    console.log(`🚀 Inserting ${validProducts.length} new unique items into MongoDB...`);
    const insertedResult = await Product.insertMany(validProducts, { ordered: false });

    console.log("================ IMPORT SUMMARY ================");
    console.log(`✅ Total Documents Processed : ${rawProducts.length}`);
    console.log(`🚫 Skipped Invalid Code (00000): ${skippedCount0000}`);
    console.log(`🔄 Skipped Existing Duplicates : ${skippedCountDuplicate}`);
    console.log(`🆕 Successfully Inserted New  : ${insertedResult.length}`);
    console.log("================================================");

  } catch (error) {
    console.error("❌ Error importing products:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
  }
}

// Read CLI parameter if provided
const inputFilePath = process.argv[2];
importProducts(inputFilePath);
