const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
const signupForm = document.querySelector('#sign-up-form'); // Ensure the form has an ID 'signup-form'

if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const isSuccessful = true; 

    if (isSuccessful) {
      alert('Sign-up successful! Redirecting to login page...');
      window.location.href = 'index.html'; // Redirect to the login page
    } else {
      alert('Sign-up failed. Please try again.');
    }
  });
}


sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});