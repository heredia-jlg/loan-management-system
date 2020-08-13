window.onload = () => {
    addNavBar();
}
console.log('hello world')

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


function addNavBar() {
    console.log('adding the nav bar');
    let body = document.getElementsByTagName('body')[0];
    let div = document.createElement('div');
    div.innerHTML = navbar;
    body.insertBefore(div, body.childNodes[0])

    //let authent = document.getElementById('authent')
    //authent.innerHTML = unauthenticated;

    //document.getElementById('login').addEventListener('click', authenticate);
    //document.getElementById('username').onkeydown=checkEnter;
}