<script>
    import { getFetch } from "../../util/fetchUtil.js";
    import { commentsUpdated } from "../../stores/commentStore.js";
    import toastr from "toastr";

    let {workoutID} = $props(); // catch workoutId
    let comments = $state([]);
    let commentsIsExpanded = $state(false);

    function showComments(){
        commentsIsExpanded = !commentsIsExpanded;
    }

    async function getComments() {
        const result = await getFetch(`/api/workouts/${workoutID}/comments`)

        if (!result) {
            toastr.error("Could not load comments");
        } else {
            comments = result.data; 
            console.log($state.snapshot(comments));
        }
    };

    // Runs at mount and everytime store changes
    $effect(() => {
        const updateTrigger = $commentsUpdated; // reaactive trigger --> getComments() is called
        getComments(); 
    });

</script>

<button class="toggle-comments-button" onclick={showComments}>
    {commentsIsExpanded ? `Hide ${comments.length} comments ⬆` : `View ${comments.length} comments ⬇`} 
</button>

{#if commentsIsExpanded }
    <ul class="comments-list">
        {#each comments as comment}
            <li>
                <img 
                    src={`${import.meta.env.VITE_BASE_URL}${comment.image_path}`} 
                    alt={`Profile picture for ${comment.name}`} 
                    id="profile-pic-small"
                />
                <div class="comment-content">
                    <span class="comment-name">{comment.name}</span>
                    <span class="comment-text">{comment.comment}</span>
                    <span class="comment-date">{new Date(comment.date_recorded).toLocaleString()}</span>
                </div>
            </li>
        {/each}
    </ul>
{/if}

<style>
    .comments-list {
        width: 104%;
    }

    ul.comments-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    ul.comments-list li {
        display: flex;
        align-items: flex-start;
        padding: 8px 20px; 
        border-bottom: 1px solid #eee;
        background-color: #f9f9f9;
        border-radius: 6px;
        margin-bottom: 10px;
        gap: 10px;
    }
    
    #profile-pic-small {
        width: 40px;
        height: 40px;
        object-fit: cover;
        border-radius: 50%;
        border: 2px solid #ccc;
        flex-shrink: 0;
    }
    
    .comment-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        flex: 1;
        text-align: left;
    }
    
    .comment-content .comment-name {
        font-weight: 600;
        font-size: 0.95em;
        line-height: 1.2;
        margin-bottom: 2px;
        color: #333;
    }
    
    .comment-content .comment-text {
        font-size: 0.9em;
        line-height: 1.3;
        color: #555;
        margin-bottom: 2px;
    }
    
    .comment-content .comment-date {
        font-size: 0.75em;
        line-height: 1;
        color: #999;
    }
    
    .toggle-comments-button {
        background: none;
        width: 25%;
        border: none;
        color: #007bff;
        cursor: pointer;
        text-align: left;
        padding: 5px 0;
        margin-bottom: 5px;
        font-weight: 600;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        ul.comments-list li {
            background-color: #2a2a2a;
            border-bottom-color: #444;
        }
        #profile-pic-small {
            border-color: #555;
        }
        .comment-content .comment-name {
            color: #ccc;
        }
        .comment-content .comment-text {
            color: #ddd;
        }
        .comment-content .comment-date {
            color: #888;
        }
    }
</style>