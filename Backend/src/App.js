import express from 'express';

const app=express();
app.get('/', (req, res)=>
{
    res.send("That is the first Architecture of the AgriWise backend");

});

