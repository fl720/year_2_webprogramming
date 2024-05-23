import * as mb from '../database.mjs';

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    const isLengthValid = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    return isLengthValid && hasUppercase && hasLowercase && hasDigit && hasSpecialCharacter;
}

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

    const UserDetails ={
        f_name: f_name , 
        l_name: l_name ,
        username: username ,
        password: password ,
        email: email
    };

    
    try {

        await mb.updateUsertoDB(UserDetails);

        errorText.textContent = 'Signup successful!';

    } catch (error) {

        console.error('Error updating user to DB:', error);

        errorText.textContent = 'Signup failed. Please try again.';

    }
} ; 


async function getNamelist( username ) {
    try {
        const dbUserDetails = await mb.listUsers();
        // console.log( dbUserDetails.includes(username) ); 
        return dbUserDetails.includes(username) ; 
    } catch (err) {
        console.error('Error fetching: ', err);
    }
};

async function login() {
    console.log( "clicked button " ) ; 
    // let username = "FL" ; 
    // let password = "Admin12345" ; 
    let username = document.querySelector("#login_username").value;
    let password = document.querySelector("#login_password").value;
    let errorText = document.querySelector("#login_error");

    if (username === "" || password === "") {
        errorText.textContent = 'Please fill in all fields';
        return 0 ; 
    } 
    
    // ---------------- FIND THE USERNAME IN THE DB OR NOT ---------------------
    let validationOfUsername;
    let res = getNamelist(username ) ; 
    res.then(isusername => {
            if (isusername) {
                validationOfUsername = isusername; 

                if( validationOfUsername == true ){
                    // ---------------- CHECKING PASSWORD ----------------------
                    let passwordVariable;
                    let sta = mb.getPassword(username) ; 
                    sta.then(ispassword => {
                            if (ispassword) {
                                passwordVariable = ispassword; 

                                // ----------- if password match ---------------
                                if ( passwordVariable == password ){
                                    // localStorage.setItem('isLoggedIn', 'true');
                                    console.log("loginning") ; 
                                    window.location = '/homepage';
                                } else { 
                                    errorText.textContent = 'Invalid username or password.';
                                }

                            } else {
                                console.log('no password set');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching password:', error);
                        });
            
            
                } else {
                    errorText.textContent = 'Invalid username or password.';
                }
            } else {
                errorText.textContent = 'Invalid username or password.';
            }
        })
        .catch(error => {
            errorText.textContent = 'Invalid username or password.';
        });
} ; 


function init() {
    const SignupButton = document.getElementById('signup_button');
    SignupButton.addEventListener('click', signup);

    const LoginButton = document.getElementById('login_button');
    LoginButton.addEventListener('click', login);

    // const hindloginpass = document.querySelector('#toggle_password') ; 
    // hindloginpass.addEventListener('change', function() {
    //     const passwordField1 = document.getElementById('login_password');
    //     passwordField1.type = this.checked ? 'text' : 'password';
    //     console.log("clicked") ; 
    // });

    // const hindsignuppass = document.querySelector('#toggle_signup_password')
    // hindsignuppass.addEventListener('change', function() {
    //     const passwordField2 = document.getElementById('signup_password');
    //     passwordField2.type = this.checked ? 'text' : 'password';
    //     console.log("clicked") ; 
    // });
    

}

window.addEventListener('load', init);

