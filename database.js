import { MongoClient, ObjectId } from "mongodb";

import debug from "debug";
const debugDatabase = debug("app:Database");

let _db = null;

const newId = (str) => new ObjectId(str);

async function connect(){
    if(!_db){
        const connectionString = "mongodb+srv://ConnorWoodard:Iceblade21@cluster0.v23zesi.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
        const dbName = "RetroAmazon";
        const client = await MongoClient.connect(connectionString);
        _db = client.db(dbName);
    }
    return _db;
}

async function ping(){
    const db = await connect();
    await db.command({ ping: 1 });
    debugDatabase("Pinged your deployment. You successfully connected to MongoDB!");
}

async function getBooks(){
    const db = await connect();
    //MongoSH command to find all books: db.Book.find({})
    //find() returns a cursor, which is a pointer to the result set of a query
    const books = await db.collection("Book").find().toArray();
    //console.log(books);
    return books;
}

async function getBookById(id){
    const db = await connect();
    const book = await db.collection("Book").findOne({_id: new ObjectId(id)});
    return book;
}

async function addBook(book){
    const db = await connect();
    const result = await db.collection("Book").insertOne(book);
    //console.table(result);
    return result;
}

async function updateBook(id, updatedBook){
    const db = await connect();
    const result = await db.collection("Book").updateOne({_id:new ObjectId(id)},{$set:{...updatedBook}});
    //console.table(result);
    return result;
}

async function deleteBook(id){
  const db = await connect();
  const result = await db.collection("Book").deleteOne({_id:new ObjectId(id)});
  return result;
}

async function addUser(user){
    const db = await connect();
    user.role = ['customer'];
    const result = await db.collection("User").insertOne(user);
    return result;
}

async function loginUser(user){
    const db = await connect();
    const resultUser = await db.collection("User").findOne({email: user.email});
    return resultUser;
}

async function getAllUsers(){
    const db = await connect();
    const users = await db.collection("User").find().toArray();
    return users;
}

async function getUserById(id){
    const db = await connect();
    const user = await db.collection("User").findOne({_id: id});
    return user;
}

async function updateUser(user){
    const db = await connect();
    const result = await db.collection("User").updateOne({_id: user._id},{$set:{...user}});
    return result;
}

async function saveEdit(edit){
    const db = await connect();
    const result = await db.collection("Edit").insertOne(edit);
    return result;
}

async function findRoleByName(name){
    const db = await connect();
    const role = await db.collection("Role").findOne({name:name});
    return role;
}

ping();

export {connect, ping, getBooks, getBookById, addBook, updateBook, deleteBook, addUser, loginUser, newId, getAllUsers,getUserById, updateUser
, saveEdit, findRoleByName}