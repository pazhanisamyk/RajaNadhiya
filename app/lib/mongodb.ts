import { MongoClient, type Db } from "mongodb";

const DEFAULT_LOCAL_URI = "mongodb://127.0.0.1:27017";
const DEFAULT_DB_NAME = "raja_nadhiya_engagement";

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoUri?: string;
};

export function getMongoUri(): string {
  return process.env.MONGODB_URI?.trim() || DEFAULT_LOCAL_URI;
}

export function getMongoDbName(): string {
  if (process.env.MONGODB_DB?.trim()) {
    return process.env.MONGODB_DB.trim();
  }
  const uri = getMongoUri();
  try {
    // Parse explicit db name from connection string path if provided (e.g. mongodb+srv://.../mydb)
    const match = uri.match(/^mongodb(?:\+srv)?:\/\/[^/]+\/([^?]+)/i);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  } catch {
    // Fall back to default db name
  }
  return DEFAULT_DB_NAME;
}

export function isMongoAtlasUri(): boolean {
  const uri = getMongoUri();
  return (
    uri.startsWith("mongodb+srv://") ||
    (!uri.includes("127.0.0.1") && !uri.includes("localhost"))
  );
}

/**
 * Returns a cached MongoDB database handle, reusing connections across dev reloads and requests.
 */
export async function getMongoDb(): Promise<Db> {
  const uri = getMongoUri();

  if (!globalForMongo._mongoClientPromise || globalForMongo._mongoUri !== uri) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    globalForMongo._mongoUri = uri;
    globalForMongo._mongoClientPromise = client.connect().catch((err) => {
      globalForMongo._mongoClientPromise = undefined;
      throw err;
    });
  }

  const client = await globalForMongo._mongoClientPromise;
  return client.db(getMongoDbName());
}

