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

const clockText    = document.getElementById('clock-text');
const secondHand   = document.getElementById('second-hand');
const hoursInput   = document.getElementById('hours');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

let totalTime = 0;
let timeLeft  = 0;
let timer;
let isPaused  = false;

function playBeep(frequency) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function updateClockText() {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    clockText.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateSecondHand() {
    const totalSeconds = totalTime;
    const elapsedSeconds = totalTime - timeLeft;
    const angle = (((totalTime % 60) / 60) * 360 - 90 - (elapsedSeconds % 60) * 6);
    secondHand.style.transform = `rotate(${angle}deg) translateX(-50%)`;
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateClockText();
            updateSecondHand();
            if (timeLeft <= 5 && timeLeft > 0) {
                playBeep(440);
            } else if ( timeLeft == 0 ) { 
                playBeep(493.8);
            }
        } else {
            clearInterval(timer);
            clockText.textContent = "Time's up!";
            secondHand.style.transform = `rotate(-90deg) translateX(-50%)`;
        }
    }, 1000);
}

function startTheTimer() {
    clearInterval(timer);
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalTime = timeLeft = (hours * 3600) + (minutes * 60) + seconds;
    clockText.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const initialAngle = ((totalTime % 60) / 60) * 360 - 90;
    secondHand.style.transform = `rotate(${initialAngle}deg) translateX(-50%)`;
    secondHand.classList.add('red');
    updateClockText();
    updateSecondHand();
    startTimer();
} ; 

function pauseTheTimer() {
    if (isPaused) {
        startTimer();
        pauseButton.textContent = 'Pause';
    } else {
        clearInterval(timer);
        pauseButton.textContent = 'Resume';
    }
    isPaused = !isPaused;
} ; 

function resetTheTimer() {
    clearInterval(timer);
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalTime = timeLeft = (hours * 3600) + (minutes * 60) + seconds;
    clockText.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    const initialAngle = ((totalTime % 60) / 60) * 360 - 90;
    secondHand.style.transform = `rotate(${initialAngle}deg) translateX(-50%)`;
    pauseButton.textContent = 'Pause';
    isPaused = false;
} ; 

function textfresher() { 
    const title = document.querySelector(".exercise-title") ; 
    const statement = document.getElementById("exercise-statement") ; 

    const user_id = getCookie("user_id") ; 
    const activity_name = getCookie("activity_name") ; 

    let fetch_instance = fetch("/activity_description" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                user_id: user_id , 
                activity_name: activity_name 
            }
        )
    }) ; 

    fetch_instance.then(response => response.text()).then(
        data=>{
            data = JSON.parse(data)
            console.log( data ) ; 
            console.log( activity_name) ; 

            title.textContent = activity_name ; 
            statement.textContent = data["description"] ; 
        }
    )

}


function init() {
    const startButton  = document.getElementById('start');
    const pauseButton  = document.getElementById('pause');
    const resetButton  = document.getElementById('reset');
    const returnButton = document.getElementById('return');

    startButton.addEventListener('click', startTheTimer);
    
    pauseButton.addEventListener('click', pauseTheTimer );
    
    resetButton.addEventListener('click', resetTheTimer );

    returnButton.addEventListener('click' , () => {
        window.location = '/homepage';
    })

    textfresher(); 
}

window.addEventListener('load', init);
