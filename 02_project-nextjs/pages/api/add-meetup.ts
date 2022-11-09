// API route: /api/add-meetup
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDatabase } from '../../utils/mongodb-connection';

// code will NEVER be exposed on client side -> it's normal server side NodeJS code
// name function as you want
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // only POST requests allowed to /api/add-meetup
  if (req.method !== 'POST') return;

  const { title, image, address, description } = req.body;
  const { meetupsCollection, client } = await connectDatabase();

  try {
    const result = await meetupsCollection.insertOne({ title, image, address, description });
    console.log(result);
    res.status(201).json({ message: 'Meetup inserted' }); // API request succeeded with custom message
  } catch (error) {
    console.log(error);
    res.status(400).json(error); // API request failed with custom message
  }
  client.close(); // close database connection
};

export default handler;
