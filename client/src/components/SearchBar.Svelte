<script>
    import { onMount } from "svelte";
    import { getFetch } from "../util/fetchUtil.js"; 
    import toastr from 'toastr';
    import {Link} from "svelte-routing";

    let { friends } = $props();
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

    function addFriend(userId){

    }

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
                <li>   
                    {#if friends.some(friend => friend.id == user.id)}
                        <Link to={`/profile/${user.id}`} class="friend-link" title={`Go to ${user.name}'s profile`}>
                            <p class="friend-name-text">{user.name}</p>
                        </Link>
                    {:else}
                        <Link to={`/profile/${user.id}`} class="friend-link" title={`Go to ${user.name}'s profile`}>
                            <p class="friend-name-text">{user.name}</p>
                        </Link>
                    {/if}
                </li>
                {/each}
            {:else}
                <li class="no-results">No users matches the search query</li>
            {/if}
        </ul>
    {/if}
</div>

<style>
    /* ---------------------------------
     * SEARCH CONTAINER & INPUT
     * --------------------------------- */
    .user-search {
        position: relative;
        width: 300px;
        margin: 0 auto;
        margin-top: 20px; /* Tilføjer lidt luft */
    }

    .search-input {
        width: 100%;
        padding: 10px;
        font-size: 1em;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    /* ---------------------------------
     * SEARCH RESULTS LIST (UL)
     * --------------------------------- */
    .search-results {
        position: absolute;
        width: 100%;
        max-height: 250px; /* Giver mere plads til resultater */
        overflow-y: auto;
        background: #fff;
        border: 1px solid #ccc;
        border-top: none;
        border-radius: 0 0 6px 6px;
        list-style: none;
        padding: 0;
        margin: 0;
        z-index: 10;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
    }
    
    .no-results {
        padding: 10px;
        color: #888;
        font-style: italic;
    }

    /* ---------------------------------
     * LIST ITEM (LI) STYLING
     * --------------------------------- */
    .search-results li {
        display: flex; /* Gør listeelementet til en flex-container */
        justify-content: space-between; /* Fordel indholdet */
        align-items: center;
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
        transition: background-color 0.2s;
    }

    .search-results li:hover {
        background-color: #f6f6f6;
    }

    /* ---------------------------------
     * NAME LINK & TEXT STYLING
     * --------------------------------- */
    .friend-link {
        /* Gælder når brugeren er ven (indeholder kun P-tag) */
        text-decoration: none;
        color: #333;
        flex-grow: 1; /* Tvinger linket til at tage al resterende plads */
        margin-right: 10px; /* Afstand til højre for linket */
    }
    
    /* Gælder når brugeren IKKE er ven (P-tag er ikke en del af <Link>) */
    .search-results li p {
        margin: 0;
        font-weight: 500;
        flex-grow: 1; /* Tillader navnet at udfylde pladsen */
        cursor: pointer;
    }
    
    .friend-link:hover .friend-name-text,
    .search-results li p:hover {
         /* Visuel indikation af, at navnet er klikbart */
        color: #007bff;
        text-decoration: none; 
    }

    /* ---------------------------------
     * ACTION BUTTON (Add friend)
     * --------------------------------- */
    button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
        flex-shrink: 0; /* Sikrer at knappen ikke bliver klemt */
    }

    button:hover {
        background-color: #45a049;
    }
    
    /* Dark Mode (Eksempel) */
    @media (prefers-color-scheme: dark) {
        .search-results {
            background: #2a2a2a;
            border-color: #444;
        }
        .search-results li {
            color: #ddd;
            border-bottom-color: #333;
        }
        .search-results li:hover {
            background-color: #383838;
        }
        .friend-link, .search-results li p {
            color: #ccc;
        }
        .friend-link:hover .friend-name-text,
        .search-results li p:hover {
            color: #72baff;
        }
    }
</style>