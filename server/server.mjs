import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mb from './database.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
path.resolve(__dirname, __filename)
const app = express();

// Serve static files from the 'client' folder
app.use( express.static(path.join(__dirname, "..")) );

// Use express.json() to resolve json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.post("/signup" , async (req , res ) => {
  const username = req.body.username ; 
  const usernameExist = await mb.checkUserInDB( username )  ; 

  const f_name = req.body.f_name ; 
  const l_name = req.body.l_name ;  
  const password = req.body.password ;
  const email = req.body.email ; 

  const userDetails = { f_name , l_name, username, password, email } ; 

  if( usernameExist ){
    res.send( JSON.stringify({ usernameExist : true }) ) ; 
  } else {
    const update_result = await mb.updateUsertoDB( userDetails ) ;
    if( update_result != true ){
      res.send(JSON.stringify({ 
        usernameExist : false ,
        user_id : -1 })) ; 

      return ; 
    }

    const user_id = await mb.getUserID( username ) ; 

    if( user_id == false ){
      res.send(JSON.stringify({ usernameExist : false ,
        user_id : -1 })) ; 
    } else {
      res.send(JSON.stringify({ usernameExist : false ,
        user_id : user_id 
      }) )
    }
  }
})

app.post("/get_history", async (req , res ) => {
  const user_id = req.body.user_id;
  const DBdata = await mb.getHistorysInArray( user_id ) ; 
  // console.log(DBdata) ; 
  res.send( JSON.stringify(DBdata) ) ; 
})

app.post("/delete_history" , async (req , res ) => { 
  const his_id = req.body.his_id ; 
  const deleteHistoryStatus = await mb.deleteHistory( his_id ) ;  
  res.send( deleteHistoryStatus ) ; 
})

app.post("/get_login" , async (req , res ) => {
  const username = req.body.username;
  const usernameExist = await mb.checkUserInDB( username )  ; 

  if( !usernameExist ) {
    res.send( JSON.stringify({ usernameExist : false })) ; 
  } else {
    const passwordInDB = await mb.getPassword( username ) ; 
    if( req.body.password == passwordInDB ) {
      const user_id = await mb.getUserID( username ) ; 
      res.send( JSON.stringify({ usernameExist : true , passwordCorrectness : true , user_id : user_id})) ; 
    } else {
      res.send( JSON.stringify({ usernameExist : true , passwordCorrectness : false  })) ; 
    }
  }
})

app.post("/create_hiit" , async ( req , res ) => {
  const user_id =  req.body.user_id ;
  const name = req.body.name ;
  const description = req.body.description ; 
  const shared = req.body.shared ;  

  const new_activity = { user_id , name , description, shared }

  if( await mb.getActivity( name , user_id ) === false ){
    // ONLY CREATE WITH ACTIVITY WITH DIFFERENT NAME
    const update = await mb.updateActivity( new_activity ) ; 

    if( update != true ){
      res.send( JSON.stringify({ update : false })) ; 
    } else {
      const activity_id = await mb.getActivity( name , user_id ) ; 
      const setting = { activity_id:activity_id['activity_id'], difficulty_level:'easy' , color: 'blue'  } ; 
      const update_setting = await mb.updateSetting( setting )  ;

      if ( update_setting != true ){
        res.send( JSON.stringify({ update : false })) ; 
      } else {
        res.send( JSON.stringify({ update : true })) ;
      }
    }
  } else {
    res.send( JSON.stringify({ update : false })) ; 
  }
})

app.post("/update_setting", async ( req , res ) => {
  const user_id =  req.body.user_id ;
  const difficulty = req.body.difficulty ; 
  const color = req.body.color ; 

  const activityId_list = await mb.getAllActivitiesIDs( user_id ) ; 

  const setting = { activity_id : 0 , difficulty_level : difficulty , color : color } ; 

  activityId_list.forEach(  activity_id =>  {
  setting.activity_id = activity_id;
  mb.changeSetting(setting); // cannot use await here
  }) ; 
})

app.post("/get_activities" , async( req , res ) => {
  const user_id = req.body.user_id ; 
  
  const activityNames = await mb.getAllActivitiesNames( user_id ) ;
  const any_activityId = await mb.getActivityId( activityNames[0] , user_id ) ; 
  const setting = await mb.getSettingColor( any_activityId.activity_id ) ; 
  const color = setting[0].color ; 
  
  res.send( JSON.stringify( {activityNames:activityNames,color:color}) ) ; 
})

app.post("/update_his" , async( req , res ) => {
  const user_id = req.body.user_id ; 
  const activityName =  req.body.activityName ;
  const timestamp = req.body.dates ; 
  const activity = await mb.getActivityId( activityName , user_id ) ; 
  const id = activity.activity_id.toString() ; 

  const activity_log = { user_id , id , timestamp } ;

  const sta = await mb.updateHistory( activity_log ) ; 
  
  res.send(  JSON.stringify( { update : sta , activity_id : id } ) ) ; 
})

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});



// app.listen(8080);
