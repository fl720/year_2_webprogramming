import sqlite3 from 'sqlite3';

// connect to database
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connection is a success');

});

// REFRESH-RELOAD TABLES
function dropTables() { 
    db.run( "DROP TABLE users" ) ; 
    db.run( "DROP TABLE History" ) ; 
    db.run( "DROP TABLE HIIT_activities" ) ; 
    db.run( "DROP TABLE HIIT_settings" ) ; 
}


// CREATE TABLES 
function createDB() { 
    const sql = 'CREATE TABLE users( user_id INTEGER PRIMARY KEY, f_name , l_name, username, password, email)' ; 
    db.run(sql) ; 
    sql = 'CREATE TABLE History( history_id INTEGER PRIMARY KEY, user_id , activity_id , dates)' ; 
    db.run(sql) ; 
    sql = 'CREATE TABLE HIIT_activities( activity_id INTEGER PRIMARY KEY, user_id , name , description, shared )' ; 
    db.run(sql) ; 
    sql = 'CREATE TABLE HIIT_settings( activity_id, difficulty_level , color )' ; 
    db.run(sql) ; 
}

// INSERT TEST DATA INTO DATABASE 
function insertTestData() { 
    const sql = 'INSERT INTO users( f_name , l_name, username, password, email ) VALUES (?,?,?,?,? ) ' ; 
    db.run( sql , ["Fred" , "Lewis" ,"FL" , "Admin12345" , "test2@gmail.com"] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) 

    sql = 'INSERT INTO HIIT_activities( user_id , name , description, shared ) VALUES (?,?,?,? ) ' ; 
    db.run( sql , [ 1 , "Pushups" ,"On the ground, set your hands at a distance that is slightly wider than shoulder-width apart. Draw a straight line from your chest down to the floor" , false ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) 

    sql = 'INSERT INTO HIIT_settings( activity_id, difficulty_level , color ) VALUES (?,?,? ) ' ; 
    db.run( sql , [1 , "medium" , "red" ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) 

    sql = 'INSERT INTO History( user_id , activity_id , dates ) VALUES (?,?,? ) ' ; 
    db.run( sql , [ 1 , 1 , "2008-11-11 13:23:44" ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) 

} 


// ========================= OPERATION FUNCTION FOR DB =========================
function getAllUsers() { 
    const sql = `SELECT * FROM users` ; 
    db.all(sql,[], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        rows.forEach((row) => {
            console.log(row) ; 
        }) ; 
    });
}

function listUsers() {
    results = []
    db.each(`SELECT user_id as id, name as name FROM users`, (err, row) => {
        if (err) {
            console.error(err.message);
        }
        results.push(row.id + "\t" + row.name);
    });
    return results
}

function updateUsertoDB(userDetails) {
    const { f_name , l_name, username, password, email } = JSON.parse(userDetails);
    // const { f_name , l_name, username, password, email } = userDetails;

    let sql ; 
    sql = 'INSERT INTO users( f_name , l_name, username, password, email ) VALUES (?,?,?,?,? ) ' ; 
    db.run( sql , [f_name ,  l_name, username, password, email] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}

function updateActivity( activity) {
    const { user_id , name , description, shared } = JSON.parse(activity);
    // const { user_id , name , description, shared } = activity;

    const sql = 'INSERT INTO HIIT_activities ( user_id , name , description, shared ) VALUES (?,?,? ) ' ; 
    db.run( sql , [user_id , name , description, shared] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}

function updateSetting( setting ) {
    const { activity_id, difficulty_level , color  } = JSON.parse(setting);
    // const { activity_id, difficulty_level , color  } = setting;

    const sql = 'INSERT INTO HIIT_settings (activity_id, difficulty_level , color  ) VALUES (?,?,? ) ' ; 
    db.run( sql , [activity_id, difficulty_level , color ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}

function updateHistory( activity_log ) {
    const { user_id , activity_id , dates } = JSON.parse(activity_log);
    // const { user_id , activity_id , dates } = activity_log;

    const sql = 'INSERT INTO History( user_id , activity_id , dates ) VALUES (?,?,? ) ' ; 
    db.run( sql , [user_id , activity_id , dates ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}


// -------------- CHANGE DATA ---------------
function changeUsername( newInfo ) {  
    const { username, user_id } = JSON.parse(newInfo);
    // const { username, user_id } = newInfo;
    const sql = 'UPDATE users SET username = ? WHERE user_id = ?  ' ;
    db.run( sql, [username, user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeUserPassword( newInfo ) {  
    const { password , user_id } = JSON.parse(newInfo);
    // const { password , user_id } = newInfo;
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?  ' ;
    db.run( sql, [password , user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeUserEmail( newInfo ) {  
    const { email, user_id } = JSON.parse(newInfo);
    // const { email, user_id } = newInfo;
    const sql = 'UPDATE users SET email = ? WHERE user_id = ?  ' ;
    db.run( sql, [email, user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeSetting( newInfo ) {  
    const { activity_id , difficulty_level , color } = JSON.parse(newInfo);
    // const { activity_id , difficulty_level , color } = newInfo ; 
    const sql = 'UPDATE HIIT_settings SET difficulty_level = ? , color = ? WHERE activity_id = ?  ' ;
    db.run( sql, [difficulty_level , color , activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeActivityName( newInfo ) {  
    const { activity_id , name } = JSON.parse(newInfo);
    // const { activity_id , name } = newInfo ; 
    const sql = 'UPDATE HIIT_activities SET name = ? WHERE activity_id = ?  ' ;
    db.run( sql, [name, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeActivityDescription( newInfo ) {  
    const { activity_id , description } = JSON.parse(newInfo);
    // const { activity_id , description } = newInfo ;
    const sql = 'UPDATE HIIT_activities SET description = ? WHERE activity_id = ?  ' ;
    db.run( sql, [description, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function changeActivityShareability( newInfo ) {  
    const { activity_id , shared } = JSON.parse(newInfo);
    // const { activity_id , shared } = newInfo ;
    const sql = 'UPDATE HIIT_activities SET shared = ? WHERE activity_id = ?  ' ;
    db.run( sql, [shared, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}


// -------------- DELETION ---------------
function deleteUser( id ) { 
    const { user_id } = JSON.parse(id);
    // const { user_id } = id ; 

    const sql = 'DELETE FROM users WHERE user_id = ? ' ; 
    db.run( sql, [user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function deleteActivity( id ) { 
    const { activity_id } = JSON.parse(id);
    // const { activity_id } = id ; 

    const sql = 'DELETE FROM HIIT_activities WHERE activity_id = ? ' ; 
    db.run( sql, [activity_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
    sql = 'DELETE FROM HIIT_settings WHERE activity_id = ? ' ; 
    db.run( sql, [activity_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

function deleteHistory( id ) { 
    const { history_id } = JSON.parse(id);
    // const { history_id } = id ; 

    const sql = 'DELETE FROM HIIT_activities WHERE history_id = ? ' ; 
    db.run( sql, [history_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}


function closeDB()
{
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Close database connection');
    }); 
}



// ============================== test ==============================
const testuser = {
    f_name : 'Keny' , 
    l_name : 'Rush' , 
    username : 'KR' , 
    password : 'Aa12345678', 
    email : 'KR123@gmail.com'
}

const newUsernameInfo = { username: "JLev" , user_id : 1 }  ; 

const shareable = {activity_id : 1  , shared : true} ; 
// const shareable = {activity_id : 1  , shared : false} ; 

// const newdescript = {activity_id : 1  , description : "Just Push!" } ; 
const newdescript = {activity_id : 1  , description : "On the ground, set your hands at a distance that is slightly wider than shoulder-width apart. Draw a straight line from your chest down to the floor" } ; 

// changeUsername( newUsernameInfo ) ; 
// changeActivityShareability( shareable ) ; 
// changeActivityDescription( newdescript ) ;
// updateUsertoDB( testuser ) ; 