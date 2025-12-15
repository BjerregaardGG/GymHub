<script>
    import { Link } from "svelte-routing"
    let { following } = $props();

</script>

<div class="friend-list">
    <h3>Following ({following.length})</h3>
    <ul class="friend-list-ul"> 
        {#each following as user }
            <li class="friend-item">
                <Link to={`/profile/${user.id}`} class="friend-link" title={`Go to ${user.name}'s profile`}>
                    <p class="friend-name-text">{user.name}</p>
                </Link>
                <img 
                    src={`${import.meta.env.VITE_BASE_URL}${user.image_path}`} 
                    alt={`Profile picture for ${user.name}`} 
                    id="profile-pic-small"
                    class:online={user.isOnline}
                    title={user.isOnline ? 'Online' : 'Offline'}
                />
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
    
    .friend-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #eee;
    }
        
    .friend-item p {
        margin: 0;
        font-weight: 500;
        color: #333;
    }
    
    #profile-pic-small {
        width: 30px; 
        height: 30px; 
        object-fit: cover; 
        border-radius: 50%; 
        border: 2px solid #D32F2F; /* Lidt dyb rød for offline */
        margin-left: 10px;
        transition: border-color 0.3s ease; /* Giver en pæn overgang */
    }
    
    #profile-pic-small.online {
        border-color: #4CAF50; 
        box-shadow: 0 0 5px rgba(76, 175, 80, 0.7); 
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