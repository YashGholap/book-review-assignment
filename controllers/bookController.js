const db = require('../models/db');

// post/books - Authenticated users only
exports.addBook = (req, res) =>{
    const {title, author, genre} = req.body;

    if(!title || !author || !genre){
        return res.status(400).json({ message:"All fields are required."});
    }

    const query = `INSERT INTO books (title, author, genre) VALUES (?,?,?)`;
    db.run(query,[title, author, genre], function (err){
        if(err) return res.status(500).json({ message: "Internal Server Error"});
        res.status(200).json({ message: 'Book Added.', bookId: this.lastID});

    });
};

// get/books - all books with pagination + filters
exports.getBooks = (req, res) =>{
    const {author, genre, page=1, limit= 10} = req.query
    const offset = (page-1) * limit;

    let query = `SELECT * FROM books`;
    const conditions = [];
    const params = [];

    if(author){
        conditions.push(`author LIKE ?`);
        params.push(`%${author}%`);
    }
    if(genre){
        conditions.push(`genre = ?`);
        params.push(genre);
    }
    if(conditions.length){
        query += ` WHERE ` + conditions.join(' AND ');
    }

    query += ` LIMIT ? OFFSET ?`;
    params.push(+limit, +offset);

    db.all(query,params, (err, books)=>{
        // console.log(query);
        if(err) return res.status(500).json({ message: "Internal Server Error"});
        res.json({books});
    });
};

// get/books/:id - get book with id (with avg rating & reviews)
exports.getBookDetails = (req, res) =>{
    const bookId = req.params.id;

    db.get(`SELECT * FROM books WHERE id = ?`,[bookId],(err, book)=>{
        if(err || !book) return res.status(404).json({ message:"Book Not Found"});

        db.get(
            `SELECT AVG(rating) as avgRating FROM reviews WHERE bookId = ?`,
            [bookId],
            (err, ratingRow)=>{
                if(err) return res.status(500).json({ message: "Error Fetching Reviews" });
                
                db.all(
                    `SELECT * FROM reviews WHERE bookId = ? LIMIT 10`,
                    [bookId],
                    (err, reviews)=>{
                        if(err) return res.status(500).json({ message: "Internal Server Error"});

                        res.json({...book, avgRating: ratingRow.avgRating || 0, reviews});
                    }
                );
            }
        );
    });
};