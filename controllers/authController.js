const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const SECRET = process.env.JWT_SECRET

exports.signup = async(req , res)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password) {
        return res.status(400).json({ message: "All the fields are required."});
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(query, [username, email, hashedPassword], function (err){
        if(err){
            if(err.code === 'SQLITE_CONSTRAINT'){
                return res.status(409).json({ message: "Username Already Exists."});
            }
            return res.status(500).json({ message: 'Internal Server Error'});
        }
        res.status(201).json({ message: 'User Created Successfully.'});
    });
};

exports.login = async (req, res) =>{
    const {username, email, password} = req.body;

    if(!username || !password) return res.status(400).json({ message: 'username and password are required.'})
    
    const query = `SELECT * FROM users WHERE username = ?`;
    db.get(query,[username], async(err, user)=>{
        if(err) return res.status(500).json({ message: "Internal Server Error"});
        if(!user) return res.status(401).json({ message: "Invalid Credentials"});

        const passwordsMatched = await bcrypt.compare(password, user.password);
        if(!passwordsMatched) return res.status(401).json({ message: "Invalid Credentials"});

        const token = jwt.sign({ id: user.id, username: user.username}, SECRET, {expiresIn: '1h'});

        res.json({ message : "Login Sucessful", token});
    })

}