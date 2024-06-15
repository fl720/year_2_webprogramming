
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function stringToHash(string) {

    let hash = 0;

    if (string.length == 0) return hash;

    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} ; 

function validatePassword(password) {
    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter;
} ; 

async function signup() {
    console.log( "clicked button " ) ; 
    let f_name = document.querySelector("#signup_f_name").value;
    let l_name = document.querySelector("#signup_l_name").value;
    let username = document.querySelector("#signup_username").value;
    let email = document.querySelector("#signup_email").value;
    let password = document.querySelector("#signup_password").value;
    let errorText = document.querySelector("#signup_error");

    if (f_name==="" || l_name==="" || username === "" || email === "" || password === "") {
        errorText.textContent = 'Please fill in all fields';
        return 0; 
    } else if (validateEmail(email) === false) {
        errorText.textContent = 'Please fill in a valid email';
        return 0 ; 
    } else if (validatePassword(password) === false) {
        errorText.textContent = 'Please fill in a valid password';
        return 0 ; 
    } 
    
    password = stringToHash( password ) ; 
    
    let fetch_instance = fetch("/signup" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                f_name: f_name , 
                l_name: l_name ,
                username: username ,
                password: password ,
                email: email
            }
        )
    }) ; 

    fetch_instance.then(response => response.text()).then(
        data=>{
            data = JSON.parse(data)
            if (data["usernameExist"] == true ){
                errorText.textContent = 'username existed, please use another username'
            } else {
                if( data["user_id"] == -1 ){
                    errorText.textContent = 'Error in server, please re-signup.'
                }
                else{
                    setCookie( 'user_id' , data["user_id"] , 1 ) ; 
                    setCookie( 'username' , username , 1 ) ; 
                    window.location = '/homepage';
                }
            }
        }
    )

    return 0;

} ; 

async function login() {
    console.log( "clicked button " ) ; 
    let username = document.querySelector("#login_username").value;
    let password = document.querySelector("#login_password").value;
    let errorText = document.querySelector("#login_error");

    if (username === "" || password === "") {
        errorText.textContent = 'Please fill in all fields';
        return 0 ; 
    } else { 
        errorText.textContent = '';
    }

    password = stringToHash( password ) ; 
    
    let fetch_instance = fetch("/get_login" , {
        method: "POST" , 
        headers :{
            "Content-type":"application/json"
        },
        body: JSON.stringify(
            {
                username: username ,  
                password: password
            }
        )
    }) ; 
    fetch_instance.then(response => response.text()).then(
        data=>{
            data = JSON.parse(data)
            
            console.log( data ) ; 
            if (data["usernameExist"] == false ){
                errorText.textContent = 'Incorrect username or password.'
            } else {
                if( data["password"] == false ){
                    errorText.textContent = 'Incorrect username or password.'
                }
                else{
                    setCookie( 'user_id' , data["user_id"] , 1 ) ; 
                    setCookie( 'username' , username , 1 ) ; 
                    window.location = '/homepage';
                }
            }
        }
    )

    return 0;
} ; 


function init() {
    const SignupButton = document.getElementById('signup_button');
    SignupButton.addEventListener('click', signup);

    const LoginButton = document.getElementById('login_button');
    LoginButton.addEventListener('click', login);
}

window.addEventListener('load', init);

