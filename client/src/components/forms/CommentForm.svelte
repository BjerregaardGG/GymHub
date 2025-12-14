<script>
    import { postFetch } from "../../util/fetchUtil.js";
    import { triggerCommentUpdate } from "../../stores/commentStore.js"; 
    import toastr from "toastr";

    let {workoutID} = $props(); // catch workoutId
    let commentFormIsExpanded = $state(false)

    function showCommentForm(){
        commentFormIsExpanded = !commentFormIsExpanded;
    }

    let commentData = $state({ 
        workout_id: workoutID,
        comment: "",
    });

    async function createComment(event){
        event.preventDefault();

        const result = await postFetch("/api/comments", commentData);

        if (!result) {
            toastr.error("Could not create workout");
        } else {
            toastr.success(result.message)
            commentData.comment = "";
            triggerCommentUpdate(); 
            commentFormIsExpanded = false; 
        }
    };

</script>

<button class="toggle-form-button" onclick={showCommentForm}>
    {commentFormIsExpanded ? 'Cancel' : 'Add a'} comment
</button>

{#if commentFormIsExpanded}
    <form class="comment-form" onsubmit={createComment}>
        <label class="comment-label">
            <input type="text" bind:value={commentData.comment} required/>
        </label>

        <button type="submit" class="comment-button">➤</button>
    </form>
{/if}

<style>
    .toggle-form-button {
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
    
    .comment-form {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 0;
        border-top: 1px solid #eee;
    }
    
    .comment-label {
        flex-grow: 1; 
    }
    
    .comment-form input[type="text"] {
        width: 100%;
        padding: 8px 10px;
        border: 1px solid #ddd;
        border-radius: 20px; 
        box-sizing: border-box;
    }
    
    .comment-button {
        padding: 8px 12px;
        border-radius: 50%; 
        background-color: #007bff;
        color: white;
        font-size: 1.1em;
        line-height: 1;
        border: none;
        transition: background-color 0.2s;
        flex-shrink: 0; 
    }
    
    .comment-button:hover {
        background-color: #0056b3;
    }
    
    @media (prefers-color-scheme: dark) {
        .comment-form {
            border-top-color: #444;
        }
        .comment-form input[type="text"] {
            background-color: #333;
            border-color: #555;
            color: #eee;
        }
        .toggle-form-button {
            color: #5aa7ff;
        }
    }

</style>

