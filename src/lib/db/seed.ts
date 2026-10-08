import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import {
  users,
  categories,
  brands,
  products,
  roles,
  permissions,
  rolePermissions,
  userRoles,
  workerProfiles,
  posTerminals,
  posShifts,
  posSales,
  posSaleItems,
  quotes,
  reviews,
  discounts,
} from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema: schema });

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ── ROLES & PERMISSIONS ──────────────────────────────────────────────
  console.log("  Creating roles...");
  const allPermissions = [
    { key: "products.view", description: "View products", category: "Products" },
    { key: "products.create", description: "Create products", category: "Products" },
    { key: "products.edit", description: "Edit products", category: "Products" },
    { key: "products.delete", description: "Delete products", category: "Products" },
    { key: "categories.view", description: "View categories", category: "Categories" },
    { key: "categories.manage", description: "Manage categories", category: "Categories" },
    { key: "brands.view", description: "View brands", category: "Brands" },
    { key: "brands.manage", description: "Manage brands", category: "Brands" },
    { key: "orders.view", description: "View orders", category: "Orders" },
    { key: "orders.edit", description: "Edit orders", category: "Orders" },
    { key: "orders.refund", description: "Refund orders", category: "Orders" },
    { key: "quotes.view", description: "View quotes", category: "Quotes" },
    { key: "quotes.respond", description: "Respond to quotes", category: "Quotes" },
    { key: "quotes.convert", description: "Convert quotes", category: "Quotes" },
    { key: "inventory.view", description: "View inventory", category: "Inventory" },
    { key: "inventory.adjust", description: "Adjust inventory", category: "Inventory" },
    { key: "customers.view", description: "View customers", category: "Customers" },
    { key: "discounts.view", description: "View discounts", category: "Discounts" },
    { key: "discounts.manage", description: "Manage discounts", category: "Discounts" },
    { key: "reports.view", description: "View reports", category: "Reports" },
    { key: "reports.export", description: "Export reports", category: "Reports" },
    { key: "workers.view", description: "View workers", category: "Workers" },
    { key: "workers.manage", description: "Manage workers", category: "Workers" },
    { key: "roles.view", description: "View roles", category: "Roles" },
    { key: "roles.manage", description: "Manage roles", category: "Roles" },
    { key: "pos.use", description: "Use POS", category: "POS" },
    { key: "pos.shift.open", description: "Open POS shift", category: "POS" },
    { key: "pos.shift.close", description: "Close POS shift", category: "POS" },
    { key: "pos.refund", description: "Process POS refund", category: "POS" },
    { key: "pos.view_all_sales", description: "View all POS sales", category: "POS" },
    { key: "settings.view", description: "View settings", category: "Settings" },
    { key: "settings.edit", description: "Edit settings", category: "Settings" },
  ];

  const insertedPermissions = await db.insert(permissions).values(allPermissions).returning();
  console.log(`  ✅ Created ${insertedPermissions.length} permissions`);

  const permMap = Object.fromEntries(insertedPermissions.map((p) => [p.key, p.id]));

  const roleDefs = [
    { name: "Super Admin", slug: "super_admin", description: "Full system access", isSystem: true },
    { name: "Admin", slug: "admin", description: "All except worker/role management", isSystem: true },
    { name: "Manager", slug: "manager", description: "Products, orders, quotes, POS, reports", isSystem: true },
    { name: "Cashier", slug: "cashier", description: "POS only", isSystem: true },
    { name: "Stock Keeper", slug: "stock_keeper", description: "Products and inventory", isSystem: true },
  ];

  const insertedRoles = await db.insert(roles).values(roleDefs).returning();
  console.log(`  ✅ Created ${insertedRoles.length} roles`);

  const roleMap = Object.fromEntries(insertedRoles.map((r) => [r.slug, r.id]));

  // Super Admin gets all permissions
  const superAdminPerms = insertedPermissions.map((p) => ({
    roleId: roleMap["super_admin"],
    permissionId: p.id,
  }));
  await db.insert(rolePermissions).values(superAdminPerms);

  // ── ADMIN USER ───────────────────────────────────────────────────────
  console.log("  Creating admin user...");
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "admin123";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@noblemangh.com",
      passwordHash: adminHash,
      name: "Nobleman Admin",
      role: "super_admin",
      emailVerified: new Date(),
    })
    .returning();
  console.log(`  ✅ Admin created: ${admin.email}`);

  await db.insert(userRoles).values({ userId: admin.id, roleId: roleMap["super_admin"] });

  // ── WORKER USERS ─────────────────────────────────────────────────────
  console.log("  Creating worker users...");
  const cashierHash = await bcrypt.hash("cashier123", 10);
  const managerHash = await bcrypt.hash("manager123", 10);

  const [cashier] = await db
    .insert(users)
    .values({
      email: "cashier@noblemangh.com",
      passwordHash: cashierHash,
      name: "Kwame Mensah",
      role: "cashier",
      emailVerified: new Date(),
    })
    .returning();

  const [manager] = await db
    .insert(users)
    .values({
      email: "manager@noblemangh.com",
      passwordHash: managerHash,
      name: "Ama Darko",
      role: "manager",
      emailVerified: new Date(),
    })
    .returning();

  await db.insert(userRoles).values([
    { userId: cashier.id, roleId: roleMap["cashier"] },
    { userId: manager.id, roleId: roleMap["manager"] },
  ]);

  const [cashierProfile] = await db
    .insert(workerProfiles)
    .values({
      userId: cashier.id,
      employeeCode: "EMP-001",
      hireDate: new Date("2024-01-15"),
      department: "Sales",
      hourlyRate: "25.00",
      status: "active",
    })
    .returning();

  await db.insert(workerProfiles).values({
    userId: manager.id,
    employeeCode: "EMP-002",
    hireDate: new Date("2023-06-01"),
    department: "Management",
    hourlyRate: "45.00",
    status: "active",
  });

  console.log("  ✅ Workers created: Kwame Mensah (cashier), Ama Darko (manager)");

  // ── CATEGORIES ───────────────────────────────────────────────────────
  console.log("  Creating categories...");
  const categoryDefs = [
    { slug: "guitars", name: "Guitars", description: "Acoustic, electric, and classical guitars", sortOrder: 1 },
    { slug: "basses", name: "Basses", description: "Electric and acoustic bass guitars", sortOrder: 2 },
    { slug: "amps-and-effects", name: "Amps & Effects", description: "Amplifiers and effect pedals", sortOrder: 3 },
    { slug: "drums", name: "Drums", description: "Acoustic, electronic drums and percussion", sortOrder: 4 },
    { slug: "keyboards", name: "Keyboards", description: "Pianos, synthesizers, and MIDI controllers", sortOrder: 5 },
    { slug: "live-sound", name: "Live Sound", description: "PA systems, mixers, microphones for live use", sortOrder: 6 },
    { slug: "recording", name: "Recording", description: "Audio interfaces, monitors, and studio gear", sortOrder: 7 },
  ];

  const insertedCategories = await db.insert(categories).values(categoryDefs).returning();
  const catMap = Object.fromEntries(insertedCategories.map((c) => [c.slug, c.id]));
  console.log(`  ✅ Created ${insertedCategories.length} categories`);

  // ── BRANDS ───────────────────────────────────────────────────────────
  console.log("  Creating brands...");
  const brandDefs = [
    { slug: "fender", name: "Fender", description: "Iconic American guitars and amplifiers" },
    { slug: "gibson", name: "Gibson", description: "Legendary guitars since 1894" },
    { slug: "yamaha", name: "Yamaha", description: "Quality instruments for every level" },
    { slug: "roland", name: "Roland", description: "Electronic instruments and pro audio" },
    { slug: "shure", name: "Shure", description: "Professional microphones and audio" },
    { slug: "zildjian", name: "Zildjian", description: "Premium cymbals since 1623" },
    { slug: "marshall", name: "Marshall", description: "Iconic British amplification" },
    { slug: "akai", name: "AKAI Professional", description: "Professional production gear" },
  ];

  const insertedBrands = await db.insert(brands).values(brandDefs).returning();
  const brandMap = Object.fromEntries(insertedBrands.map((b) => [b.slug, b.id]));
  console.log(`  ✅ Created ${insertedBrands.length} brands`);

  // ── PRODUCTS (36) ────────────────────────────────────────────────────
  console.log("  Creating 36 products...");
  const productDefs = [
    // Guitars (6)
    { slug: "fender-player-stratocaster", name: "Fender Player Stratocaster", price: "4599.99", categoryId: catMap["guitars"], brandId: brandMap["fender"], stock: 12, isFeatured: true, tags: ["electric", "stratocaster", "bestseller"] },
    { slug: "fender-acoustic-fa-115", name: "Fender FA-115 Acoustic", price: "1299.99", categoryId: catMap["guitars"], brandId: brandMap["fender"], stock: 20, tags: ["acoustic", "beginner"] },
    { slug: "gibson-les-paul-standard", name: "Gibson Les Paul Standard '50s", price: "12999.99", categoryId: catMap["guitars"], brandId: brandMap["gibson"], stock: 3, isFeatured: true, tags: ["electric", "les-paul", "premium"] },
    { slug: "yamaha-c40-classical", name: "Yamaha C40 Classical Guitar", price: "699.99", categoryId: catMap["guitars"], brandId: brandMap["yamaha"], stock: 25, tags: ["classical", "beginner"] },
    { slug: "yamaha-fg800-acoustic", name: "Yamaha FG800 Acoustic", price: "1499.99", categoryId: catMap["guitars"], brandId: brandMap["yamaha"], stock: 15, tags: ["acoustic", "bestseller"] },
    { slug: "gibson-sg-standard", name: "Gibson SG Standard '61", price: "8499.99", categoryId: catMap["guitars"], brandId: brandMap["gibson"], stock: 4, tags: ["electric", "sg"] },

    // Basses (4)
    { slug: "fender-player-jazz-bass", name: "Fender Player Jazz Bass", price: "4299.99", categoryId: catMap["basses"], brandId: brandMap["fender"], stock: 8, tags: ["electric", "jazz-bass"] },
    { slug: "yamaha-trbx304", name: "Yamaha TRBX304 Bass", price: "2199.99", categoryId: catMap["basses"], brandId: brandMap["yamaha"], stock: 10, tags: ["electric", "4-string"] },
    { slug: "fender-player-precision-bass", name: "Fender Player Precision Bass", price: "4299.99", categoryId: catMap["basses"], brandId: brandMap["fender"], stock: 6, isFeatured: true, tags: ["electric", "precision"] },
    { slug: "yamaha-trbx174", name: "Yamaha TRBX174 Bass", price: "1099.99", categoryId: catMap["basses"], brandId: brandMap["yamaha"], stock: 18, tags: ["electric", "beginner"] },

    // Amps & Effects (5)
    { slug: "marshall-dsl20cr", name: "Marshall DSL20CR Combo", price: "3499.99", categoryId: catMap["amps-and-effects"], brandId: brandMap["marshall"], stock: 7, tags: ["tube", "combo"] },
    { slug: "fender-blues-junior", name: "Fender Blues Junior IV", price: "3999.99", categoryId: catMap["amps-and-effects"], brandId: brandMap["fender"], stock: 5, isFeatured: true, tags: ["tube", "combo", "bestseller"] },
    { slug: "yamaha-thr10ii", name: "Yamaha THR10II Desktop Amp", price: "1899.99", categoryId: catMap["amps-and-effects"], brandId: brandMap["yamaha"], stock: 12, tags: ["modeling", "desktop"] },
    { slug: "marshall-guvs2", name: "Marshall Guv'ner DS-1 Pedal", price: "549.99", categoryId: catMap["amps-and-effects"], brandId: brandMap["marshall"], stock: 30, tags: ["pedal", "distortion"] },
    { slug: "roland-cube-20", name: "Roland CUBE-20GX", price: "899.99", categoryId: catMap["amps-and-effects"], brandId: brandMap["roland"], stock: 15, tags: ["modeling", "combo"] },

    // Drums (5)
    { slug: "yamaha-stage-custom", name: "Yamaha Stage Custom Birch 5pc", price: "5999.99", categoryId: catMap["drums"], brandId: brandMap["yamaha"], stock: 4, isFeatured: true, tags: ["acoustic", "5-piece"] },
    { slug: "zildjian-a-custom-cymbal-set", name: "Zildjian A Custom Cymbal Set", price: "4299.99", categoryId: catMap["drums"], brandId: brandMap["zildjian"], stock: 6, tags: ["cymbals", "professional"] },
    { slug: "roland-td-17kv", name: "Roland TD-17KV Electronic Kit", price: "7499.99", categoryId: catMap["drums"], brandId: brandMap["roland"], stock: 3, tags: ["electronic", "module"] },
    { slug: "yamaha-ryde-tompad", name: "Yamaha Ryde Tom Pad", price: "349.99", categoryId: catMap["drums"], brandId: brandMap["yamaha"], stock: 20, tags: ["pad", "electronic"] },
    { slug: "zildjian-l80-low-volume", name: "Zildjian L80 Low Volume Set", price: "1299.99", categoryId: catMap["drums"], brandId: brandMap["zildjian"], stock: 10, tags: ["cymbals", "practice"] },

    // Keyboards (5)
    { slug: "yamaha-p-125", name: "Yamaha P-125 Digital Piano", price: "3299.99", categoryId: catMap["keyboards"], brandId: brandMap["yamaha"], stock: 8, tags: ["digital-piano", "88-key"] },
    { slug: "roland-fp-30x", name: "Roland FP-30X Digital Piano", price: "3799.99", categoryId: catMap["keyboards"], brandId: brandMap["roland"], stock: 6, isFeatured: true, tags: ["digital-piano", "88-key", "bestseller"] },
    { slug: "akai-mpk-mini-mk3", name: "AKAI MPK mini mk3", price: "699.99", categoryId: catMap["keyboards"], brandId: brandMap["akai"], stock: 20, tags: ["midi", "controller"] },
    { slug: "yamaha-psr-e373", name: "Yamaha PSR-E373 Keyboard", price: "1299.99", categoryId: catMap["keyboards"], brandId: brandMap["yamaha"], stock: 15, tags: ["arranger", "beginner"] },
    { slug: "roland-juno-ds61", name: "Roland JUNO-DS61 Synthesizer", price: "4499.99", categoryId: catMap["keyboards"], brandId: brandMap["roland"], stock: 4, tags: ["synthesizer", "61-key"] },

    // Live Sound (5)
    { slug: "shure-sm58", name: "Shure SM58 Vocal Microphone", price: "549.99", categoryId: catMap["live-sound"], brandId: brandMap["shure"], stock: 40, tags: ["microphone", "dynamic", "bestseller"] },
    { slug: "shure-sm57", name: "Shure SM57 Instrument Mic", price: "549.99", categoryId: catMap["live-sound"], brandId: brandMap["shure"], stock: 35, tags: ["microphone", "dynamic", "instrument"] },
    { slug: "yamaha-stagepas-400i", name: "Yamaha STAGEPAS 400i", price: "5999.99", categoryId: catMap["live-sound"], brandId: brandMap["yamaha"], stock: 3, tags: ["pa-system", "portable"] },
    { slug: "roland-cube-street-ex", name: "Roland CUBE Street EX", price: "3299.99", categoryId: catMap["live-sound"], brandId: brandMap["roland"], stock: 5, tags: ["battery", "portable"] },
    { slug: "shure-svx88", name: "Shure SVX88 Wireless Dual", price: "3999.99", categoryId: catMap["live-sound"], brandId: brandMap["shure"], stock: 4, tags: ["wireless", "dual"] },

    // Recording (6)
    { slug: "roland-rubix22", name: "Roland Rubix22 Audio Interface", price: "899.99", categoryId: catMap["recording"], brandId: brandMap["roland"], stock: 12, tags: ["interface", "2-input"] },
    { slug: "yamaha-hs5-monitor", name: "Yamaha HS5 Studio Monitor", price: "1099.99", categoryId: catMap["recording"], brandId: brandMap["yamaha"], stock: 16, tags: ["monitor", "studio"] },
    { slug: "shure-sm7b", name: "Shure SM7B Microphone", price: "2199.99", categoryId: catMap["recording"], brandId: brandMap["shure"], stock: 8, isFeatured: true, tags: ["microphone", "condenser", "bestseller"] },
    { slug: "akai-force", name: "AKAI Force Standalone Production", price: "4999.99", categoryId: catMap["recording"], brandId: brandMap["akai"], stock: 3, tags: ["production", "standalone"] },
    { slug: "yamaha-ag03-mk2", name: "Yamaha AG03-MK2 Mixer", price: "1299.99", categoryId: catMap["recording"], brandId: brandMap["yamaha"], stock: 10, tags: ["mixer", "streaming"] },
    { slug: "roland-quad-capture", name: "Roland QUAD-CAPTURE", price: "1899.99", categoryId: catMap["recording"], brandId: brandMap["roland"], stock: 6, tags: ["interface", "4-input"] },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(
      productDefs.map((p) => ({
        ...p,
        description: `The ${p.name} — premium quality from ${insertedBrands.find((b) => b.id === p.brandId)?.name ?? "Nobleman"}.`,
        images: [],
        specs: {},
      }))
    )
    .returning();
  console.log(`  ✅ Created ${insertedProducts.length} products`);

  // ── POS TERMINAL & SHIFTS ────────────────────────────────────────────
  console.log("  Creating POS data...");
  const [terminal] = await db
    .insert(posTerminals)
    .values({ name: "Main Store Terminal", location: "Accra Main Store", assignedWorkerId: cashierProfile.id })
    .returning();

  const [openShift] = await db
    .insert(posShifts)
    .values({
      terminalId: terminal.id,
      openedByUserId: cashier.id,
      openingCash: "500.00",
      status: "open",
    })
    .returning();

  const [closedShift] = await db
    .insert(posShifts)
    .values({
      terminalId: terminal.id,
      openedByUserId: cashier.id,
      openingCash: "500.00",
      closingCash: "2350.00",
      expectedCash: "2340.00",
      actualCash: "2350.00",
      discrepancy: "10.00",
      status: "closed",
      closedAt: new Date(),
    })
    .returning();

  // 5 sample POS sales
  const saleProducts = insertedProducts.slice(0, 5);
  for (let i = 0; i < 5; i++) {
    const p = saleProducts[i];
    const qty = i + 1;
    const subtotal = (parseFloat(p.price) * qty).toFixed(2);
    const [sale] = await db
      .insert(posSales)
      .values({
        shiftId: closedShift.id,
        terminalId: terminal.id,
        cashierUserId: cashier.id,
        customerName: i % 2 === 0 ? "Walk-in Customer" : "Pastor Mensah",
        customerPhone: i % 2 === 0 ? undefined : "+233 20 123 4567",
        subtotal,
        total: subtotal,
        paymentMethod: i % 3 === 0 ? "cash" : i % 3 === 1 ? "momo" : "card",
        receiptNumber: `RCT-${String(1001 + i).padStart(6, "0")}`,
        createdAt: new Date(Date.now() - (5 - i) * 3600000),
      })
      .returning();

    await db.insert(posSaleItems).values({
      saleId: sale.id,
      productId: p.id,
      name: p.name,
      unitPrice: p.price,
      quantity: qty,
      lineTotal: subtotal,
    });
  }
  console.log("  ✅ Created POS terminal, 2 shifts, 5 sales");

  // ── QUOTES ───────────────────────────────────────────────────────────
  console.log("  Creating quotes...");
  await db.insert(quotes).values([
    {
      orgName: "Grace Chapel International",
      orgType: "church",
      contactName: "Pastor John Addo",
      email: "pastor@gracechapel.org",
      phone: "+233 24 567 8901",
      items: [{ productId: insertedProducts[0].id, name: insertedProducts[0].name, quantity: 3 }],
      message: "Need 3 guitars for our worship team.",
      status: "pending",
    },
    {
      orgName: "Joy FM Ghana",
      orgType: "radio",
      contactName: "Akua Boateng",
      email: "akua@joyfm.com",
      phone: "+233 30 223 4567",
      items: [{ productId: insertedProducts[36].id, name: insertedProducts[36].name, quantity: 2 }],
      message: "Looking for studio microphones.",
      status: "responded",
      quotedAmount: "4399.98",
    },
    {
      orgName: "Accra Academy",
      orgType: "school",
      contactName: "Mr. Kwesi Appiah",
      email: "kwesi@accraacademy.edu",
      items: [{ productId: insertedProducts[25].id, name: insertedProducts[25].name, quantity: 10 }],
      message: "Music department needs keyboards for students.",
      status: "won",
      quotedAmount: "12999.90",
    },
  ]);
  console.log("  ✅ Created 3 quotes");

  // ── REVIEWS ──────────────────────────────────────────────────────────
  console.log("  Creating reviews...");
  const reviewData = Array.from({ length: 15 }, (_, i) => ({
    productId: insertedProducts[i % insertedProducts.length].id,
    userId: admin.id,
    rating: 3 + (i % 3),
    title: `Review #${i + 1}`,
    body: `This is a great product. ${i % 2 === 0 ? "Highly recommended!" : "Good value for money."}`,
    isVerified: i % 3 !== 0,
  }));
  await db.insert(reviews).values(reviewData);
  console.log("  ✅ Created 15 reviews");

  // ── DISCOUNTS ────────────────────────────────────────────────────────
  console.log("  Creating discounts...");
  await db.insert(discounts).values([
    { code: "WELCOME10", type: "percentage", value: "10.00", minOrder: "200.00", usageLimit: 100, isActive: true },
    { code: "GHANA20", type: "percentage", value: "20.00", minOrder: "500.00", usageLimit: 50, isActive: true, startsAt: new Date(), endsAt: new Date(Date.now() + 30 * 86400000) },
    { code: "FLAT50", type: "fixed", value: "50.00", minOrder: "300.00", usageLimit: 200, isActive: true },
    { code: "STUDIO15", type: "percentage", value: "15.00", minOrder: "1000.00", usageLimit: 25, isActive: true },
    { code: "EXPIRED", type: "percentage", value: "10.00", isActive: false, endsAt: new Date(Date.now() - 86400000) },
  ]);
  console.log("  ✅ Created 5 discount codes");

  console.log("\n🎉 Seeding complete!");
  console.log("\n📋 Login credentials:");
  console.log(`   Admin:   admin@noblemangh.com / ${adminPassword}`);
  console.log("   Cashier: cashier@noblemangh.com / cashier123");
  console.log("   Manager: manager@noblemangh.com / manager123");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
