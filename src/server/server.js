const express = require('express')
const usersRouter = require('./routes');
const mongooseConnection = require('./database');

const port = 3000;
const app = express()

app.use(express.json()); 
app.use('/api', usersRouter);


app.listen(port, ()=>{
    console.log(`App started on port ${port}`);
})