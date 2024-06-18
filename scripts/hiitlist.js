function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function loadhiitnames() { 
    const buttonArea = document.getElementById('hiit_list') ; 
    const user_id    = getCookie("user_id") ;  
    let namelist ;

    let fetch_instance = fetch("/get_activities" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                user_id : user_id 
            }
        )
    }) ; 

    fetch_instance.then(response => response.text()).then(
        data=>{
            data = JSON.parse(data) ; 
            namelist = data["activityNames"] ; 
            const color = data["color"] ; 
            // console.log( data["color"] ) ; 

            namelist.forEach((activity_name) => {
                const button = document.createElement('button');
                button.textContent = `${activity_name}`;
                button.style.backgroundColor = color;
                
                button.addEventListener('click', () => {
                    // console.log( button.textContent ) ; 
                    
                    const currentDateTime = new Date();
                    const year = currentDateTime.getFullYear();
                    const month = String(currentDateTime.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(currentDateTime.getDate()).padStart(2, '0');
                    const hours = String(currentDateTime.getHours()).padStart(2, '0');
                    const minutes = String(currentDateTime.getMinutes()).padStart(2, '0');
                    const seconds = String(currentDateTime.getSeconds()).padStart(2, '0');
                    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        
                    // push to history in db 
                    let fetch_ins = fetch("/update_his" , {
                        method: "POST" , 
                        headers :{
                            "Content-type":"application/json"
                        },
                        body: JSON.stringify(
                            {
                                user_id : user_id , 
                                activityName : activity_name , 
                                dates : formattedDateTime 
                            }
                        )
                    }) ; 
                
                    fetch_ins.then(response => response.text()).then(
                        data=>{
                            data = JSON.parse(data)
                            console.log( data )  
                            if( data["update"] == true ){
                                setCookie( "activity_name" , activity_name , 1 ) ; 
                                window.location = '/hiit';
                            } else { 
                                console.log( "Error occur, please check with server.")
                            }
                        }
                    )

                    
                });
                buttonArea.appendChild(button);
            });
        })
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
