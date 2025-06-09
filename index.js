express = require('express');


const app = express();
const PORT = 3000;


app.get('/', (req, res)=>{
    res.send("<h1> Hello there!</h1>");
})

app.listen(PORT, (err)=>{
    if(!err){
        console.log(`Server is running on port ${PORT}....`);
    }
    else{
        console.log("Error Occured, Server can't start", err);
    }
})

