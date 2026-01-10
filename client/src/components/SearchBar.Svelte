<script>
    import { onMount } from "svelte";
    import { getFetch, postFetch } from "../util/fetchUtil.js"; 
    import { Link } from "svelte-routing";
    import toastr from 'toastr';

    let { following, currentUserID, loadFollowing } = $props();
    
    let username = $state("");
    let users = $state([]);

    async function loadUsers(){
        const result = await getFetch("/api/users"); 

        if (!result) {
            toastr.error("Could not load users");
        } else {
            users = result.data; 
        }
    }; 

    async function followUser(userId){

        const result = await postFetch(`/api/relations/me/following/${userId}`);

        if (!result) {
            toastr.error("Could not follow user");
        }
        
        toastr.success(result.message);

        users = users.map(user =>
            user.id === userId ? // if we find the user 
                { ...user, followStatus: result.status } 
                : user // otherwise return the user
        );

        if (result.status === "ACCEPTED") {
            await loadFollowing(); // we update parent 
            await loadUsers(); // we update local users
        }
    }

    onMount(loadUsers); 

    // makes sure that we update filteredUsers when the data changes
    let filteredUsers = $derived(users.filter(user => 
        user.name &&
        user.name.toLowerCase().includes(username.toLowerCase()) &&
        user.id !== currentUserID
    ));

</script>

<div class="user-search">
    <input
        type="text"
        placeholder="Search for users 🔎" bind:value={username}
        class="search-input"
    />

    {#if username.trim() !== ""}
        <ul class="search-results">
            {#if filteredUsers.length > 0}
                {#each filteredUsers as user}
                <li>
                    <!-- If we already follow-->
                    {#if following.some(following => following.id == user.id)}
                        <Link to={`/profile/${user.id}`} class="friend-link" title={`Go to ${user.name}'s profile`}>
                            <p class="friend-name-text">{user.name}</p>
                        </Link>
                    <!-- if follow status is pending -->
                    {:else if user.followStatus === 'PENDING'}
                        <p class="friend-name-text not-friend">{user.name}</p>
                        <button disabled class="pending-btn">
                            Pending ⏳
                        </button>
                    {:else}
                        <p class="friend-name-text not-friend">{user.name}</p>
                        <button onclick={() => followUser(user.id)} title="Follow user">
                            Follow
                        </button>
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
.user-search {
    position: relative;
    width: 88%;
    margin: 0 auto;
    margin-top: 20px; 
    margin-left: 2px;
}

.search-input {
    width: 100%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc;
    border-radius: 6px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.search-results {
    position: absolute;
    width: 100%;
    max-height: 250px;
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

.pending-btn {
    background: #d27e43;
    color: #666;
    cursor: not-allowed;
}

.no-results {
    padding: 10px;
    color: #888;
    font-style: italic;
}

.search-results li {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    transition: background-color 0.2s;
}

.search-results li:hover {
    background-color: #f6f6f6;
}

:global(.friend-link) {
    text-decoration: none;
    color: #333;
}

.friend-name-text, .not-friend {
    flex-grow: 0;
    margin: 0;
}

.not-friend {
    cursor: default;
}

:global(.friend-link):hover .friend-name-text {
    color: #007bff;
    text-decoration: none; 
    cursor: pointer;
}

button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    flex-shrink: 0; 
    line-height: 1.2; 
    font-size: 0.9em;
    margin-left: auto;
}

button:hover {
    background-color: #45a049;
}

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
    :global(.friend-link), .friend-name-text {
        color: #ddd;
    }
    :global(.friend-link):hover .friend-name-text {
        color: #72baff;
    }
}


</style>