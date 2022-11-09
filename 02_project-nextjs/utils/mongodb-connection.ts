// install mongodb driver: npm i mongodb + create a mongodb cluster https://cloud.mongodb.com
import { MongoClient } from 'mongodb'; // Next.js detects this and will NOT bundle it into client side build

export const connectDatabase = async () => {
  const client = await MongoClient.connect(
    `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.2gcet26.mongodb.net/nextjs-example-database?retryWrites=true&w=majority`
  );
  const db = client.db();
  const meetupsCollection = db.collection('meetups'); // name of your choice for collection inside your database

  return { meetupsCollection, client };
};
