function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

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
    const user_id = getCookie( 'user_id' );
    const selectedDifficulty = document.getElementById('difficulty_select').value;

    const colorDictionary = {
        easy: `cornflowerblue`,
        medium: `palegreen`,
        hard: `orange`
    };
    const color = colorDictionary[selectedDifficulty] ; 

    let fetch_instance = fetch("/update_setting" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                user_id: user_id ,  
                difficulty: selectedDifficulty , 
                color : color 
            }
        )
    }) ; 
    closePopup();
}

// function changeSetting() {
//     const onclick="showPopup('Item 1')"
// }

function changeColour( ) {
    const selectValue = document.getElementById('difficulty_select').value ;
    
    if( selectValue === "hard" ){
        document.getElementById('popup').style.backgroundColor = `orange` ; 
    } else if (selectValue === "medium" ) {
        document.getElementById('popup').style.backgroundColor = "palegreen"  ; 
    } else {
        document.getElementById('popup').style.backgroundColor = `cornflowerblue`  ; 
    }
}

function init() {
    const returnButton = document.getElementById('return');
    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
    })
}

window.addEventListener('load', showPopup) ; 
window.addEventListener('load', init);