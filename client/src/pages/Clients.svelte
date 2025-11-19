<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";
    import { navigate } from 'svelte-routing';
    import toastr from 'toastr';

    let users; 

    onMount(async() => {
        const result = await getFetch("/users");

        if (result && result.success) {
            users = result.data; 
            console.log(users);
        } else {
            toastr.error("Could not access the clients-site. You might not be an admin.");
            setTimeout(() => {
                navigate("/");
            }, 3000);
        }
    });

</script>

<h1>User catalog</h1>

{#each users as user (user.id)}
    <p> {user.name}</p>
{/each}