import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const DB_NAME = 'collegehub';
const COLLECTION_NAME = 'colleges';

async function seedDatabase() {
  const client = new MongoClient(MONGO_URI);

  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await client.connect();
    console.log('Connected to MongoDB successfully.');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Drop collection first for a clean seed
    try {
      await collection.drop();
      console.log(`Dropped existing '${COLLECTION_NAME}' collection.`);
    } catch (err) {
      if (err.codeName === 'NamespaceNotFound') {
        console.log(`Collection '${COLLECTION_NAME}' does not exist, creating new...`);
      } else {
        throw err;
      }
    }

    // Load and parse the 4 JSON files from root folder
    const files = [
      'colleges_1_50.json',
      'colleges_51_100.json',
      'colleges_101_150.json',
      'colleges_151_200.json'
    ];

    let allColleges = [];
    const rootDir = path.resolve(__dirname, '..');

    for (const file of files) {
      const filePath = path.join(rootDir, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`Required seed file not found: ${filePath}`);
      }
      const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      console.log(`Loaded ${fileData.length} records from ${file}`);
      allColleges = allColleges.concat(fileData);
    }

    if (allColleges.length === 0) {
      throw new Error('No college records found to seed.');
    }

    console.log(`Inserting ${allColleges.length} college records into '${DB_NAME}.${COLLECTION_NAME}'...`);
    const result = await collection.insertMany(allColleges);
    console.log(`Successfully seeded ${result.insertedCount} college records!`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seedDatabase();
