import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { categoriesData, productsData } from './seedData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    console.log('[SEEDER] Checking database initialization...');
    
    // 1. Seed Admin User if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'rohitgusain792@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'rohitgusain';
    
    let admin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!admin) {
      admin = new User({
        name: 'Rohit Gusain (Admin)',
        email: adminEmail.toLowerCase(),
        passwordHash: adminPassword, // Pre-save hook will hash this!
        role: 'admin',
        phone: '9876543210',
        addresses: [
          {
            house: 'Plot 45',
            street: 'Rajpur Road',
            city: 'Dehradun',
            district: 'Dehradun',
            state: 'Uttarakhand',
            pincode: '248001',
            isDefault: true
          }
        ]
      });
      await admin.save();
      console.log(`[SEEDER] Admin user created: ${adminEmail}`);
    } else if (admin.role !== 'admin') {
      admin.role = 'admin';
      await admin.save();
      console.log(`[SEEDER] Updated existing user to admin role: ${adminEmail}`);
    }

    // 2. Seed Categories if empty
    const categoryCount = await Category.countDocuments();
    let categoryMap = {};
    
    if (categoryCount === 0) {
      console.log('[SEEDER] Seeding categories...');
      for (const cat of categoriesData) {
        const createdCat = await Category.create(cat);
        categoryMap[cat.slug] = createdCat._id;
      }
      console.log(`[SEEDER] Successfully seeded ${categoriesData.length} categories.`);
    } else {
      const existingCategories = await Category.find();
      existingCategories.forEach(cat => {
        categoryMap[cat.slug] = cat._id;
      });
    }

    // 3. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[SEEDER] Seeding products...');
      const productsToCreate = productsData.map(prod => {
        const { categorySlug, ...rest } = prod;
        return {
          ...rest,
          category: categoryMap[categorySlug]
        };
      });
      await Product.insertMany(productsToCreate);
      console.log(`[SEEDER] Successfully seeded ${productsData.length} Pahadi demo products.`);
    }

    console.log('[SEEDER] Database seeding completed successfully.');
  } catch (error) {
    console.error(`[SEEDER ERROR] ${error.message}`);
  }
};

// Standalone execution script
if (process.argv[2] === '-d' || process.argv[2] === '--run') {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
