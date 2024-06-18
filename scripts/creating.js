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

function creatingActivity(){
    let user_id      = getCookie("user_id") ; 
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

    let fetch_instance = fetch("/create_hiit" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                user_id: user_id , 
                name: activityName ,
                description: desc , 
                shared: shareable 
            }
        )
    }) ; 
    fetch_instance.then(response => response.text()).then(
        data=>{
            data = JSON.parse(data)
            if (data["update"] == true ){
                errorText.textContent = 'Update successed!'
            } else {
                errorText.textContent = 'Update failed, please try again.'
            }
        }
    )

    return 0;
}

function init() {
    const creatingButton = document.getElementById('create_button') ; 
    const returnButton = document.getElementById('return');

    creatingButton.addEventListener('click' , creatingActivity ) ; 

    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
    })
}

window.addEventListener('load', init);