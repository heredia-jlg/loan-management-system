
window.onload = () => {
    addNavBar();
    getLoans();
}
function addEventListener() {
    document.getElementById('signup').addEventListener('click', event => {
    event.preventDefault();
    authenticate();
  });
}

function getLoans(){
    console.log("Get loans function was called")
    let xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = loansRetrieved;
	xhttp.open('GET', '/users/getLoans');
	xhttp.setRequestHeader('Content-type',
            'application/x-www-form-urlencoded');
  //let user = document.getElementById('username').value;
  //let password = document.getElementById('password').value;
  xhttp.send('');
            
    function loansRetrieved() {
        console.log("loans Retrieved function was called")
        if (xhttp.readyState == 4 && xhttp.status == 200) {
          usersWithLoans = JSON.parse(xhttp.responseText);
          populatePage(usersWithLoans);
        }
        else if( xhttp.readyState == 4 && xhttp.status == 401 ){
          alert("Password or Username were wrong. Try again.")
        }
    }
}
function actOnLoan(action, loanId, userId){
  console.log("Act on loan function was called")
  let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = didActOnLoan;
xhttp.open('PUT', '/users/actOnLoan');
xhttp.setRequestHeader('Content-type',
          'application/x-www-form-urlencoded');
xhttp.send(action+'='+loanId+'='+userId);
          
  function didActOnLoan() {
      console.log("Did act on loan function was called")
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        usersWithLoans = JSON.parse(xhttp.responseText);
        window.location.reload(true);
      }
      else if( xhttp.readyState == 4 && xhttp.status == 401 ){
        alert("Password or Username were wrong. Try again.")
      }
  }
}


function addNavBar() {
    console.log('adding the nav bar');
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = navbar;
    body.insertBefore(div, body.childNodes[0]);
}


function populateCard(user, loan) {
  console.log('card is being populated');
  let body = document.getElementById('loanApplications');
  let div = document.createElement('div');
  div.innerHTML =`
        <div class="card" style="margin-top: 20px;">
        <div class="card-header">
          ${loan['loan_type']}
        </div>
        <div class="card-body">
          <p style="text-align: right">Account number:  ${user['_id']}</p>
          <h5 class="card-title">${user['lastName']}, ${user['firstName']}</h5>
          <p class="card-text" style="margin-bottom: 40px;">
          risk score: ${user['risk']}
          </p>
          <div class="form-row">
                <div class="form-group col-md-6">
                  <input type="text" class="form-control" id="inputReason" placeholder="Reason">
                </div>
          </div>
          <a href="#" class="btn btn-primary" 
          onclick="approveLoan(this.parentNode.parentNode, ${loan['_id']}, ${user['_id']}
          )">Approve</a>
          <a href="#" class="btn btn-outline-primary"
          onclick="rejectLoan(this.parentNode.parentNode, ${loan['_id']}, ${user['_id']}
          )">Reject</a>
        </div>
        </div>`;
  body.insertBefore(div, body.childNodes[0])
}

function approveLoan(card, loanId, userId){
    card.remove();
    actOnLoan('approved', loanId, userId);
}


function rejectLoan(card, loanId, userId){ 
    console.log('loan is being rejected')
    card.remove();
    actOnLoan('rejected',loanId, userId);
}

function populatePage(usersWithLoans){
  for( i = 0; i < usersWithLoans.length; i++ ){
    user = usersWithLoans[i];
    loans = user['loans'];
    for(j = 0; j < loans.length; j++){
      if(loans[j]['status'] == 'Pending' || loans[j]['status'] == 'Collateral needed')
        populateCard(user, loans[j]);
    }
  }
}


let navbar = 
`
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
