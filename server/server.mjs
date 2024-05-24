import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// import * as mb from '../database.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
path.resolve(__dirname, __filename)
const app = express();


// Serve static files from the 'client' folder
app.use( express.static(path.join(__dirname, "..")) );

// Use express.json() to resolve json data
app.use(express.json());
app.use(express.static("public")) ; 

// SERVER GET REQUESTS
app.get("/" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "index.html" )) ; 
})

app.get("/index" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "index.html" )) ; 
})

app.get("/homepage" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "homepage.html" )) ; 
})

app.get("/hiit" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "hiit.html" )) ; 
})

app.get("/settings" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "settings.html" )) ; 
})

app.get("/history" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "history.html" )) ; 
})

app.get("/hiitList" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "hiitlist.html" )) ; 
})

app.get("/creating" , (req , res ) => {
  res.sendFile(path.join(__dirname , ".." , "page" , "creating.html" )) ; 
})

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



// app.listen(8080);
