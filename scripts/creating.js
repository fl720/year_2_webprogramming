// import * as mb from '../database.mjs';

function creatingActivity(){
    let activityName = document.querySelector('#activity_name').value ; 
    let desc         = document.querySelector('#description').value   ; 
    let shareable    = document.querySelector('#share_status').value  ; 
    let errorText    = document.querySelector('#creation_error')      ; 

    if (activityName === "" || desc === "") {
        errorText.textContent = 'Please fill in all fields';
        return 0 ; 
    } else {
        errorText.textContent = '' ; 
    }

    const activityDetails = {
        user_id: user_id , 
        name: activityName ,
        description: desc , 
        shared: shareable 
    } ; 
    mb.updateActivity( activityDetails ) ; 
}

function init() {
    const creatingButton = document.getElementById('create_button') ; 
    const returnButton = document.getElementById('return');

    creatingButton.addEventListener('click' , creatingActivity ) ; 

    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
        console.log( " clicked" ) ; 
    })
}

window.addEventListener('load', init);