<script>
    import { postFetch } from "../util/fetchUtil";
    import toastr from 'toastr';

    let email = $state("");
    let password = $state("");
    let name = $state("");
    let mode = $state("login");
    let { loggedIn = $bindable() } = $props(); // allows parent (App) to bind login

    async function handleLogin() {
        const user = { 
            email: email,
            password: password
        }

        const result = await postFetch("/api/auth/login", user);

        if (result && result.success) { 
            toastr.success(result.message || "Login successful!");
            loggedIn = true; 
        } else {
            toastr.error(result.message)
        }
    };

    async function handleNewUser() {

        if (email.length < 5 && password.length < 5 ) {
            toastr.warning("You need to provide at least 5 characters");
            return;
        }
        
        const newUser = { 
            name: name,
            email: email,
            password: password
        }

        const result = await postFetch("/api/auth/register", newUser);

        if (result && result.success) {
            toastr.success("You successfully created a new user. Please sign in.")
            mode = "login";
            email = "";
            password = "";
        } else {
            toastr.error(result.message);
        }
    };

    async function handleForgotuser() {
        const result = await postFetch("/api/auth/forgot-password", {email}); 

        if (result && result.success) {
            toastr.success('Check your e-mail');
        } else {
            toastr.error(result.message);
        }
    };
 
</script>

<h1>GYM HUB</h1>

{#if mode==="login"}
<div class="login-form">
    <h3>Enter your login</h3>
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <input type="password" bind:value={password} placeholder="Please enter your password">
    <button class="login-button" onclick={handleLogin}>Login</button>

    <div class=bottom-buttons>
        <button class="new-user-button" onclick={() => mode = "newUser"}>Create an account</button> 
        <button class="forgot-p-button" onclick={() => mode = "forgotLogin"}>Forgot password?</button>
    </div>
</div>

{:else if mode==="newUser"}
<div class="login-form">
    <h3>Create a user</h3>
    <input type="name" bind:value={name} placeholder="Please enter your name">
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <input type="password" bind:value={password} placeholder="Please enter your password">
    <button class="new-user-button" onclick={handleNewUser}>Create User</button>

    <div class=bottom-buttons>
        <button class="login-button" onclick={() => mode="login"}>Already a user?</button>
        <button class="forgot-p-button" onclick={() => mode="forgotLogin"}>Forgot your password?</button>
    </div>
</div>

{:else if mode==="forgotLogin"}
<div class="login-form">
    <h3>Did you forget your login?</h3>
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <button class="forgot-p-button" onclick={handleForgotuser}>Reset password</button>

    <div class=bottom-buttons>
    <button class="login-button" onclick={() => mode="login"}>Already a user?</button>
    <button class= "new-user-button" onclick={() => mode="newUser"}>Create an account</button>
    </div>
</div>
{/if}

<style>
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 250px;
        margin: 2rem auto;
    }

    input {
        padding: 0.5rem;
        border-radius: 6px;
        border: 1px solid #ccc;
    }

    button {
        padding: 0.5rem;
        border: none;
        border-radius: 6px;
        color: white;
        cursor: pointer;
        font-size: 0.9rem;
        transition: background-color 0.2s;
    }

    .login-button {
        background-color: #007bff;
    }
    .login-button:hover {
        background-color: #0056b3;
    }

    .new-user-button {
        background-color: #28a745;
    }
    .new-user-button:hover {
        background-color: #1e7e34;
    }

    .forgot-p-button {
        background-color: #dc3545;
    }
    .forgot-p-button:hover {
        background-color: #a71d2a;
    }

    .bottom-buttons {
    display: flex;
    justify-content: space-between; 
    gap: 0.5rem; 
    margin-top: 0.5rem;
    }
</style>