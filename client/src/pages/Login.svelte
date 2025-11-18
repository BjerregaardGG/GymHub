<script>
    import { postFetch } from "../util/fetchUtil";
    import toastr from 'toastr';

    let email = "";
    let password = "";
    let mode = "login";
    let errorMessage = "";
    export let loggedIn = false;

    async function handleLogin() {
        const user = { 
            email: email,
            password: password
        }

        const result = await postFetch("/auth/login", user);
        console.log(result);

        if (result.success) {
            loggedIn = true; 
        } else {
            toastr.error(result.message);
        }
    }

    async function handleNewUser() {
        const newUser = {
            email: email, 
            password: password
        }

        const result = await postFetch("/auth/createuser", newUser);
        console.log(result);

        if (result.success) {
            loggedIn = true; 
        } else {
            toastr.error(result.message); 
        }
    }

    async function handleForgotuser() {
        const result = await postFetch("/auth/forgotpassword", {email}); 
        console.log(result); 

        if (result.success) {
            toastr.success('Check your e-mail');
        } else {
            toastr.error(result.message); 
        }
    }
 
</script>

<h1>Welcome to the Login Page</h1>

{#if mode==="login"}
<div class="login-form">
    <h3>Enter your login</h3>
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <input type="password" bind:value={password} placeholder="Please enter your password">
    <button class="login-button" on:click={handleLogin}>Login</button>

    <div class=bottom-buttons>
        <button class="new-user-button" on:click={() => mode = "newUser"}>Create an account</button> 
        <button class="forgot-p-button" on:click={() => mode = "forgotLogin"}>Forgot password?</button>
    </div>
</div>

{:else if mode==="newUser"}
<div class="login-form">
    <h3>Create a user</h3>
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <input type="password" bind:value={password} placeholder="Please enter your password">
    <button class="new-user-button" on:click={handleNewUser}>Create User</button>

    <div class=bottom-buttons>
        <button class="login-button" on:click={() => mode="login"}>Already a user?</button>
        <button class="forgot-p-button" on:click={() => mode="forgotLogin"}>Forgot your password?</button>
    </div>
</div>

{:else if mode==="forgotLogin"}
<div class="login-form">
    <h3>Did you forget your login?</h3>
    <input type="email" bind:value={email} placeholder="Please enter your email">
    <button class="forgot-p-button" on:click={handleForgotuser}>Reset password</button>

    <div class=bottom-buttons>
    <button class="login-button" on:click={() => mode="login"}>Already a user?</button>
    <button class= "new-user-button" on:click={() => mode="newUser"}>Create an account</button>
    </div>
</div>
{/if}

<slot></slot>

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

    /* Primær login-knap (blå) */
    .login-button {
        background-color: #007bff;
    }
    .login-button:hover {
        background-color: #0056b3;
    }

    /* Create user-knap (grøn) */
    .new-user-button {
        background-color: #28a745;
    }
    .new-user-button:hover {
        background-color: #1e7e34;
    }

    /* Forgot password-knap (rød) */
    .forgot-p-button {
        background-color: #dc3545;
    }
    .forgot-p-button:hover {
        background-color: #a71d2a;
    }

    .bottom-buttons {
    display: flex;
    justify-content: space-between; /* knapperne fordeles med plads imellem */
    gap: 0.5rem; /* valgfri afstand mellem knapperne */
    margin-top: 0.5rem;
    }
</style>