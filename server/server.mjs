import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import * as mb from '../database.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
path.resolve(__dirname, __filename)
const app = express();

// console.log(mb.listUsers() ); 

// Serve static files from the 'client' folder
app.use( express.static(path.join(__dirname, "..")) );

// Use express.json() to resolve json data
app.use(express.json());
app.use(express.static("public")) ; 

// SERVER GET REQUESTS
app.get("/" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "index.html" )) ; 
})

app.get("/homepage" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "homepage.html" )) ; 
})

app.get("/hiit" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "hiit.html" )) ; 
})

app.get("/setting" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "setting.html" )) ; 
})

app.get("/history" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "history.html" )) ; 
})

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



app.listen(4000);
