// import * as mb from '../database.mjs';


function showPopup() {
    const popup_button = document.getElementById('setting_button') ; 
    popup_button.addEventListener('click' , () => {
        
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    })
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

function confirmSelection() {
    const selectedDifficulty = document.getElementById('difficulty_select').value;
    selectedDifficulty
    closePopup();
}

function changeSetting() {
    const onclick="showPopup('Item 1')"
}

function changeColour( ) {
    const selectValue = document.getElementById('difficulty_select').value ;
    
    console.log( selectValue) ; 
    if( selectValue === "hard" ){
        document.getElementById('popup').style.backgroundColor = `#f9bf54` ; 
    } else if (selectValue === "medium" ) {
        document.getElementById('popup').style.backgroundColor = "palegreen"  ; 
    } else {
        document.getElementById('popup').style.backgroundColor = `#5061c7`  ; 
    }
}

function init() {
    const returnButton = document.getElementById('return');
    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
        console.log( " clicked" ) ; 
    })
}

window.addEventListener('load', showPopup) ; 
window.addEventListener('load', init);