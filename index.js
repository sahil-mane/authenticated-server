const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
const authRouter = require('./routes/authRoute.js');


const app = express();

//1) MIDDLEWARE
app.use(cors());
app.use(express.json());

//2)ROUTE
app.use('/api/auth',authRouter);
//3)MONGO DB CONNECTION
// mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose
.connect('mongodb://127.0.0.1:27017/authentication')
.then(()=> console.log('Connected to MongoDB!'))
.catch(err => console.error('Failed to connect to MongoDB:',err));

//4)GLOBAL ERROR HANDLER
app.use((err, req, res,  next)=>{
    err.statuscode = err.statuscode || 500;
    err.status = err.status || 'error';
    
    res.status(err.statuscode).json({
        status:err.status,
        message:err.message,
    });
});

//5)SERVER
const PORT = 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));