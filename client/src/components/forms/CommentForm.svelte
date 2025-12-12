<script>
    import { postFetch } from "../../util/fetchUtil.js";

    let {workoutID} = $props(); // catch workoutId

    let commentData = $state({ 
        workout_id: workoutID,
        comment: "",
    });

    async function createComment(event){
        event.preventDefault();

        const result = await postFetch("/comments", commentData);

        if (!result) {
            toastr.error("Could not create workout");
        } else {
            toastr.success(result.message)
        }
    };

</script>

<form class="comment-form" onsubmit={createComment}>
    <h2>Add comment</h2>
    <label class="comment-label">Comment:
        <input type="text" bind:value={commentData.comment} required/>
    </label>

    <button type="submit" class="commet-button">Post your comment</button>
</form>

