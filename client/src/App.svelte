<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import { onMount } from "svelte";

  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Friend from "./pages/Friend.svelte";
  import ResetPassword from "./pages/ResetPassword.svelte";
  import WorkoutForm from "./components/forms/WorkoutForm.svelte";

  import { postFetch, getFetch, patchFetch } from "./util/fetchUtil";

  import toastr from "toastr";

  let isPrivate = $state(false);
  let loggedIn = $state(false); 
  let loading = $state(true);

  async function handlePrivateStatusToggle() {
    const result = await patchFetch("/api/users/me/privacy"); 
        
    if (result && result.success) {
        isPrivate = result.is_private; 
        toastr.success(result.message);
    } else {
        toastr.error(result.message);
      }
  }

  // we check if the user is logged in 
  async function checkAuthentication(){
    const result = await getFetch("/api/users/me"); 

    // if success -> we have a session
    if (result && result.success) {
        loggedIn = true; 
        isPrivate = result.is_private;
    } else {
        loggedIn = false;
        isPrivate = false;
    }

    loading = false; 
  };

  onMount(checkAuthentication);

  async function handleSignOut(e) {
    e.preventDefault();
    const result = await postFetch("/api/auth/logout"); 

    if (!result) {
      toastr.error("Could not sign out. Something went wrong.")
    } else {
      loggedIn = false; 
      toastr.info(result.message);
      loading = false;
      navigate("/", {replace: true});
    }
  };
  
</script>

<Router>
  {#if loading}
    <div class="initial-loading">Checking login status</div>

  {:else}
    {#if loggedIn}
    <nav class="nav-bar">
      <div class="nav-container">
          <div class="nav-left">
              <Link to="/">Home</Link>
              <Link to="/postworkout">Post workout</Link>
          </div>
          
          <div class="nav-title">
              <Link to="/">GYM HUB</Link>
          </div>

          <div class="nav-right">
            <a href="/" onclick={handleSignOut}>Sign out</a>
            <button 
                  class="private-toggle-btn" 
                  onclick={handlePrivateStatusToggle} 
                  aria-label="Change profilestatus to {isPrivate ? 'Public' : 'Private'}">
                  {#if isPrivate}
                      🔐 
                  {:else}
                      🔓 
                  {/if}
              </button>
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

     <!-- Post Workout Form-->
    <Route path="/postworkout">
      {#if loggedIn}
      <WorkoutForm onClose={() => navigate("/")}></WorkoutForm>
      <button onclick={() => navigate("/")} class="cancel-button">↩ Cancel</button>
      {:else}
      <Login bind:loggedIn></Login>
      {/if}
    </Route>

    <Route path="/profile/:id" let:params>
      {#if loggedIn}
      <Friend id={params.id}></Friend> <!-- Used by followers & following -->
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
  {/if}
</Router>

<footer class="footer">
  <div class="footer-content">
      &copy; {new Date().getFullYear()} GYM HUB | © 
  </div>
</footer>

<style>

  .initial-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.2rem;
    color: #666;
  }

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

  .private-toggle-btn {
      background: none;
      border: 1px solid #cccccc; 
      color: #000000;
      cursor: pointer;
      font-size: 1em;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
  }

  .private-toggle-btn:hover {
      background-color: #f0f0f0; 
      border-color: #5aa7ff; 
      color: #000000;
  }

  .nav-right {
      display: flex;
      align-items: center;
      justify-content: flex-end; 
      gap: 20px;
  }

  .nav-right a { 
      color: #000000;
      text-decoration: none;
      padding: 5px 0;
      font-weight: 500;
      transition: color 0.2s;
  }

  .nav-right a:hover {
      color: #565656;
      border-bottom: 2px solid #5aa7ff; 
  }


  .footer {
      width: 100%;
      position: fixed; 
      bottom: 0;
      left: 0;

      background-color: #333333; 
      color: #cccccc; 
      padding: 10px 0;
      text-align: center;
      font-size: 0.85em;
      z-index: 999;
      box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1);
  }

  .footer-content {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 20px;
  }

  :global(body) {
      padding-top: 60px; 
      padding-bottom: 40px;
  }
</style>