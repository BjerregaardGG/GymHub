<script>
    import { Link } from "svelte-routing"
    let { friends } = $props();

</script>

<div class="friend-list">
    <h3>Friends</h3>
    <ul class="friend-list-ul"> 
        {#each friends as friend }
            <li class="friend-item">
                <Link to={`/profile/${friend.id}`} class="friend-link" title={`Go to ${friend.name}'s profile`}>
                    <p class="friend-name-text">{friend.name}</p>
                </Link>
                <img 
                    src={friend.image_path} 
                    alt={`Profile picture for ${friend.name}`} 
                    id="profile-pic-small"
                    class:online={friend.isOnline}
                    title={friend.isOnline ? 'Online' : 'Offline'}
                />
            </li>
        {/each}
    </ul>
</div>

<style>
    .friend-list {
        max-width: 100%;
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
        width: 40px; 
        height: 40px; 
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