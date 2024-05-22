import * as mb from '../database.mjs';
// import { updateUsertoDB } from '../database.mjs';

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

function signup() {
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

    mb.updateUsertoDB( UserDetails ) ; 

    // options = {
    //     hostname: 'localhost',
    //     port: 3000,
    //     path: '/update_user',
    //     method: "GET",
    //     headers: {
    //         'Content_Type': 'application/json'
    //     }
    // };

    // const req = http.request( options, (res)=> {
    //     // TBD
    //     // callback
    // });

    // req.on('error', (e)=>{
    //     console.error(`Problem with request: ${e.message}`);
    // })

    // req.write(UserDetails)
    // req.end()
}

async function getNamelist( username ) {
    try {
        const dbUserDetails = await mb.listUsers();
        // console.log( dbUserDetails.includes(username) ); 
        return dbUserDetails.includes(username) ; 
    } catch (err) {
        console.error('Error fetching: ', err);
    }
};

function login() {
    let username = "FL";
    let password = "Admin1234578";
    // let email = document.querySelector("#login_username").value;
    // let password = document.querySelector("#login_password").value;
    // let errorText = document.querySelector("#login_error");

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
                console.log('Username exsist:', isusername);

                if( validationOfUsername == true ){
                    // console.log("username is true") ; 
                    // ---------------- CHECKING PASSWORD ----------------------
                    let passwordVariable;
                    let sta = mb.getPassword(username) ; 
                    sta.then(ispassword => {
                            if (ispassword) {
                                passwordVariable = ispassword; 
                                // console.log('Password:', passwordVariable);

                                // if password match
                                if ( passwordVariable == password ){
                                    // console.log("password match") ; 
                                    // localStorage.setItem('isLoggedIn', 'true');
                                    window.location = 'homepage';
                                } else {
                                    // password not match 
                                    // console.log("incorrect password ") ; 
                                    // errorText.textContent = 'Invalid username or password.';
                                }

                            } else {
                                console.log('no password set');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching password:', error);
                        });
            
            
                } else {
                    console.log("username is false") ; 
                    // errorText.textContent = 'Invalid username or password.';
                }


            } else {
                // errorText.textContent = 'Invalid username or password.';
                console.log('User not found');
            }
        })
        .catch(error => {
            // errorText.textContent = 'Invalid username or password.';
            console.error('Error fetching username:', error);
        });
} ; 

function init() {
    const SignupButton = document.querySelector("#signupbutton");
    SignupButton.addEventListener('click', signup);

    const LoginButton = document.querySelector("#loginbutton");
    LoginButton.addEventListener('click', login);

    let passwordSignUpInput = document.querySelector("#signup_password");
    let passwordloginInput = document.querySelector("#login_password");
    let passwordLoginHide = document.querySelector("#toggle_password");
    let passwordSignUpHide = document.querySelector("#toggle_signup_password");
    passwordLoginHide.addEventListener('click', function() {
        if (passwordloginInput.type === 'password') {
            passwordloginInput.type = 'text';
            passwordLoginHide.textContent = 'Hide';
            console.log("clicked") ; 
        } else {
            passwordloginInput.type = 'password';
            passwordLoginHide.textContent = 'Show';
            console.log("clicked") ; 
        }
    });

    passwordSignUpHide.addEventListener('click', function() {
        if (passwordSignUpInput.type === 'password') {
            passwordSignUpInput.type = 'text';
            passwordSignUpHide.textContent = 'Hide';
        } else {
            passwordSignUpInput.type = 'password';
            passwordSignUpHide.textContent = 'Show';
        }
    });

}

window.addEventListener('load', init);


// async function printnamelist()  {
//     try {
//         const dbUserDetails = await mb.listUsers();
//         if (dbUserDetails) {
//             console.log("Name list: " + dbUserDetails);
//         } else {
//             console.log('User not found');
//         }
//     } catch (err) {
//         console.error('Error fetching: ', err);
//     }
// };
