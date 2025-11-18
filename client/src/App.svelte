<script>
  import { Router, Link, Route, navigate } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
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
  <nav>
    <Link to="/">Home</Link>
    <Link to="/users">Users</Link>
    <a href="/" on:click={handleSignOut}>Sign out</a>
  </nav>

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
     <Route path="/users">
     {#if loggedIn}
      <Home> </Home> <!-- Change to user route -->
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
