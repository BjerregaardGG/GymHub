<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";
    import toastr from 'toastr';

    // let users; 

    /*onMount(async() => {
        const result = await getFetch("/users");

        if (result && result.success) {
            users = result.data; 
            console.log(users);
        } else {
            toastr.error("Could not load users");
        }
    }); */

</script>

<h1>Training Feed</h1>

