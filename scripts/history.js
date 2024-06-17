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
    const user_id = getCookie( 'user_id' );

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
            const dataObject = JSON.parse(data);

            if( dataObject.historyIds.length == 0 ){
                console.log('no history records');
                return 0 ; 
            }
            const { historyIds, activityTitles, dates } = dataObject;
            
            const displayBoard = document.getElementById('history_list') ; 
            displayBoard.innerHTML = '';
            historyIds.forEach((history_id, index) => {
                const tag = document.createElement('div');
                tag.className = 'activity_item';
                
                const description = document.createElement('div');
                description.className = 'activity_description';
                description.textContent = `${activityTitles[index]['name'] } at ${dates[index]}`;
                
                const button = document.createElement('button');
                button.className = 'delete_button';
                button.textContent = 'DELETE';
                button.addEventListener('click', () => {
                console.log(`Deleting activity with ID: ${history_id}`);
                let fetch_ins = fetch("/delete_history" , {
                    method: "POST" , 
                    headers :{
                        "Content-type":"application/json"
                    },
                    body: JSON.stringify(
                        {
                            his_id: history_id 
                        }
                    )
                }) ;
                fetch_ins.then(response => response.text()).then(
                    data=>{
                        data = JSON.parse(data)
                        
                        console.log( data ) ; 
                        if(data == true ) {
                            description.remove();
                            button.remove() ; 
                        } else {
                            console.log( 'Error occur in server, please check with server.')
                        }
                        
                    }) ; 
                });
    
                tag.appendChild(description);
                tag.appendChild(button);
                displayBoard.appendChild(tag);
            });
            return ; 
        }
    )
    return 0;
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
