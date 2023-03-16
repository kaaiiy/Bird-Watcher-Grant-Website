import React from 'react'
import '../css/LoginAndRegister.css'
import 'bootstrap/dist/css/bootstrap.min.css'

/*Register Page that uses React JS, HTML, CSS, and Bootstrap 5*/

export function Register() {
  return (
      <div className="wrapper">
        <div className="form">

          <h2 className="mb-3">Register</h2>
          <hr />

          <div className="form-floating mb-2">
            <input type="full-name" className="form-control form-control-lg" id="full-name" placeholder="Full Name"></input>
            <label htmlFor="full-name">Full Name</label>
          </div>

          <div className="form-floating mb-2">
            <input type="email" className="form-control form-control-lg" id="email" placeholder="Email Address"></input>
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="form-floating mb-2">
            <input type="password" className="form-control form-control-lg" id="password" placeholder="Password"></input>
            <label htmlFor="password">Password</label>
            <div id="passwordHelpBlock" class="form-text">
              Must be 6 characters long and not contain spaces
            </div>
          </div>

          <div className="form-floating mb-2">
            <input type="password" className="form-control form-control-lg" id="confirm-password" placeholder="Confirm Password"></input>
            <label htmlFor="confirm-password">Confirm Password</label>
          </div>
          
          <div className = "form-group form-check mb-2">
              <input type = "checkbox" className = "form-check-input"></input>
              <label htmlFor = "check" className = "form-check-label">Sign Up for Grant Updates</label>
          </div>

          <button type="sign up" className="btn btn-success btn-lg w-100 block mt-2">Sign Up</button>

          <div className="link2">
            Already have an account? <a href="/">Sign in</a>
          </div>
        </div>
      </div>
  )
}