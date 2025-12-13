<script>
    import { postFetch } from "../../util/fetchUtil.js";
    import { triggerCommentUpdate } from "../../stores/commentStore.js"; 
    import toastr from "toastr";

    let {workoutID} = $props(); // catch workoutId

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
        }
    };

</script>

<form class="comment-form" onsubmit={createComment}>
    <h2>Add comment</h2>
    <label class="comment-label">
        <input type="text" bind:value={commentData.comment} required/>
    </label>

    <button type="submit" class="comment-button">Add a comment</button>
</form>

