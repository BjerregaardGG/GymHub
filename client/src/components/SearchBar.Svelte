<script>
    import { onMount } from "svelte";
    import { getFetch } from "../util/fetchUtil.js"; 
    import toastr from 'toastr';
    import {Link} from "svelte-routing";

    let username = $state("");
    let users = $state([]);

    async function loadUsers(){
        const result = await getFetch("/api/users"); 

        if (!result) {
            toastr.error("Could not load users");
        } else {
            users = result.data; 
            console.log(users); 
        }
    }; 

    onMount(loadUsers); 

    // makes sure that we update filteredUsers when the data changes
    let filteredUsers = $derived(users.filter(user => 
        user.name.toLowerCase().includes(username.toLowerCase())
    ));


</script>

<div class="user-search">
    <input
        type="text"
        placeholder="Search for users" bind:value={username}
        class="search-input"
    />

    {#if username.trim() !== ""}
        <ul class="search-results">
            {#if filteredUsers.length > 0}
                {#each filteredUsers as user}
                    <p>{user.name}</p>
                {/each}
            {:else}
                <li class="no-results">No users matches the search query</li>
            {/if}
        </ul>
    {/if}
</div>

