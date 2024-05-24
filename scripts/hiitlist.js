// import * as mb from '../database.mjs';

function loadhiitnames() { 
    const buttonArea = document.getElementById('hiit_list') ; 
    let namelist ;
    let sta = mb.getAllActivitiesNames( user_id ) ; 
    sta.then(isOccur => {
            if (isOccur) {
                namelist = isOccur; 
            } else {
                console.log('no activities');
            }
        })
        .catch(error => {
            console.error('Error fetching activity list:', error);
        });

    namelist.forEach((namelist) => {
        const button = document.createElement('button');
        button.textContent = `${namelist.name}`;
        button.addEventListener('click', () => {
            console.log( button.textContent ) ; 
            
            const currentDateTime = new Date();
            const year = currentDateTime.getFullYear();
            const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(currentDateTime.getDate()).padStart(2, '0');
            const hours = String(currentDateTime.getHours()).padStart(2, '0');
            const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
            const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const activity_log = {
                user_id : user_id , 
                activity_id : namelist.activity_id , 
                dates : formattedDateTime 
            }
            // push to history in db 
            mb.updateHistory( activity_log ) ; 

            window.location = '/hiit';
        });
        buttonArea.appendChild(button);
    });
}

function init() {
    const exerciseButton = document.getElementById('Exercise') ; 
    const returnButton = document.getElementById('return');

    exerciseButton.addEventListener('click' , () => {
        console.log( exerciseButton.textContent ) ;
        window.location = '/hiit';
    }) ; 

    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
    }) ; 
} ; 

window.addEventListener('load', init);

window.addEventListener('load', loadhiitnames);
