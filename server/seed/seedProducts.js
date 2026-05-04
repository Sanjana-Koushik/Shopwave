require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const connectDB = require('../config/db');

const products = [
  // ── FASHION ──────────────────────────────────────────────────────────
  {
    name: 'Floral Boho Summer Dress',
    price: 1899,
    description:
      'A flowing, free-spirited floral dress perfect for warm days. Made from 100% breathable cotton with delicate hand-embroidered floral motifs. Features a relaxed A-line silhouette, adjustable tie straps, and side pockets. Available in sizes XS–XXL.',
    category: 'Fashion',
    stockCount: 35,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.7,
    numReviews: 128,
  },
  {
    name: 'Classic Leather Tote Bag',
    price: 3499,
    description:
      'Handcrafted from genuine full-grain leather, this spacious tote is the perfect everyday companion. Features a zipper closure, interior pockets, and a detachable pouch. Ages beautifully over time. Available in Tan, Black, and Cognac.',
    category: 'Fashion',
    stockCount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.9,
    numReviews: 87,
  },
  {
    name: 'Silk Wrap Scarf',
    price: 999,
    description:
      'A luxurious 100% silk scarf with a vibrant abstract print. Incredibly versatile — wear it as a headscarf, neck tie, bag accessory, or sarong. Measures 90×90 cm. Dry clean recommended.',
    category: 'Fashion',
    stockCount: 50,
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.5,
    numReviews: 63,
  },
  {
    name: 'Gold Hoop Earring Set',
    price: 699,
    description:
      'A set of 3 gold-plated hoop earrings in small, medium, and large sizes. Made from hypoallergenic stainless steel with an 18K gold finish. Perfect for layering and everyday elegance.',
    category: 'Fashion',
    stockCount: 80,
    imageUrl: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.6,
    numReviews: 210,
  },

  // ── CROCHET ──────────────────────────────────────────────────────────
  {
    name: 'Chunky Merino Yarn Bundle',
    price: 1299,
    description:
      'A premium bundle of 5×200g skeins of super-chunky 100% merino wool yarn. Ultra-soft and perfect for blankets, oversized sweaters, and home décor. Available in a curated palette of earthy neutrals and pastels.',
    category: 'Crochet',
    stockCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.8,
    numReviews: 156,
  },
  {
    name: 'Ergonomic Crochet Hook Set',
    price: 849,
    description:
      'A complete set of 12 ergonomic soft-grip crochet hooks ranging from 2mm to 12mm. The cushioned handles reduce hand fatigue during long crafting sessions. Comes in a zipped canvas roll-up case.',
    category: 'Crochet',
    stockCount: 60,
    imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.7,
    numReviews: 99,
  },
  {
    name: 'Handmade Crochet Baby Blanket',
    price: 2199,
    description:
      'A beautifully handcrafted crochet baby blanket made from hypoallergenic cotton yarn in a classic granny-square pattern. Soft, washable, and perfectly sized at 100×80 cm. Makes a wonderful baby shower gift.',
    category: 'Crochet',
    stockCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 5.0,
    numReviews: 42,
  },
  {
    name: 'Boho Crochet Wall Hanging',
    price: 1599,
    description:
      'A stunning handmade macramé-style crochet wall hanging using natural cotton cord. Features geometric patterns, fringe tassels, and driftwood mounting rod. Measures 45cm wide × 70cm long. Each piece is unique.',
    category: 'Crochet',
    stockCount: 12,
    imageUrl: 'https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.9,
    numReviews: 38,
  },

  // ── BOOKS ────────────────────────────────────────────────────────────
  {
    name: 'The Thread & Stitch Compendium',
    price: 899,
    description:
      'The definitive guide to crochet and textile arts. Over 300 pages covering beginner to advanced techniques, 50+ original patterns for garments, accessories, and home décor, plus a full yarn guide and troubleshooting section. Beautifully photographed.',
    category: 'Books',
    stockCount: 70,
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.9,
    numReviews: 203,
  },
  {
    name: 'Style Me: A Fashion Memoir',
    price: 699,
    description:
      'A candid and inspiring memoir by acclaimed fashion stylist Priya Menon, chronicling her journey from a small-town girl to dressing Bollywood\'s biggest stars. Packed with behind-the-scenes stories, styling tips, and vibrant photography.',
    category: 'Books',
    stockCount: 55,
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.5,
    numReviews: 118,
  },
  {
    name: 'The Midnight Garden (Novel)',
    price: 549,
    description:
      'A lush, magical-realist novel set in a crumbling colonial estate in Goa. Follow Anya as she uncovers a century-old mystery through a garden that only blooms at night. Winner of the 2024 South Asian Fiction Prize. A must-read.',
    category: 'Books',
    stockCount: 100,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80',
    featured: true,
    rating: 4.8,
    numReviews: 311,
  },
  {
    name: 'Slow Living: A Mindful Craft Journal',
    price: 749,
    description:
      'Part craft journal, part wellness guide. This beautifully illustrated book weaves together mindfulness practices and slow-craft activities — from journaling and hand-lettering to weaving and natural dyeing. Includes 52 weekly creative prompts.',
    category: 'Books',
    stockCount: 40,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80',
    featured: false,
    rating: 4.7,
    numReviews: 76,
  },
];

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products (Fashion, Crochet, Books)`);

    // Create admin user if not exists
    const existing = await User.findOne({ email: 'admin@shopwave.com' });
    if (!existing) {
      await User.create({
        name: 'Shop Admin',
        email: 'admin@shopwave.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin user created: admin@shopwave.com / admin123');
    } else {
      console.log('👤 Admin user already exists');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seed();
