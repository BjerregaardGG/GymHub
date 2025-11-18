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
            toastr.succes(result.message);
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
<div class="reset-form">
    {#if token}
        <p>Please enter your new password:</p>

        <input type="password" bind:value={newPassword} placeholder="New password">
        <input type="password" bind:value={confirmPassword} placeholder="Confirm password">
        <button on:click={handleResetPassword}>Reset password</button>
    {:else}
        <p>Vent venligst. Hvis du ikke har modtaget en besked, er linket muligvis ugyldigt.</p>
    {/if}
</div>