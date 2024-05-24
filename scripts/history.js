// import * as mb from '../database.mjs';

function load_history() {
    const displayBoard = document.getElementById('history_list') ; 
    let his_list ;

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
