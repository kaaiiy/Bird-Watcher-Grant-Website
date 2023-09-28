import {React, useState} from 'react'
import '../css/AdminSubAppForm.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/analytics';
import 'firebase/compat/database';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, child, get, onValue, push, update } from 'firebase/database';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'


/*Login Page for Admins that uses React JS, HTML, CSS, and Bootstrap 5*/
const adminFirebaseConfig = {
    apiKey: "AIzaSyB0pkdIGT5RiCe5jPY2628O27X_sTk3Xn4",
    authDomain: "team-pwd-admin.firebaseapp.com",
    projectId: "team-pwd-admin",
    storageBucket: "team-pwd-admin.appspot.com",
    messagingSenderId: "445587795844",
    appId: "1:445587795844:web:9b1ed3d5902ddca9d577d1",
    measurementId: "G-0FLPMK8X2Z"
};

const firebaseConfig = {
    apiKey: "AIzaSyCzdnLMAkegsr-zrw9O63Nlu6Ft_Urdw50",
    authDomain: "team-pwd.firebaseapp.com",
    projectId: "team-pwd",
    storageBucket: "team-pwd.appspot.com",
    messagingSenderId: "129648865838",
    appId: "1:129648865838:web:9713fb401ac09b481e25bf",
    measurementId: "G-6FM488KSS5"
  };

 // Initialize Firebase for admins
const adminApp = firebase.initializeApp(adminFirebaseConfig, 'admin-app');
console.log(adminApp);
const databaseAdmin = getDatabase(adminApp);
const adminAuth = adminApp.auth();

// User information for comments
var userEmail = null;
const auth = getAuth();
onAuthStateChanged(auth, (currentUser)=>{
    if(currentUser){
        console.log(currentUser.email);
        userEmail = currentUser.email;
    }else{
        console.log('no one logged in');
    }
})

// Initialize Firebase for users
const app = firebase.initializeApp(firebaseConfig, 'my-app');
console.log(app);
const database = getDatabase(app);

//done is used so that the function can run onLoad but is only used once
//to check if 
let done = false;
onAuthStateChanged(adminAuth, (currentUser) => {
  if (currentUser && !done) {
    //admin user is signed in
    done = true;
    return;
  } 
  else if(!currentUser && !done) {
    // User is signed out
    //hide the webpage if no viable admin user
    done = true;
    document.getElementById('adminSubAppFormWrapper').style.visibility = "hidden";
    window.location.href = '/';
    console.error(401);
    return;
  }
  return;
});

export function AdminSubAppForm() {
    const getInitialState = () =>{
        const value = "Grade";
        return value;
    }

    const [grade, setGrade] = useState(getInitialState);

    const handleChange = (e) => {
        setGrade(e.target.value);
    };
    function handleInfoDisplay(field, id) {
        app.auth().onAuthStateChanged((user) => {
            if(user) {
                const uid = user.uid;
                const dbRef = ref(database);
                // get data from database as a JSON object, and get each field
                // path temporarily hardcoded
                get(child(dbRef, 'users/' + 'zPUcMiHBRIeGxQTufE2r66oiyc82' + '/forms/steve_stocking')).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        document.getElementById(id).value = data[field];
                    } else {
                        console.log("NO DATA");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }
    function handleURLDisplay(field, id) {
        app.auth().onAuthStateChanged((user) => {
            if(user) {
                const uid = user.uid;
                const dbRef = ref(database);
                // get data from database as a JSON object, and get each field
                // path temporarily hardcoded
                get(child(dbRef, 'users/' + 'zPUcMiHBRIeGxQTufE2r66oiyc82' + '/forms/steve_stocking')).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        document.getElementById(id).href = data[field];
                    } else {
                        alert("Document not found");
                        console.log("NO DATA");
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        });
    }

    function getComments(){
        const databaseAdmin = firebase.database(adminApp);

        var pastComments = databaseAdmin.ref('users/commentHistory');
        pastComments.on('value', (snapshot) => {
            let commentsHTML = '';
            snapshot.forEach((snapshot) => {
                const commenter = snapshot.val().commenter;
                const comment = snapshot.val().comment;
                if (snapshot.val().grade != null){
                    commentsHTML += commenter + " | Grade : " + snapshot.val().grade + "<br />" + "&emsp;" + comment + "<br />";
                }else{
                    commentsHTML += commenter + " | Grade : NONE" + "<br />" + "&emsp;" + comment + "<br />";
                }
  
            })
            updateCommentSection(commentsHTML);
        })
    }

    function updateCommentSection(commentsHTML) {
        var prevComments = document.getElementById("prev-comments");
        prevComments.innerHTML = commentsHTML;
    }
    getComments();

    function postComment(){
        var newComment = document.getElementById("new-comment").value;
        document.getElementById("addCommmentButton").id = "addCommmentButton";

        const databaseAdmin = firebase.database(adminApp);
       // const userId = user.uid;
       var pastComments = null;
       if(grade != "Grade"){
            var pastComments = {
                commenter: userEmail,
                comment: newComment,
                grade: grade
            }
       }else if(newComment == null){
            alert("Comment cannot be blank.");
            return;
       }else{
            alert("A grade must be chosen.");
            return;
       }
        databaseAdmin.ref('users/commentHistory').push(pastComments)
          .then(() => {
          console.log('Data successfully written to the database');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error writing data to the database: ', error);
        });

        document.getElementById('addCommmentButton').addEventListener('onClick');
    }

    return (
        <div className = "wrapper-appform" id="adminSubAppFormWrapper" onLoad="javascript:onAuthStateChanged(adminAuth, adminAuth.currentUser)">
            <div className = "form-appform">
                <div className = "back-button" >
                    <a class="prev-page-link" href="/adminportal"><button class = "button2">Return to Previous Page</button></a>
                </div>
                <div className = "grantTitle">
                    <label for = "title" class = "title">Steve Stocking Youth Environmental Scholarship</label>
                </div>
                <div className = "questionSection">
                <div className = "question">
                        <label for="question4Text" class="question-label">In the text boxes below, please type your name, address, home phone, email, birth date (mm/dd/yy), and your city, state, and ZIP code.</label>
                        <div className = "q4Wrapper-appform">
                            <div class = "row g-3 row-appform">
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "fname">First Name</label>
                                    <input type = "text" id = 'fname' value = '' onLoad = {handleInfoDisplay('firstName', 'fname')} className = "form-control user-info-field" placeholder = "First Name" aria-label= "First Name" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "lname">Last Name</label>
                                    <input type = "text" id = 'lname' value = '' onLoad = {handleInfoDisplay('lastName', 'lname')} className = "form-control user-info-field" placeholder = "Last Name" aria-label= "Last Name" readOnly></input>
                                </div>
                            </div>
                            <div class = "row g-3 row-appform">
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "birthday">Birth Date (mm/dd/yy)</label>
                                    <input type = "text" id = 'birthday' value = '' onLoad = {handleInfoDisplay('birthday', 'birthday')} className = "form-control user-info-field" placeholder = "Birth Date (mm/dd/yy)" aria-label = "Birth Date (mm/dd/yy)" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "email">Email</label>
                                    <input type = "text" id = 'email' value = '' onLoad = {handleInfoDisplay('email', 'email')} className = "form-control user-info-field" placeholder = "Email" aria-label = "Email" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "homephone">Home Phone</label>
                                    <input type = "text" id = 'phone' value = '' onLoad = {handleInfoDisplay('phone', 'phone')} className = "form-control user-info-field" placeholder = "Home Phone" aria-label = "Home Phone" readOnly></input>
                                </div>
                            </div>
                            <div class = "row g-3 row-appform">
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "address">Address</label>
                                    <input type = "text" id = 'address' value = '' onLoad = {handleInfoDisplay('address', 'address')} className = "form-control user-info-field" placeholder = "Address" aria-label = "Address" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "city">City</label>
                                    <input type = "text" id = 'city' value = '' onLoad = {handleInfoDisplay('city', 'city')} className = "form-control user-info-field" placeholder = "City" aria-label = "City" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "state">State</label>
                                    <input type = "text" id = 'state' value = '' onLoad = {handleInfoDisplay('state', 'state')} className = "form-control user-info-field" placeholder = "State" aria-label = "State" readOnly></input>
                                </div>
                                <div class = "col-md col-md-form">
                                    <label class="user-info-label" for = "zip">ZIP Code</label>
                                    <input type = "text" id = 'zip' value = '' onLoad = {handleInfoDisplay('zip', 'zip')} className = "form-control user-info-field" placeholder = "ZIP Code" aria-label = "ZIP Code" readOnly></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className = "question">
                        <label for="question1Text" class="question-label">Are you, or a parent or guardian, a member of the San Joaquin Audubon Society?</label>
                        <div className = "Q1Selection-appform">
                            <input type = 'text' className = "q1select-adminsubappform" id = 'q1' onLoad = {handleInfoDisplay('question1', 'q1')} size = '2' readOnly></input>
                        </div>                      
                    </div>
                    <div className = "question">
                        <label for="question2Text" class="question-label">Do you live in San Joaquin County?</label>
                        <div className = "Q2Selection-appform">
                            <input type = 'text'  className = "q2select-adminsubappform" id = 'q2' onLoad = {handleInfoDisplay('question2', 'q2')} size = '2' readOnly></input>
                        </div>                        
                    </div>
                    <div className = "question">
                        <label for="question3Text" class="question-label">Which camp or program do you want to attend?</label>
                        <div class="wrapper-user-answer">
                            <textarea class="form-control" id = 'q3' rows="4" value = '' onLoad = {handleInfoDisplay('question3', 'q3')} readOnly></textarea>
                        </div>                         
                    </div>
                    
                    <div className = "question">
                        <label for="qLastText" class="question-label">Do you have any feedback for us?</label>
                        <div class="wrapper-user-answer">
                            <textarea className="form-control" id = 'q4' rows="4" value = '' onLoad = {handleInfoDisplay('question4', 'q4')} readOnly></textarea>    
                        </div> 
                    </div>
                </div>
                <div class="file-div">
                    <p><a className = "letterLink" id = "letterLinkID" href='#' target = "blank" onLoad = {handleURLDisplay('urlLinkLetter', 'letterLinkID')}>
                        letter_of_recommendation.pdf</a></p>
                    <p><a className = "essayLink" id = "essayLinkID" href='#' target = "blank" onLoad = {handleURLDisplay('urlLinkEssay', 'essayLinkID')}>
                        personal_essay.pdf</a></p>
                </div>
                <div class="wrapper-admin-feedback">
                    <div class="wrapper-new-comment">
                        <div class="admin-comments">
                            <textarea type="answer" class="form-control admin-comment-box" id="new-comment" aria-describedby="answerHelp" rows = "4"></textarea>
                        </div>
                        <div class="wrapper-feedback-buttons"> 
                            <div class="wrapper-comment-button">
                                <button onClick={postComment} id="addCommmentButton" class="add-comment-button" >Add Comment</button>
                            </div>
                            <div class="wrapper-small-feedback-buttons">
                                <div class="wrapper-status-button">
                                    <select class="form-select" id="floatingSelect" aria-label="Filter drop down menu">
                                        <option selected>Status</option>
                                        <option value="grant">Under Review</option>
                                        <option value="grant">Approved</option>
                                    </select>
                                </div>
                                <div class="wrapper-grade-button">
                                <select class="form-select" id="floatingSelect" aria-label="Filter drop down menu" onChange={handleChange}>
                                        <option value="Grade">Grade</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="wrapper-previous-comments" id="prev-comments">
                    </div>
                </div>
                <div class="back-button">
                    <a class="prev-page-link" href="/adminportal"><button class = "button2">Return to Previous Page</button></a>
                </div>
            </div>
        </div>
    )
}