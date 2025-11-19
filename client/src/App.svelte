<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Clients from "./pages/Clients.svelte";
  import ResetPassword from "./pages/ResetPassword.svelte";
  import { postFetch } from "./util/fetchUtil";
  import toastr from "toastr";

  let loggedIn = false; 

  async function handleSignOut(e) {
    e.preventDefault();
    const result = await postFetch("/auth/signout"); 

    if (result.success) {
      loggedIn = false; 
      toastr.info(result.message);
      navigate("/", {replace: true});
    } else {
      toastr.error(result.message)
    } 
  };

</script>

<Router>
  {#if loggedIn}
  <nav class="nav-bar">
    <div class="nav-container">
        <div class="nav-left">
            <Link to="/">Home</Link>
            <Link to="/clients">Clients</Link>
        </div>
        
        <div class="nav-title">
            GYM HUB
        </div>

        <div class="nav-right">
            <a href="/" on:click={handleSignOut}>Sign out</a>
        </div>
    </div>
  </nav>
  {/if}

  <div>
    <!-- Home -->
     <Route path="/">
      {#if loggedIn}
        <Home> </Home>
      {:else}
        <Login bind:loggedIn></Login>
      {/if}
    </Route>

    <!-- Users -->
     <Route path="/clients">
     {#if loggedIn}
      <Clients></Clients>
     {:else}
     <Login bind:loggedIn></Login>
     {/if}
     </Route>

    <!-- Reset Password -->
     <Route path="/reset-password">
     {#if loggedIn}
     <Home> </Home>
     {:else}
     <ResetPassword></ResetPassword>
     {/if}
    </Route>

  </div>
</Router>

<style>
  .nav-bar {
      position: fixed; 
      top: 0;
      left: 0;
      width: 100%;
      
      background-color: #ffffff;
      color: #f7f7f7; 
      padding: 0 30px; 
      height: 60px; 
      
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
  }

  .nav-container {
      max-width: 1280px;
      width: 100%; 
      margin: 0 auto; 
      height: 100%; 
      
      display: grid;
      grid-template-columns: 1fr 1fr 1fr; 
      align-items: center; 
  }

  .nav-left {
      display: flex; 
      align-items: center;
      gap: 20px;
  }

  .nav-title {
      color: #000000; 
      font-size: 1.5em; 
      font-weight: 700; 
      text-align: center; 
      margin-left: -45px;
  }

  .nav-right {
      display: flex;
      align-items: center;
      justify-content: flex-end; 
  }

  .nav-left a,
  .nav-right a { 
      color: #000000;
      text-decoration: none;
      padding: 5px 0;
      font-weight: 500;
      transition: color 0.2s;
  }

  .nav-left a:hover,
  .nav-right a:hover {
      color: #565656;
      border-bottom: 2px solid #5aa7ff; 
  }

  :global(body) {
      padding-top: 60px; 
  }
</style>