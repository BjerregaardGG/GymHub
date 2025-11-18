<script>
  import { Router, Link, Route } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import ResetPassword from "./pages/ResetPassword.svelte";

  let loggedIn = false; 

</script>

<Router>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/users">Users</Link>
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
