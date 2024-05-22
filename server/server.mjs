import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mb from '../database.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
path.resolve(__dirname, __filename)
const app = express();

// Serve static files from the 'client' folder
app.use( express.static(path.join(__dirname, "..", "client")) );

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



 
async function getUsers(req, res) {
  const results = await mb.listUsers(req.params.id);
  if (results) {
    // res.sendFile()
    // res.send()
    // 
  } else {
    res.status(404).send('No match found');
  }
}

app.get('/users', getUsers);

async function update_user(req, res) {
  const UserDetails = req.body;
  const result = mb.updateUsertoSQL(UserDetails) ;
  if ( result ) { 
    res.send() ;  
  } else { 
    
  }
} 

app.get('/update_user', update_user ) ; 



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});