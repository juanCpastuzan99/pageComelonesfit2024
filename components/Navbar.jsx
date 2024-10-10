import Link from "next/link"
const Navbar= ()=>{
   
return ( <div>
  
<nav class="navbar navbar-expand-lg bg-body-secondary">
  <div class="container">
    <Link class="navbar-brand" href="/">ComelonesFit</Link>
    <Link class="navbar-brand" href="/signUp">Sing up</Link>
    <Link class="navbar-brand" href="/login">Login</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/">Home</a>
        </li>
        <li class="nav-item">
          <Link class="nav-link" href="/services">Services</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" href="/about">About</Link>
        </li>
        <li class="nav-item">
          <a class="nav-link enable" aria-disabled="true"></a>
        </li>
      </ul>

    </div>
  </div>
</nav>
</div> 




)
}
export default Navbar