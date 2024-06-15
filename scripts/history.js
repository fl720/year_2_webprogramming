// import * as mb from '../database.mjs';
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


function load_history() {
    const displayBoard = document.getElementById('history_list') ; 
    let his_list ;

    const user_id = getCookie( "user_id" );

    let fetch_instance = fetch("/get_history", {
        method: "POST",
        headers: {
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                user_id: user_id
            }
        )
    });
    fetch_instance.then(response => response.text()).then(
        data=>{
            console.log(data);
        }
    )

    return 0;

    let sta = mb.getHistorys( user_id ) ; 
    
    sta.then(isOccur => {
            if (isOccur) {
                his_list = isOccur; 
            } else {
                console.log('no history records');
            }
        })
        .catch(error => {
            console.error('Error fetching history list:', error);
        });

    his_list.forEach((his_list) => {
        const button = document.createElement('button') ;
        const tag    = document.createElement('p') ; 

        let activity_title ;
        let tag_title = mb.getActivityNameFromId( his_list.activity_id ) ; 
        tag_title.then(isOccur => {
                if (isOccur) {
                    activity_title = isOccur; 
                } else {
                    console.log('no activity records');
                }
            })
            .catch(error => {
                console.error('Error fetching activity id:', error);
            });

        tag.textContent = `${activity_title} , time: ${his_list.dates} `;
        tag.id = "history_tag" ; 
        button.textContent = "DELETE"
        button.id = "delete_button" ; 
        button.addEventListener('click', () => {
            console.log( "deleted" ) ; 

            tag.remove();
            button.remove() ; 
            mb.deleteHistory( his_list.history_id ) ; 
        });
        
        displayBoard.appendChild( tag ) ; 
        displayBoard.appendChild(button);
    });
} ; 


function init() {
    const returnButton = document.getElementById('return');

    returnButton.addEventListener('click' , () => {
        console.log( "clicked" ) ; 
        window.location = '/homepage';
    }) ; 
} ; 

window.addEventListener('load', load_history) ; 
window.addEventListener('load', init);
