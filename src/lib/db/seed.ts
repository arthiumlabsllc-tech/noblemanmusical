import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

/* ═══════════════════════════════════════════════════════════
   Helper
   ═══════════════════════════════════════════════════════════ */

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Price in GHS → pesewas (integer) */
function GHS(amount: number): number {
  return Math.round(amount * 100);
}

/* ═══════════════════════════════════════════════════════════
   Seed data
   ═══════════════════════════════════════════════════════════ */

const categoriesData = [
  { name: "Guitars", description: "Acoustic, electric, classical, and bass guitars for every level.", sortOrder: 1 },
  { name: "Keyboards & Pianos", description: "Digital pianos, synthesizers, and arranger keyboards.", sortOrder: 2 },
  { name: "Drums & Percussion", description: "Acoustic kits, electronic drums, and hand percussion.", sortOrder: 3 },
  { name: "PA Systems & Live Sound", description: "Mixers, speakers, microphones, and live sound equipment.", sortOrder: 4 },
  { name: "Studio & Recording", description: "Audio interfaces, monitors, and recording essentials.", sortOrder: 5 },
  { name: "Traditional Ghanaian Instruments", description: "Djembe, kora, talking drum, atenteben, and more.", sortOrder: 6 },
  { name: "Accessories", description: "Stands, cables, strings, sticks, cases, and more.", sortOrder: 7 },
];

const brandsData = [
  { name: "Yamaha", description: "World-renowned Japanese manufacturer of musical instruments and electronics." },
  { name: "Roland", description: "Pioneer in electronic musical instruments since 1972." },
  { name: "Fender", description: "Iconic American guitar and amplifier manufacturer." },
  { name: "Shure", description: "Leading manufacturer of microphones and audio electronics." },
  { name: "Korg", description: "Japanese manufacturer of electronic keyboards, tuners, and pedals." },
  { name: "Pearl", description: "Premier Japanese drum and percussion manufacturer since 1946." },
  { name: "Behringer", description: "Professional audio equipment manufacturer — mixers, interfaces, and more." },
  { name: "Local Artisan", description: "Handcrafted traditional instruments by Ghanaian master artisans." },
];

interface SeedProduct {
  name: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  brand: string;
  stock: number;
  tags: string[];
  isFeatured: boolean;
  specs: Record<string, string>;
}

const productsData: SeedProduct[] = [
  // ── Guitars ──
  {
    name: "Yamaha F310 Acoustic Guitar",
    description: "Entry-level acoustic with spruce top and mahogany back — perfect for beginners.",
    longDescription: "The Yamaha F310 is the ideal first acoustic guitar. Featuring a spruce top for bright, clear tone and meranti back and sides for warmth, this dreadnought delivers impressive sound at an accessible price. Rosewood fingerboard and bridge ensure smooth playability.",
    price: GHS(1850),
    category: "Guitars",
    brand: "Yamaha",
    stock: 25,
    tags: ["acoustic", "beginner", "dreadnought"],
    isFeatured: true,
    specs: { "Top": "Spruce", "Back & Sides": "Meranti", "Neck": "Nato", "Fingerboard": "Rosewood", "Body": "Dreadnought" },
  },
  {
    name: "Yamaha C40 Classical Guitar",
    description: "Full-size nylon-string classical guitar with natural finish.",
    longDescription: "The Yamaha C40 is a full-size classical guitar offering excellent tone and playability. Nylon strings are gentle on fingers, making it ideal for students and classical music enthusiasts.",
    price: GHS(1450),
    category: "Guitars",
    brand: "Yamaha",
    stock: 18,
    tags: ["classical", "nylon", "student"],
    isFeatured: false,
    specs: { "Top": "Spruce", "Back & Sides": "Meranti", "Neck": "Nato", "Strings": "Nylon", "Body": "Classical" },
  },
  {
    name: "Fender Player Stratocaster",
    description: "Iconic electric guitar with three single-coil pickups and maple neck.",
    longDescription: "The Fender Player Stratocaster delivers the legendary tone that shaped rock and roll. Three Player Series Alnico 5 Strat single-coil pickups provide crystal-clear highs and punchy mids. The modern C-shaped maple neck offers comfortable playability for any style.",
    price: GHS(8500),
    compareAtPrice: GHS(9200),
    category: "Guitars",
    brand: "Fender",
    stock: 8,
    tags: ["electric", "stratocaster", "professional"],
    isFeatured: true,
    specs: { "Body": "Alder", "Neck": "Maple", "Pickups": "3x Single-Coil", "Frets": "22 Medium Jumbo", "Bridge": "2-Point Tremolo" },
  },
  {
    name: "Fender CD-60S Acoustic Guitar",
    description: "Affordable dreadnought with solid spruce top for rich, full tone.",
    longDescription: "The Fender CD-60S is an excellent acoustic guitar for players of all levels. A solid spruce top provides rich, full tone that improves with age, while the easy-to-play neck features rolled fingerboard edges for comfortable chording.",
    price: GHS(2200),
    category: "Guitars",
    brand: "Fender",
    stock: 15,
    tags: ["acoustic", "dreadnought", "solid-top"],
    isFeatured: false,
    specs: { "Top": "Solid Spruce", "Back & Sides": "Mahogany", "Neck": "Mahogany", "Fingerboard": "Rosewood", "Body": "Dreadnought" },
  },
  // ── Keyboards & Pianos ──
  {
    name: "Roland FP-30X Digital Piano",
    description: "88-key weighted digital piano with SuperNATURAL Piano sound engine.",
    longDescription: "The Roland FP-30X combines premium piano sound with portable convenience. The PHA-4 Standard keyboard provides authentic grand piano touch, while SuperNATURAL Piano modeling delivers expressive, dynamic tone. Bluetooth audio and MIDI connectivity make it perfect for practice and performance.",
    price: GHS(6900),
    category: "Keyboards & Pianos",
    brand: "Roland",
    stock: 10,
    tags: ["digital-piano", "88-key", "weighted"],
    isFeatured: true,
    specs: { "Keys": "88 PHA-4 Standard", "Sound Engine": "SuperNATURAL Piano", "Polyphony": "256 notes", "Speakers": "2x 11W", "Connectivity": "USB, Bluetooth, Headphone" },
  },
  {
    name: "Yamaha PSR-E373 Keyboard",
    description: "61-key touch-sensitive portable keyboard with 622 voices.",
    longDescription: "The Yamaha PSR-E373 features 622 high-quality voices, 205 auto-accompaniment styles, and touch-sensitive keys. Built-in lessons and a duo mode make it perfect for learning. USB-to-Host connectivity allows easy integration with music software.",
    price: GHS(2100),
    category: "Keyboards & Pianos",
    brand: "Yamaha",
    stock: 20,
    tags: ["keyboard", "61-key", "portable", "beginner"],
    isFeatured: false,
    specs: { "Keys": "61 Touch-Sensitive", "Voices": "622", "Styles": "205", "Polyphony": "48 notes", "Connectivity": "USB-to-Host, Aux In" },
  },
  {
    name: "Korg EK-50 Arranger Keyboard",
    description: "Professional arranger keyboard with 690 sounds and real-time controls.",
    longDescription: "The Korg EK-50 is a powerful arranger keyboard designed for live performance. With 690 sounds, 280 rhythm patterns, and intuitive real-time controls, it's the perfect companion for church musicians and performing artists across Ghana.",
    price: GHS(4500),
    category: "Keyboards & Pianos",
    brand: "Korg",
    stock: 7,
    tags: ["arranger", "keyboard", "live-performance"],
    isFeatured: true,
    specs: { "Keys": "61 Velocity-Sensitive", "Sounds": "690", "Rhythms": "280", "Effects": "Reverb, Chorus, EQ", "Speakers": "2x 10W" },
  },
  {
    name: "Roland GO:KEYS Music Creation Keyboard",
    description: "Compact, battery-powered keyboard with loop-based composition.",
    longDescription: "The Roland GO:KEYS makes music creation fun and intuitive. Simply press a key to start a loop, then layer sounds on top. Battery-powered and portable, it's perfect for beginners and on-the-go musicians.",
    price: GHS(3200),
    category: "Keyboards & Pianos",
    brand: "Roland",
    stock: 12,
    tags: ["keyboard", "portable", "battery-powered", "beginner"],
    isFeatured: false,
    specs: { "Keys": "61", "Sounds": "500+", "Power": "AA Batteries or USB", "Speakers": "Built-in", "Bluetooth": "Audio, MIDI" },
  },
  // ── Drums & Percussion ──
  {
    name: "Pearl Roadshow 5-Piece Drum Kit",
    description: "Complete acoustic drum kit with hardware, cymbals, and throne.",
    longDescription: "The Pearl Roadshow is the most complete, out-of-the-box drum kit available. Poplar shells deliver warm, resonant tone, while the included 830 hardware, 101 cymbals, and throne mean everything you need is in one box. Perfect for the aspiring drummer.",
    price: GHS(5400),
    category: "Drums & Percussion",
    brand: "Pearl",
    stock: 6,
    tags: ["acoustic", "drum-kit", "complete-set"],
    isFeatured: true,
    specs: { "Shells": "9-ply Poplar", "Config": "22\" Kick, 10\" Tom, 12\" Tom, 16\" Floor Tom, 14\" Snare", "Hardware": "830 Series", "Cymbals": "101 Brass", "Finish": "Multiple available" },
  },
  {
    name: "Roland TD-07KV Electronic Drum Kit",
    description: "Mid-range e-drums with mesh heads and Bluetooth audio.",
    longDescription: "The Roland TD-07KV delivers authentic drumming feel with all-mesh head pads and natural acoustic tone. The TD-07 sound module offers 143 sounds, built-in coaching functions, and Bluetooth audio for playing along with your favorite tracks.",
    price: GHS(9800),
    compareAtPrice: GHS(10500),
    category: "Drums & Percussion",
    brand: "Roland",
    stock: 4,
    tags: ["electronic", "drum-kit", "mesh-heads", "quiet-practice"],
    isFeatured: true,
    specs: { "Pads": "All Mesh Head", "Sounds": "143", "Presets": "25 Kit", "Bluetooth": "Audio", "Outputs": "Phones, Master Out" },
  },
  {
    name: "Pearl Export 5-Piece Drum Kit",
    description: "Professional-grade poplar/mahogany shells with superior hardware.",
    longDescription: "The Pearl Export series has been the best-selling entry-level kit for decades. Poplar/mahogany shells deliver a warm, full-bodied tone with excellent projection. The included 830 hardware is rock-solid, and the kit sounds great in any genre.",
    price: GHS(7200),
    category: "Drums & Percussion",
    brand: "Pearl",
    stock: 5,
    tags: ["acoustic", "drum-kit", "professional"],
    isFeatured: false,
    specs: { "Shells": "Poplar/Mahogany", "Config": "22\" Kick, 10\" Tom, 12\" Tom, 16\" Floor Tom, 14\" Snare", "Hardware": "830 Double-Braced", "Heads": "Remo UT" },
  },
  // ── PA Systems & Live Sound ──
  {
    name: "Shure SM58 Dynamic Microphone",
    description: "Industry-standard vocal microphone with cardioid pattern.",
    longDescription: "The Shure SM58 is the world's most popular live vocal microphone. Its tailored frequency response emphasizes vocals while the cardioid pattern rejects background noise. Built like a tank with a pneumatic shock-mount system and steel mesh grille.",
    price: GHS(1200),
    category: "PA Systems & Live Sound",
    brand: "Shure",
    stock: 30,
    tags: ["microphone", "dynamic", "vocal", "live"],
    isFeatured: true,
    specs: { "Type": "Dynamic", "Pattern": "Cardioid", "Frequency": "50Hz–15kHz", "Impedance": "150 Ohm", "Connector": "XLR" },
  },
  {
    name: "Behringer X32 Digital Mixer",
    description: "40-channel digital mixing console with 32 mic preamps.",
    longDescription: "The Behringer X32 is the industry-standard digital mixer for churches, venues, and studios. 32 Midas-designed mic preamps, 25 mix buses, built-in effects, and an intuitive interface make it the go-to choice for serious sound engineers.",
    price: GHS(12000),
    category: "PA Systems & Live Sound",
    brand: "Behringer",
    stock: 3,
    tags: ["mixer", "digital", "live-sound", "church"],
    isFeatured: true,
    specs: { "Channels": "40", "Mic Preamps": "32 Midas", "Mix Buses": "25", "Effects": "8 Stereo Engines", "Recording": "USB Interface" },
  },
  {
    name: "Shure SM57 Instrument Microphone",
    description: "Classic instrument mic — perfect for snare, guitar cabs, and brass.",
    longDescription: "The Shure SM57 is the legendary instrument microphone. Its contoured frequency response and tight cardioid pattern make it ideal for snare drums, guitar amplifiers, and brass instruments. A studio and stage essential.",
    price: GHS(1100),
    category: "PA Systems & Live Sound",
    brand: "Shure",
    stock: 25,
    tags: ["microphone", "dynamic", "instrument"],
    isFeatured: false,
    specs: { "Type": "Dynamic", "Pattern": "Cardioid", "Frequency": "40Hz–15kHz", "Impedance": "150 Ohm", "Connector": "XLR" },
  },
  {
    name: "Behringer Eurolive B215D Active Speaker",
    description: "15-inch 550W powered PA speaker with built-in mixer.",
    longDescription: "The Behringer B215D delivers massive sound in a lightweight package. 550 watts of Class-D power, a 15\" long-excursion driver, and built-in 2-channel mixer make it perfect for churches, events, and mobile DJs.",
    price: GHS(3800),
    category: "PA Systems & Live Sound",
    brand: "Behringer",
    stock: 10,
    tags: ["speaker", "powered", "PA", "live-sound"],
    isFeatured: false,
    specs: { "Power": "550W Class-D", "Woofer": "15\"", "Tweeter": "1.75\"", "SPL": "127 dB", "Weight": "14.5 kg" },
  },
  // ── Studio & Recording ──
  {
    name: "Behringer U-Phoria UM2 Audio Interface",
    description: "2x2 USB audio interface with XENIX preamp — perfect for home recording.",
    longDescription: "The Behringer U-Phoria UM2 is an ultra-affordable 2x2 USB audio interface. One XENIX mic preamp with 48V phantom power, one instrument input, and direct monitoring make it ideal for singer-songwriters and podcasters.",
    price: GHS(650),
    category: "Studio & Recording",
    brand: "Behringer",
    stock: 20,
    tags: ["audio-interface", "USB", "home-recording", "beginner"],
    isFeatured: false,
    specs: { "Inputs": "1x XLR, 1x Instrument", "Outputs": "2x TRS, Headphone", "Sample Rate": "48 kHz", "Bit Depth": "16-bit", "Phantom Power": "48V" },
  },
  {
    name: "Behringer U-Phoria UMC204HD Audio Interface",
    description: "4x4 USB audio interface with 2 MIDAS preamps and 24-bit/192kHz.",
    longDescription: "The UMC204HD delivers professional recording quality with 2 MIDAS mic preamps, 24-bit/192kHz conversion, and zero-latency monitoring. Perfect for project studios and mobile recording setups.",
    price: GHS(1800),
    category: "Studio & Recording",
    brand: "Behringer",
    stock: 12,
    tags: ["audio-interface", "USB", "studio", "MIDAS"],
    isFeatured: true,
    specs: { "Inputs": "2x XLR/TRS Combo, 2x Instrument", "Outputs": "4x TRS, Headphone", "Sample Rate": "192 kHz", "Bit Depth": "24-bit", "Preamps": "2x MIDAS" },
  },
  {
    name: "Roland CUBE-10GX Guitar Amplifier",
    description: "Compact 10W practice amp with COSM modeling and 3 amp types.",
    longDescription: "The Roland CUBE-10GX is a compact practice amplifier with three COSM amp types (Clean, Crunch, Lead) and built-in effects. Its 8-inch speaker delivers surprisingly full tone for its size. Perfect for home practice.",
    price: GHS(1600),
    category: "Studio & Recording",
    brand: "Roland",
    stock: 14,
    tags: ["amplifier", "guitar", "practice", "compact"],
    isFeatured: false,
    specs: { "Power": "10W", "Speaker": "8\"", "Channels": "3 COSM Types", "Effects": "Chorus, Delay, Reverb", "Input": "1/4\" + Aux In" },
  },
  // ── Traditional Ghanaian Instruments ──
  {
    name: "Handmade Djembe with Kente Rope",
    description: "Traditional hand-carved djembe from Ghana with authentic Kente rope tuning.",
    longDescription: "This authentic handmade djembe is carved from a single piece of African hardwood by master artisans in Ghana. The goatskin head produces deep bass tones and crisp slaps. Traditional Kente rope tuning system allows precise head adjustment. Each piece is unique.",
    price: GHS(950),
    category: "Traditional Ghanaian Instruments",
    brand: "Local Artisan",
    stock: 15,
    tags: ["djembe", "handmade", "traditional", "kente"],
    isFeatured: true,
    specs: { "Material": "African Hardwood", "Head": "Goatskin", "Tuning": "Kente Rope", "Height": "60-65 cm", "Origin": "Ghana" },
  },
  {
    name: "Kora (21-String)",
    description: "Traditional 21-string West African harp-lute with calabash resonator.",
    longDescription: "The kora is one of West Africa's most beautiful instruments. This 21-string kora features a large calabash resonator covered with cowhide, a hardwood neck, and nylon strings (traditional gut strings replaced with durable nylon). Handcrafted by master artisans.",
    price: GHS(3800),
    category: "Traditional Ghanaian Instruments",
    brand: "Local Artisan",
    stock: 4,
    tags: ["kora", "traditional", "handmade", "west-african"],
    isFeatured: true,
    specs: { "Strings": "21", "Resonator": "Calabash", "Covering": "Cowhide", "Neck": "Hardwood", "Origin": "Ghana" },
  },
  {
    name: "Talking Drum (Dondo)",
    description: "Traditional Ghanaian hourglass-shaped pressure drum.",
    longDescription: "The talking drum is one of Ghana's most iconic instruments. By squeezing the tension cords, the player can change the pitch to mimic the tonal patterns of speech. This handcrafted dondo features a carved wooden shell and leather tension cords.",
    price: GHS(650),
    category: "Traditional Ghanaian Instruments",
    brand: "Local Artisan",
    stock: 10,
    tags: ["talking-drum", "dondo", "traditional", "handmade"],
    isFeatured: false,
    specs: { "Shape": "Hourglass", "Shell": "Carved Wood", "Head": "Goatskin", "Cords": "Leather", "Origin": "Ghana" },
  },
  {
    name: "Atenteben (Bamboo Flute)",
    description: "Traditional Ghanaian bamboo flute — diatonic scale, key of C.",
    longDescription: "The atenteben is a vertical bamboo flute from Ghana, traditionally played in folk music and ceremonies. This handcrafted instrument is tuned to the diatonic scale in the key of C, making it accessible for musicians of all backgrounds.",
    price: GHS(180),
    category: "Traditional Ghanaian Instruments",
    brand: "Local Artisan",
    stock: 25,
    tags: ["atenteben", "flute", "bamboo", "traditional"],
    isFeatured: false,
    specs: { "Material": "Bamboo", "Scale": "Diatonic", "Key": "C", "Length": "45 cm", "Origin": "Ghana" },
  },
  {
    name: "Fontomfrom (Talking Drum Ensemble)",
    description: "Large ceremonial drum set — includes 2 drums and curved sticks.",
    longDescription: "The fontomfrom is a prestigious ceremonial drum ensemble from the Ashanti region. This set includes two drums of different sizes, curved sticks, and a shoulder strap. Used in traditional festivals and royal ceremonies.",
    price: GHS(2400),
    category: "Traditional Ghanaian Instruments",
    brand: "Local Artisan",
    stock: 3,
    tags: ["fontomfrom", "ceremonial", "traditional", "ashanti"],
    isFeatured: false,
    specs: { "Drums": "2 (large + small)", "Sticks": "Curved pair", "Shell": "Carved Hardwood", "Head": "Antelope Skin", "Origin": "Ghana" },
  },
  // ── Accessories ──
  {
    name: "Guitar Stand — Folding A-Frame",
    description: "Lightweight folding guitar stand with foam padding.",
    longDescription: "Keep your guitar safe and accessible with this sturdy folding A-frame stand. Foam-padded arms protect your instrument's finish, and the lightweight design makes it easy to transport.",
    price: GHS(120),
    category: "Accessories",
    brand: "Yamaha",
    stock: 50,
    tags: ["stand", "guitar", "folding"],
    isFeatured: false,
    specs: { "Type": "A-Frame", "Material": "Steel", "Padding": "Foam", "Weight": "0.5 kg", "Fits": "Acoustic, Electric, Classical" },
  },
  {
    name: "XLR Cable — 5 Metre",
    description: "Professional balanced XLR microphone cable, 5m.",
    longDescription: "High-quality balanced XLR cable with oxygen-free copper conductors and braided shield for noise-free signal transmission. Durable metal connectors with strain relief.",
    price: GHS(85),
    category: "Accessories",
    brand: "Shure",
    stock: 100,
    tags: ["cable", "XLR", "microphone"],
    isFeatured: false,
    specs: { "Length": "5 m", "Connectors": "XLR Male to Female", "Conductor": "Oxygen-Free Copper", "Shield": "Braided", "Impedance": "Low Impedance" },
  },
  {
    name: "Drum Stick — 5A Hickory (Pair)",
    description: "Classic 5A hickory drum sticks — balanced weight and feel.",
    longDescription: "The most popular drum stick size worldwide. 5A hickory sticks offer a balanced weight and tear-drop bead for versatile playing across genres. Sold as a matched pair.",
    price: GHS(65),
    category: "Accessories",
    brand: "Pearl",
    stock: 80,
    tags: ["drum-sticks", "5A", "hickory"],
    isFeatured: false,
    specs: { "Size": "5A", "Material": "Hickory", "Length": "16\"", "Diameter": "0.565\"", "Tip": "Wood Teardrop" },
  },
  {
    name: "Guitar Strings — Acoustic Light Gauge",
    description: "Phosphor bronze acoustic guitar strings, .012–.053.",
    longDescription: "Premium phosphor bronze acoustic guitar strings for warm, rich tone with extended life. Light gauge (.012–.053) for comfortable bending and strumming.",
    price: GHS(55),
    category: "Accessories",
    brand: "Yamaha",
    stock: 60,
    tags: ["strings", "acoustic", "phosphor-bronze"],
    isFeatured: false,
    specs: { "Gauge": ".012–.053", "Material": "Phosphor Bronze", "Winding": "Round Wound", "Ball End": "Yes", "Set": "6 strings" },
  },
  {
    name: "Keyboard Stand — X-Frame",
    description: "Adjustable X-frame keyboard stand — holds up to 30 kg.",
    longDescription: "Sturdy X-frame keyboard stand with adjustable height and non-slip rubber end caps. Supports keyboards up to 30 kg. Folds flat for easy transport.",
    price: GHS(250),
    category: "Accessories",
    brand: "Yamaha",
    stock: 20,
    tags: ["stand", "keyboard", "X-frame"],
    isFeatured: false,
    specs: { "Type": "X-Frame", "Material": "Steel", "Max Weight": "30 kg", "Height": "Adjustable", "Folding": "Yes" },
  },
];

/* ═══════════════════════════════════════════════════════════
   Reviews data
   ═══════════════════════════════════════════════════════════ */

const reviewsData = [
  { product: "Yamaha F310 Acoustic Guitar", rating: 5, title: "Best guitar to start with!", body: "I bought this for my son and he loves it. Great sound for the price. The action is comfortable and it stays in tune well.", verified: true },
  { product: "Roland FP-30X Digital Piano", rating: 5, title: "Feels like a real piano", body: "The weighted keys are incredible at this price point. We use it for our church services and it sounds amazing through the PA system.", verified: true },
  { product: "Fender Player Stratocaster", rating: 5, title: "Dream guitar", body: "I've been playing for 15 years and this Strat is everything I wanted. The tone is classic Fender — bright, punchy, and versatile.", verified: true },
  { product: "Shure SM58 Dynamic Microphone", rating: 5, title: "Indestructible workhorse", body: "We've dropped this mic countless times at our church and it still works perfectly. The gold standard for live vocals.", verified: true },
  { product: "Pearl Roadshow 5-Piece Drum Kit", rating: 4, title: "Great starter kit", body: "My daughter started drumming with this kit and she's been hooked. Everything you need in one box. Cymbals could be better but great value.", verified: true },
  { product: "Handmade Djembe with Kente Rope", rating: 5, title: "Authentic and beautiful", body: "The craftsmanship is outstanding. Deep bass, crisp slap tones. The Kente rope tuning is a beautiful touch. Everyone at our events asks about it.", verified: true },
  { product: "Behringer X32 Digital Mixer", rating: 5, title: "Game changer for our church", body: "We upgraded from an analog board and the difference is night and day. The sound quality is incredible and the scene memory saves us so much time.", verified: true },
  { product: "Kora (21-String)", rating: 5, title: "Stunning instrument", body: "I ordered this for a world music project and it exceeded all expectations. The tone is ethereal and the craftsmanship is impeccable.", verified: true },
  { product: "Yamaha PSR-E373 Keyboard", rating: 4, title: "Perfect for learning", body: "The built-in lessons are great for my students. Touch-sensitive keys respond well and the 622 voices keep things interesting.", verified: true },
  { product: "Roland TD-07KV Electronic Drum Kit", rating: 5, title: "Silent practice is a game changer", body: "Living in an apartment, being able to practice with headphones is incredible. The mesh heads feel natural and the sounds are realistic.", verified: true },
  { product: "Talking Drum (Dondo)", rating: 5, title: "It really talks!", body: "Bought this for our cultural dance group. The pitch variation is amazing — you can truly mimic speech patterns. Master artisan work.", verified: true },
  { product: "Behringer U-Phoria UMC204HD Audio Interface", rating: 4, title: "Great value interface", body: "The MIDAS preamps sound clean and the 24-bit/192kHz quality is noticeable. Perfect for our small home studio setup.", verified: true },
  { product: "Atenteben (Bamboo Flute)", rating: 4, title: "Beautiful tone", body: "Such a simple yet beautiful instrument. The bamboo gives it a warm, organic tone. Great for traditional and contemporary music.", verified: true },
  { product: "Korg EK-50 Arranger Keyboard", rating: 5, title: "Perfect for church", body: "The rhythms and auto-accompaniment are fantastic for our worship team. Easy to use during live services and the sound quality is top-notch.", verified: true },
  { product: "Fender CD-60S Acoustic Guitar", rating: 4, title: "Solid top makes a difference", body: "Upgraded from a laminate top and the tone improvement is significant. The solid spruce top resonates beautifully. Great guitar for the price.", verified: true },
];

/* ═══════════════════════════════════════════════════════════
   Discount codes
   ═══════════════════════════════════════════════════════════ */

const discountsData = [
  { code: "WELCOME10", type: "percent" as const, value: 10, minOrder: GHS(200), usageLimit: 500, startsAt: new Date("2025-01-01"), endsAt: new Date("2027-12-31") },
  { code: "CHURCH15", type: "percent" as const, value: 15, minOrder: GHS(1000), usageLimit: 100, startsAt: new Date("2025-01-01"), endsAt: new Date("2027-12-31") },
  { code: "SCHOOL20", type: "percent" as const, value: 20, minOrder: GHS(500), usageLimit: 50, startsAt: new Date("2025-01-01"), endsAt: new Date("2027-12-31") },
  { code: "MOMO5", type: "fixed" as const, value: GHS(50), minOrder: GHS(300), usageLimit: 200, startsAt: new Date("2025-01-01"), endsAt: new Date("2027-12-31") },
  { code: "FREESHIP500", type: "fixed" as const, value: GHS(30), minOrder: GHS(500), usageLimit: null, startsAt: new Date("2025-01-01"), endsAt: new Date("2027-12-31") },
];

/* ═══════════════════════════════════════════════════════════
   Ghanaian names for sample data
   ═══════════════════════════════════════════════════════════ */

const ghanaianNames = [
  "Kwame Asante", "Ama Serwaa", "Kofi Mensah", "Akua Boateng",
  "Yaw Osei", "Adwoa Frimpong", "Kwesi Agyeman", "Abena Ofori",
  "Nana Akufo", "Efua Nyarko", "Kwabena Darko", "Afia Owusu",
];

/* ═══════════════════════════════════════════════════════════
   Main seed function
   ═══════════════════════════════════════════════════════════ */

async function seed() {
  console.log("🎵 Seeding Nobleman Musical Center database...\n");

  // ── Categories ──
  console.log("📂 Creating categories...");
  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const [inserted] = await db
      .insert(schema.categories)
      .values({ ...cat, slug: slugify(cat.name) })
      .returning({ id: schema.categories.id });
    categoryMap.set(cat.name, inserted.id);
    console.log(`   ✓ ${cat.name}`);
  }

  // ── Brands ──
  console.log("\n🏷️  Creating brands...");
  const brandMap = new Map<string, string>();
  for (const brand of brandsData) {
    const [inserted] = await db
      .insert(schema.brands)
      .values({ ...brand, slug: slugify(brand.name) })
      .returning({ id: schema.brands.id });
    brandMap.set(brand.name, inserted.id);
    console.log(`   ✓ ${brand.name}`);
  }

  // ── Products ──
  console.log("\n🎸 Creating products...");
  const productMap = new Map<string, string>();
  for (const prod of productsData) {
    const categoryId = categoryMap.get(prod.category);
    const brandId = brandMap.get(prod.brand);
    if (!categoryId || !brandId) {
      console.error(`   ✗ Missing category/brand for: ${prod.name}`);
      continue;
    }
    const [inserted] = await db
      .insert(schema.products)
      .values({
        slug: slugify(prod.name),
        name: prod.name,
        description: prod.description,
        longDescription: prod.longDescription,
        price: prod.price,
        compareAtPrice: prod.compareAtPrice ?? null,
        categoryId,
        brandId,
        stock: prod.stock,
        lowStockThreshold: Math.max(3, Math.floor(prod.stock * 0.2)),
        images: [],
        specs: prod.specs,
        tags: prod.tags,
        isFeatured: prod.isFeatured,
        isActive: true,
        seoTitle: prod.name,
        seoDescription: prod.description,
      })
      .returning({ id: schema.products.id });
    productMap.set(prod.name, inserted.id);
    console.log(`   ✓ ${prod.name} — GHS ${(prod.price / 100).toFixed(2)}`);
  }

  // ── Users ──
  console.log("\n👤 Creating users...");
  const adminPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || "Admin@123",
    12
  );
  const staffPassword = await bcrypt.hash("Staff@123", 12);
  const customerPassword = await bcrypt.hash("Customer@123", 12);

  await db
    .insert(schema.users)
    .values({
      email: "admin@nobleman.com",
      passwordHash: adminPassword,
      name: "Nana Admin",
      role: "admin",
      emailVerified: new Date(),
    });

  await db
    .insert(schema.users)
    .values({
      email: "staff@nobleman.com",
      passwordHash: staffPassword,
      name: "Kofi Staff",
      role: "staff",
      emailVerified: new Date(),
    });

  const [customerUser] = await db
    .insert(schema.users)
    .values({
      email: "customer@example.com",
      passwordHash: customerPassword,
      name: "Akua Customer",
      role: "customer",
      emailVerified: new Date(),
    })
    .returning({ id: schema.users.id });

  console.log("   ✓ admin@nobleman.com (admin)");
  console.log("   ✓ staff@nobleman.com (staff)");
  console.log("   ✓ customer@example.com (customer)");

  // ── Reviews ──
  console.log("\n⭐ Creating reviews...");
  let reviewCount = 0;
  for (const rev of reviewsData) {
    const productId = productMap.get(rev.product);
    if (!productId) continue;
    const nameIdx = reviewCount % ghanaianNames.length;
    // Create a user for each reviewer
    const [reviewer] = await db
      .insert(schema.users)
      .values({
        email: `reviewer${reviewCount}@example.com`,
        name: ghanaianNames[nameIdx],
        role: "customer",
        emailVerified: new Date(),
      })
      .returning({ id: schema.users.id });

    await db.insert(schema.reviews).values({
      productId,
      userId: reviewer.id,
      rating: rev.rating,
      title: rev.title,
      body: rev.body,
      isVerified: rev.verified,
    });
    reviewCount++;
  }
  console.log(`   ✓ ${reviewCount} reviews created`);

  // ── Sample Orders ──
  console.log("\n📦 Creating sample orders...");
  const productEntries = Array.from(productMap.entries());
  const orderStatuses: Array<"pending" | "paid" | "shipped" | "delivered"> = [
    "pending",
    "paid",
    "shipped",
    "delivered",
  ];

  for (let i = 0; i < 8; i++) {
    const status = orderStatuses[i % orderStatuses.length];
    const numItems = 1 + (i % 3);
    const items: Array<{ productId: string; name: string; price: number; quantity: number }> = [];
    let subtotal = 0;

    for (let j = 0; j < numItems; j++) {
      const [pName, pId] = productEntries[(i * 3 + j) % productEntries.length];
      const prod = productsData.find((p) => p.name === pName)!;
      const qty = 1 + (j % 2);
      items.push({ productId: pId, name: pName, price: prod.price, quantity: qty });
      subtotal += prod.price * qty;
    }

    const deliveryFee = subtotal >= 50000 ? 0 : 2500;
    const total = subtotal + deliveryFee;

    const [order] = await db
      .insert(schema.orders)
      .values({
        orderNumber: `NMC-${String(1001 + i).padStart(4, "0")}`,
        userId: customerUser.id,
        email: "customer@example.com",
        phone: "+233 24 123 4567",
        status,
        subtotal,
        deliveryFee,
        discount: 0,
        total,
        paymentMethod: i % 2 === 0 ? "paystack" : "momo",
        paymentRef: `PAY-${Date.now()}-${i}`,
        deliveryAddress: {
          region: "Greater Accra",
          city: "Accra",
          area: i % 2 === 0 ? "East Legon" : "Osu",
          landmark: i % 2 === 0 ? "Near Shoprite" : "Oxford Street",
        },
      })
      .returning({ id: schema.orders.id });

    for (const item of items) {
      await db.insert(schema.orderItems).values({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    }
    console.log(`   ✓ NMC-${1001 + i} — ${status} — GHS ${(total / 100).toFixed(2)}`);
  }

  // ── Sample Quotes ──
  console.log("\n📋 Creating sample quotes...");
  const quotesToInsert = [
    {
      orgName: "Grace Assembly Church",
      orgType: "church" as const,
      contactName: "Pastor Emmanuel Addo",
      email: "pastor@graceassembly.org",
      phone: "+233 20 555 1234",
      items: [{ name: "Behringer X32 Digital Mixer", quantity: 1 }, { name: "Shure SM58 Dynamic Microphone", quantity: 4 }],
      message: "We need a complete sound system upgrade for our 500-seat sanctuary. Please provide a quote including installation.",
      status: "new" as const,
    },
    {
      orgName: "Joy FM Ghana",
      orgType: "radio" as const,
      contactName: "Ama Darko",
      email: "tech@joyfm.com",
      phone: "+233 30 277 8899",
      items: [{ name: "Shure SM58 Dynamic Microphone", quantity: 6 }],
      message: "Looking to replace our studio microphones. Need broadcast-quality mics for 3 studios.",
      status: "sent" as const,
      quotedAmount: GHS(7200),
    },
    {
      orgName: "Accra Academy Music Dept",
      orgType: "school" as const,
      contactName: "Mr. Kwesi Boateng",
      email: "music@accraacademy.edu",
      phone: "+233 24 333 7788",
      items: [{ name: "Yamaha F310 Acoustic Guitar", quantity: 10 }, { name: "Yamaha C40 Classical Guitar", quantity: 5 }],
      message: "We're starting a music programme and need instruments for our students. Educational discount would be appreciated.",
      status: "new" as const,
    },
  ];

  for (const q of quotesToInsert) {
    await db.insert(schema.quotes).values(q);
    console.log(`   ✓ ${q.orgName} (${q.orgType})`);
  }

  // ── Discounts ──
  console.log("\n🏷️  Creating discount codes...");
  for (const d of discountsData) {
    await db.insert(schema.discounts).values(d);
    console.log(`   ✓ ${d.code}`);
  }

  // ── Summary ──
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("✅ Seed complete!");
  console.log(`   📂 ${categoriesData.length} categories`);
  console.log(`   🏷️  ${brandsData.length} brands`);
  console.log(`   🎸 ${productsData.length} products`);
  console.log(`   👤 3 users (admin, staff, customer)`);
  console.log(`   ⭐ ${reviewCount} reviews`);
  console.log(`   📦 8 sample orders`);
  console.log(`   📋 3 B2B quotes`);
  console.log(`   🏷️  ${discountsData.length} discount codes`);
  console.log("═══════════════════════════════════════════════════════\n");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
