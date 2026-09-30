import express from 'express';
const app=express();

const PORT=7000;

app.get('/', (req, res)=>
{
    res.send("That is the first setup of the AgriWise-Ethiopia Backend.")
})

app.listen(PORT, ()=>{
    console.log(`The server is running on the ${PORT}`);
}

);