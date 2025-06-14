require('dotenv').config();
express = require('express');


const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());




const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');


app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', reviewRoutes);



app.listen(PORT, (err)=>{
    if(!err){
        console.log(`Server is running on port ${PORT}....`);
    }
    else{
        console.log("Error Occured, Server can't start", err);
    }
})

