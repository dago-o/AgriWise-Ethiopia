import 'dotenv/config';
import app from './App.js';
import { connectDB } from './src/config/db.js';

const PORT = process.env.PORT;

await connectDB();

app.listen(PORT, () => {
    console.log(`The server is running on: ${PORT}`);
});