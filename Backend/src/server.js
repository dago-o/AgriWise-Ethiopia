import app from './App.js';
import 'dotenv/config';

const PORT=process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`The server is running on the ${PORT}`);
}

);