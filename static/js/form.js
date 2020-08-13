
let loggedUser = null
window.onload = () => {
    addNavBar();
    getUser();

}



//Displaying user loans



function populatePage(user){
    let body = document.getElementById('loanInfo');
    let div = document.createElement('div');
    div.innerHTML = `<div id="loanInfoChild"></div>`
    body.insertBefore(div, body.childNodes[0])
    loans = user['loans'];
    for(j = 0; j < loans.length; j++){
        populateCard(user, loans[j]);
    }

}


//displaying loans 
function populateCard(user, loan) {
  console.log('card is being populated');
  let body = document.getElementById('loanInfoChild');
  let div = document.createElement('div');
  div.innerHTML =`
        <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          ${loan['loan_type']}
        </div>
        <div class="card-body">
          <p style="text-align: right">Account number:  ${user['_id']}</p>
          <h5 class="card-title">${user['lastName']}, ${user['firstName']}</h5>
          <p class="text-primary">${loan['status']}</p>
        </div>
        </div>`;
  body.insertBefore(div, body.childNodes[0])
}





//Header
function addNavBar() {
    console.log('adding the nav bar');
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = navbar;
    body.insertBefore(div, body.childNodes[0])
}
function addName(username) {
  console.log('addname was called');
  let body = document.getElementById('navbarNav')
  let div = document.createElement('div');
  div.innerHTML = username
  div.style =  `float:right; margin-left:auto`
  body.insertBefore(div, body.childNodes[10])
}

//Get logged in user
function getUser(){
  console.log("gerUser function was called")
  let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = user;
xhttp.open('GET', '/users');
xhttp.setRequestHeader('Content-type',
          'application/x-www-form-urlencoded');
xhttp.send('')
          
  function user() {
      console.log("user function was called")
      if (xhttp.readyState == 4 && xhttp.status == 200) {
          loggedUser = JSON.parse(xhttp.responseText);
          console.log(loggedUser['firstName']);

        let name = loggedUser['firstName'];
        let last = loggedUser['lastName']
        let username = `<h2>Welcome, ${last} ${name}</h2">`;
          addName(username);
      }
      else if( xhttp.readyState == 4 && xhttp.status == 401 ){
        alert("Password or Username were wrong. Try again.")
      }
  }
}





//initial form 





//Loan selection
function updateLoanForm(obj) {
    let currentFormDiv = document.getElementById('loanInfo');
    currentFormDiv.removeChild(currentFormDiv.childNodes[0]);
    showSelectedLoanForm(obj.value);
}

//funtions to show loan form depending on option
function showSelectedLoanForm(formName) {
  if(formName == 'Show'){
    console.log('show loans was chosen')
    populatePage(loggedUser)
  }else{
      console.log('adding new loan form');
      let body = document.getElementById('loanInfo');
      let div = document.createElement('div');
      if(formName == 'Student'){
        div.innerHTML = student;
      }else if (formName == 'Mortgage'){
        div.innerHTML = mortgage;
      }else if(formName == 'Personal'){
        div.innerHTML = personal;
      }
      body.insertAdjacentElement('afterbegin', div);
      addListenerToSubmitButton(formName);}
}


function addListenerToSubmitButton(formName){
  document.getElementById('applyButton').addEventListener('click', event => {
    event.preventDefault();
    formToList(formName);
})}

function formToList(formName){
  if(formName == 'Student'){
    let university = document.getElementById('inputUniversity').value;
    let graduation = document.getElementById('inputGraduation').value;
    let ssn = document.getElementById('inputSsn').value;
    let loanType = document.getElementById('inputType').value;
    body = loanType+'='+university+'='+graduation+'='+ssn
  }else if (formName == 'Mortgage'){
    let address = document.getElementById('inputAddress').value;
    let amount = document.getElementById('inputAmount').value;
    let loanType = document.getElementById('inputType').value;
    body = loanType+'='+address+'='+amount
  }else if(formName == 'Personal'){
    let use = document.getElementById('inputUse').value;
    let ssn = document.getElementById('inputSSN').value;
    let loanType = document.getElementById('inputType').value;
    
    body = loanType+'='+use+'='+ssn
  }
  submitApplication(body);
}




//Processing loan



//Ajax to save loan application
function submitApplication(body){
  console.log("Submit Application function was called")
  let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = submitted;
xhttp.open('POST', '/users/apply');
xhttp.setRequestHeader('Content-type',
          'application/x-www-form-urlencoded');
  
  xhttp.send(body);
          
  function submitted() {
      console.log("Submitted function was called")
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        response = JSON.parse(xhttp.responseText);
        showResponse(response);
        
      }
      else if( xhttp.readyState == 4 && xhttp.status == 401 ){
        alert("Somthing went wrong. Try again.")
      }
  }
}




//post application process
function showResponse(response){
  let currentFormDiv = document.getElementById('formContent');
  currentFormDiv.removeChild(currentFormDiv.childNodes[1]);
  console.log('form was deleted');

  let body = document.getElementById('formContent');
  let div = document.createElement('div');
  div.innerHTML = responseCard(response);
  body.insertBefore(div, body.childNodes[0])

  if (response == 'Collateral needed' ){
    let body = document.getElementById('collateral');
    let div = document.createElement('div');
    div.innerHTML = 
    `<div class="form-row">
    <div class="form-group col-md-6">
      <input type="text" class="form-control" id="inputName" placeholder="Car">
    </div>
    <div class="form-group col-md-6">
    <input type="text" class="form-control" id="inputSSN" placeholder="Value">
  </div>
    </div>`
    body.insertBefore(div, body.childNodes[0])
  }

}

function responseCard(response){
  return `<div class="card text-center" id="responseCard">
    <div class="card-header">
    You've applied successfuly
    </div>
    <div class="card-body">
    <h5 class="card-title "> ${response}</h5>
    <p class="card-text"></p>
    <div id="collateral"></div>
    <a href="/form" class="btn btn-primary">OK</a>
    </div>
    <div class="card-footer text-muted">
    </div>
    </div>
    `;}

let personal = `
<form style="margin-top: 50px" method="personalLoan">
<div class="form-row">
  <div class="form-group col-md-6">
    <input type="text" class="form-control" id="inputUse" placeholder="Intended use">
  </div>

  <div class="form-group col-md-6">
    <input type="username" class="form-control" id="inputSSN" placeholder="SSN">
  </div>

</div>


<button type="" class="btn btn-primary" id="applyButton">Apply</button>
</form>
`;
let mortgage = `
<form style="margin-top: 50px" method="mortgageLoan">
<div class="form-row">
  <div class="form-group col-md-6">
    <input type="text" class="form-control" id="inputAddress" placeholder="Address of house">
  </div>
  <div class="form-group col-md-6">
    <input type="text" class="form-control" id="inputAmount" placeholder="Cost of house">
  </div>
</div>
</div>

<button type="" class="btn btn-primary" id="applyButton">Sign up</button>
</form>
`;
let student = `
<form style="margin-top: 50px" method="studentLoan">
<div class="form-row">
  <div class="form-group col-md-6">
    <input type="text" class="form-control" id="inputUniversity" placeholder="University">
  </div>
  <div class="form-group col-md-6">

    <label>Expected graduation date</label>
    <input type="date" class="form-control" id="inputGraduation" placeholder="Expected graduation date">
  </div>
  <div class="form-group col-md-6">
  <label>Collateral Info</label>
    <input type="username" class="form-control" id="inputSsn" placeholder="Collateral">
  </div>
</div>
<div class="form-group">
  <input type="text" class="form-control" id="inputMajor" placeholder="Value">
</div>

<button type="" class="btn btn-primary" id="applyButton">Apply</button>
</form>
`;
let navbar = `
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/index">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/login">Log In</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Menu Item</a>
      </li>
    </ul>
  </div>
</nav>
`;