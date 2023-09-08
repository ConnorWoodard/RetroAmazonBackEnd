import express from 'express';
import debug from 'debug';
const debugBook = debug('app:book');

const router = express.Router();
const books = [{
  "title": "Big Bang Love, Juvenile A (46-okunen no koi)",
  "author": "Delcine Durrant",
  "publication_date": "6/19/1980",
  "genre": "fiction",
  "_id": 1
}, {
  "title": "009 Re: Cyborg",
  "author": "Westley Studeart",
  "publication_date": "11/26/1955",
  "genre": "non-fiction",
  "_id": 2
}, {
  "title": "Short Time",
  "author": "Kaylee Trench",
  "publication_date": "9/6/1958",
  "genre": "non-fiction",
  "_id": 3
}, {
  "title": "Apocalypto",
  "author": "Elyse Aldwick",
  "publication_date": "1/7/2004",
  "genre": "non-fiction",
  "_id": 4
}, {
  "title": "Mulan",
  "author": "Barri Pithcock",
  "publication_date": "1/26/1949",
  "genre": "mystery",
  "_id": 5
}];


//get all books
router.get('/list', (req,res) => {
  debugBook('Getting all books');
  res.status(200).json(books);
});

//get a book by the id
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const book = books.find(book => book._id == id);
  if(book){
    res.status(200).send(book);
  } else {
    res.status(404).send({message: `Book ${id} not found`});
  }
  
});

//update a book by the id
//update can use a put or a post
router.put('/:id', (req,res) => {
  const id = req.params.id;
  const currentBook = books.find(book => book._id == id);
  //for this line to work, you have to have a body parser
  const updatedBook = req.body;

  if(currentBook){
    for(const key in updatedBook){
      if(currentBook[key] != updatedBook[key]){
        currentBook[key] = updatedBook[key];
      }
    }

    //save the currentBook back into the array
    const index = books.findIndex(book => book._id == id);
    if(index != -1){
      books[index] = currentBook;
    }
    res.status(200).send(`Book ${id} updated`);
  } else {
    res.status(404).send({message: `Book ${id} not found`});
  }

  res.json(updatedBook);
});

//add a new book to the array
router.post('/add', (req,res) => {
  const newBook = req.body;
  //if new book is not empty object
  
  if(newBook){
    //add a unique id
    const id = books.length + 1;
    newBook._id = id;
    //add the book to the array
    books.push(newBook);
    res.status(200).json({message: `Book ${newBook.title} added`});
  } else {
    res.status(400).json({message: `Error in adding book`});
  }
});

//delete a book by the id
router.delete('/:id',(req,res) => {
  //gets the id from the URL
  const id = req.params.id;
  //find the index of the book in the array
  const index = books.findIndex(book => book._id == id);
  if(index != -1){
    books.splice(index,1);
    res.status(200).json({message:`Book ${id} deleted`});
  } else {
    res.status(404).json({message: `Book ${id} not found`});
  }
});

export {router as BookRouter};