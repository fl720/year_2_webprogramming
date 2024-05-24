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
        button.textContent = `${namelist}`;
        button.addEventListener('click', () => {
            console.log( button.textContent ) ; 
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

// window.addEventListener('load', loadhiitnames);
