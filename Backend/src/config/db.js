import mongoose from 'mongoose';

export const connectDB=async()=>
{
    if(!process.env.MONGO_URI)
    {
        console.log('The MONGO_URI is not set in .env');
        process.exit(1);
    }
    

    try 
    {
       await mongoose.connect(process.env.MONGO_URI);
       console.log('Database is Connected Successfully');

        
    } 
    catch (error) {

      console.error('Database is not Connected:', error.message); 
      process.exit(1);
    }

}

