import mongoose from 'mongoose';
import dns from 'dns';

// Fix Windows ISP/Router DNS blocking _mongodb._tcp SRV queries by setting Google/Cloudflare public DNS
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('DNS setServers fallback note:', e.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`\n✅ MongoDB Atlas Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n⚠️ MongoDB Atlas Connection Error: ${error.message}`);
  }
};

export default connectDB;
