<script>
    import { postFetch } from "../util/fetchUtil";
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import toastr from 'toastr';

    let token = "";
    let newPassword = "";
    let confirmPassword = "";
    // Get the token from the URL
    onMount(() => {
        const url = new URLSearchParams(window.location.search);
        token = url.get('token') || '';
        
        if (!token) {
            toastr.error("Wrong link or no token recieved.");
        }
    });

    async function handleResetPassword() {
        if (newPassword.length < 4) { 
            toastr.warning("The password needs to be at least 4 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toastr.error("The two passwords does not match.");
            return;
        }

        const tokenAndPassword = { 
            token: token,
            newPassword: newPassword
        };

        const result = await postFetch("/auth/resetpassword", tokenAndPassword);
        console.log(result);

        if (result.success) {
            toastr.success(result.message);
            newPassword = "";
            confirmPassword = "";

            // sends the user back to the login (loggedIn is still false)
            setTimeout(() => {
                navigate("/");
            }, 3000);

        } else {
            toastr.error(result.message);
        }
    }
 
</script>

<h1>Reset your password</h1>
<div class="reset-form"> {#if token}
        <h3>Set new password</h3>
        <p>Please enter your new password:</p>

        <input type="password" bind:value={newPassword} placeholder="New password">
        <input type="password" bind:value={confirmPassword} placeholder="Confirm password">
        
        <button class="forgot-p-button" on:click={handleResetPassword}>Reset password</button>
    {:else}
        <p>Linket er ugyldigt eller udløbet. Prøv venligst at anmode om en ny adgangskode nulstilling fra login siden.</p>
    {/if}
</div>

<style>
    .reset-form {
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

    .forgot-p-button {
        background-color: #dc3545;
        margin-top: 1rem; 
    }
    .forgot-p-button:hover {
        background-color: #a71d2a;
    }
    
    .reset-form p {
        margin-bottom: 0.5rem;
    }
</style>