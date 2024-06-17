import sqlite3 from 'sqlite3';

// connect to database
let db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    }
    else 
    { 
        console.log('Connection is success');
    }
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
export function getAllUsers() { 
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

export function getAllUsernames() {
    return new Promise((resolve, reject) => {
        const results = [];
        db.each(`SELECT username as name FROM users`, (err, row) => {
            if (err) {
                reject(err.message);
            } else {
                results.push(row.name);
            }
        }, (err, count) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(results);
            }
        });
    });
}

export async function isName(loginUsername) {
    try {
        const usernames = await getAllUsernames();
        return usernames.includes(loginUsername);
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function checkUserInDB(loginUsername) {
    const sql = 'SELECT username FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(sql, [loginUsername], (err, row) => {
            if(err)
            {
                reject(false ); 
            }
            else if (row)
            {
                resolve(true) ; 
            }
            else 
            {
                resolve(false) ; 
            }
        })
    })
}

export async function getUsername( user_id ) {
    const sql = 'SELECT username FROM users WHERE user_id = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [user_id], (err, row) => {
            if(err)
            {
                reject(false) ; 
            }
            else if (row)
            {
                resolve(row.username );
            }
            else 
            {
                resolve(false) ; 
            }
        })
    })
} ; 

export async function getUserID( username ) {
    const sql = 'SELECT user_id FROM users WHERE username = ?';

    return new Promise((resolve, reject) => {
        db.get(sql, [username], (err, row) => {
            if(err)
            {
                reject(false) ; 
            }
            else if (row)
            {
                resolve(row.user_id );
            }
            else 
            {
                resolve(false) ; 
            }
        })
    })
} ; 

export async function getPassword(user) {
    const sql = 'SELECT password FROM users WHERE username = ?';
    return new Promise((resolve, reject) => {
        db.get(sql, [user], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.password);
            } else {
                resolve(false);
            }
        });
    });
} ; 

export async function getAllActivitiesNames( user_id ) {
    const sql = `SELECT name FROM HIIT_activities where user_id = ? ` ; 
    return new Promise((resolve, reject) => {
        const results = [];
        db.each(sql, [user_id], (err, row) => {
            if (err) {
                reject(err.message);
            } else {
                results.push(row.name);
            }
        }, (err, numberOfRows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(results);
            }
        });
    });
} ; 

export async function getActivity( name , user_id ) {
    const sql = `SELECT * FROM HIIT_activities WHERE name = ? AND user_id = ?` ; 
    return new Promise((resolve, reject) => {
        db.get(sql, [name , user_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                resolve(false);
            }
        });
    });
} ;

export async function getHistorys( user_id ) {
    const sql = `SELECT * FROM History where user_id = ? ` ; 
    return new Promise((resolve, reject) => {
        const results = [];
        db.each(sql, [user_id], (err, row) => {
            if (err) {
                reject(err.message);
            } else {
                results.push(row);
            }
        }, (err) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(results);
            }
        });
        return results ; 
    });
} ; 

export async function getHistorysInArray( user_id ) {
    const DBdata = await getHistorys( Number(user_id) ) ; 
        
    const historyIds = [];
    const activityIds = [];
    const dates = [];
    DBdata.forEach (item => {
        historyIds.push(item.history_id);
        activityIds.push( item.activity_id);
        dates.push(item.dates);
    });

    const activityTitles = await Promise.all(activityIds.map(id => getActivityNameFromId(id)));
    const dataObject = {
        historyIds: historyIds,
        activityTitles: activityTitles,
        dates: dates
    };
    return dataObject ; 
}

export async function getSettings( user_id ) {
    const sql = `SELECT * FROM HIIT_settings where user_id = ? ` ; 
    return new Promise((resolve, reject) => {
        const results = [];
        db.each(sql, [user_id], (err, row) => {
            if (err) {
                reject(err.message);
            } else {
                results.push(row);
            }
        }, (err, numberOfRows) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(results);
            }
        });
    });
} ; 

export async function getActivityNameFromId( activity_id ) {
    const sql = `SELECT name FROM HIIT_activities WHERE activity_id = ?` ; 
    return new Promise((resolve, reject) => {
        db.get(sql, [activity_id], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                resolve(false);
            }
        });
    });
} ;


export async function updateUsertoDB(userDetails) {
    const { f_name , l_name, username, password, email } = userDetails;

    let sql = 'INSERT INTO users( f_name , l_name, username, password, email ) VALUES (?,?,?,?,? ) ' ; 
    return new Promise((resolve, reject) => {
        db.run( sql , [f_name ,  l_name, username, password, email] , (err)=> {
            if (err) {
                console.error(err.message) ;  
                reject(err);
            } else  {
                resolve(true);
            }
        });
    }) ; 
}


export async function updateActivity( activity) {
    const { user_id , name , description, shared } = activity;

    const sql = 'INSERT INTO HIIT_activities ( user_id , name , description, shared ) VALUES (?,?,?,? ) ' ; 
    return new Promise((resolve, reject) => {
        db.run( sql , [user_id , name , description, shared] , (err)=> {
            if (err) {
                console.error(err.message) ;  
                reject(err);
            } else {
                resolve(true);
            }
        });
    }) ; 
}

export function updateSetting( setting ) {
    const { activity_id, difficulty_level , color  } = setting;

    const sql = 'INSERT INTO HIIT_settings (activity_id, difficulty_level , color  ) VALUES (?,?,? ) ' ; 
    db.run( sql , [activity_id, difficulty_level , color ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}

export function updateHistory( activity_log ) {
    const { user_id , activity_id , dates } = activity_log;

    const sql = 'INSERT INTO History( user_id , activity_id , dates ) VALUES (?,?,? ) ' ; 
    db.run( sql , [user_id , activity_id , dates ] , (err)=> {
        if (err) return console.error(err.message) ; 
    } ) ; 
}


// -------------- CHANGE DATA ---------------
export function changeUsername( newInfo ) {  
    const { username, user_id } = newInfo;
    const sql = 'UPDATE users SET username = ? WHERE user_id = ?  ' ;
    db.run( sql, [username, user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeUserPassword( newInfo ) {  
    const { password , user_id } = newInfo;
    const sql = 'UPDATE users SET password = ? WHERE user_id = ?  ' ;
    db.run( sql, [password , user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeUserEmail( newInfo ) {  
    const { email, user_id } = newInfo;
    const sql = 'UPDATE users SET email = ? WHERE user_id = ?  ' ;
    db.run( sql, [email, user_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeSetting( newInfo ) {  
    const { activity_id , difficulty_level , color } = newInfo ; 
    const sql = 'UPDATE HIIT_settings SET difficulty_level = ? , color = ? WHERE activity_id = ?  ' ;
    db.run( sql, [difficulty_level , color , activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeActivityName( newInfo ) {  
    const { activity_id , name } = newInfo ; 
    const sql = 'UPDATE HIIT_activities SET name = ? WHERE activity_id = ?  ' ;
    db.run( sql, [name, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeActivityDescription( newInfo ) {  
    const { activity_id , description } = newInfo ;
    const sql = 'UPDATE HIIT_activities SET description = ? WHERE activity_id = ?  ' ;
    db.run( sql, [description, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function changeActivityShareability( newInfo ) {  
    const { activity_id , shared } = newInfo ;
    const sql = 'UPDATE HIIT_activities SET shared = ? WHERE activity_id = ?  ' ;
    db.run( sql, [shared, activity_id ] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}


// -------------- DELETION ---------------
export function deleteUser( userDetail ) { 
    const { username } = userDetail ; 

    const sql = 'DELETE FROM users WHERE username = ? ' ; 
    db.run( sql, [username] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export function deleteActivity( id ) { 
    const { activity_id } = id ; 

    const sql = 'DELETE FROM HIIT_activities WHERE activity_id = ? ' ; 
    db.run( sql, [activity_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
    sql = 'DELETE FROM HIIT_settings WHERE activity_id = ? ' ; 
    db.run( sql, [activity_id] , (err)=> {
        if (err) return console.error(err.message) ;
    } ) ; 
}

export async function deleteHistory( history_id ) {  
    const sql = 'DELETE FROM History WHERE history_id = ? ' ; 
    return new Promise((resolve, reject) => {
    db.run( sql, [history_id] , (err)=> {
        if (err) {
            console.error(err.message) ;  
            reject(err);
        } else  {
            resolve(true);
        }
    }) ; 
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

