<script>
    import { Link } from "svelte-routing"
    import { deleteFetch } from "../../util/fetchUtil"; 
    import toastr from "toastr";

    let { followers, onDelete} = $props();
    let activeMenu = $state(null);

    async function deleteFollower(userId){

        const result = await deleteFetch(`/api/relations/me/followers/${userId}`); 

        if (result && result.success) {
            toastr.success(result.message);
            await onDelete(); 

        } else {
            toastr.error(result.message);
        }
    }

</script>

<div class="friend-list">
    <h3>Followers ({followers.length})</h3>
    <ul class="friend-list-ul"> 
        {#each followers as user (user.id) }
            <li class="friend-item">
                <Link to={`/profile/${user.id}`} class="friend-link" title={`Go to ${user.name}'s profile`}>
                    <p class="friend-name-text">{user.name}</p>
                </Link>
                
                <div class="friend-actions">
                <img 
                    src={`${import.meta.env.VITE_BASE_URL}${user.image_path}`} 
                    alt={`Profile picture for ${user.name}`} 
                    id="profile-pic-small"
                    class:online={user.isOnline}
                    title={user.isOnline ? 'Online' : 'Offline'}
                />

                <div class="menu-wrapper">
                <button class="deleteButton" onclick={() => activeMenu = activeMenu === user.id ? null : user.id} 
                > ⋮ </button>

                {#if activeMenu === user.id}
                    <div class="dropdown-menu">
                            <button class="dropdown-item danger"
                                onclick={() => { deleteFollower(user.id); activeMenu = null; }} > Remove follower
                            </button>
                        </div>
                    {/if}
                </div>
                </div>
            </li>
        {/each}
    </ul>
</div>

<style>
    .friend-list {
        width: 35%;
        max-width: 40%;
        margin-top: 160px;
        padding: 25px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
        
    .friend-list h3 {
        margin-top: 0;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 15px;
        text-align: left;
    }
    
    .friend-list-ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .friend-name-text {
        margin: 0;
        padding: 0;
        text-align: left;
    }

    .friend-item {
        display: flex;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
        position: relative;
    }

    :global(.friend-link) {
        flex: 1;
        display: block;
        padding: 0;
        margin: 0;
    }


    .friend-actions {
        display: flex;
        align-items: center;
     
        position: relative;
    }
        
    .friend-item p {
        margin: 0;
        font-weight: 500;
        color: #333;
    }

    .menu-wrapper {
        position: relative;
    }
    
    #profile-pic-small {
        width: 30px; 
        height: 30px; 
        object-fit: cover; 
        border-radius: 50%; 
        border: 2px solid #D32F2F; 
        margin-left: 10px;
        transition: border-color 0.3s ease; 
    }
    
    #profile-pic-small.online {
        border-color: #4CAF50; 
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.7); 
    }

    .dropdown-menu {
        position: absolute;
        background: #222;
        border-radius: 6px;
        padding: 4px 0;
        margin-top: 4px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        z-index: 10;
    }

    .dropdown-item {
        background: none;
        border: none;
        color: white;
        padding: 8px 16px;
        width: 100%;
        text-align: left;
        cursor: pointer;
    }

    .dropdown-item:hover {
        background: #333;
    }

    .dropdown-item.danger {
        color: #ff5c5c;
    }
    
    @media (prefers-color-scheme: dark) {
        .friend-list {
            background-color: #1a1a1a; 
            border-color: #444;
        }
            
        .friend-list h3 {
            border-bottom: 1px solid #333;
            color: #ddd;
        }
    
        .friend-item {
            border-bottom: 1px solid #333;
        }
            
        .friend-item p {
            color: #fff;
        }
            
        #profile-pic-small {
            /* Dark Mode Offline: Mørkere rød ramme */
            border-color: #B71C1C; 
        }
            
        #profile-pic-small.online {
            /* Dark Mode Online: Grøn ramme */
            border-color: #66BB6A;
            box-shadow: 0 0 5px rgba(102, 187, 106, 0.7);
        }
    }
</style>