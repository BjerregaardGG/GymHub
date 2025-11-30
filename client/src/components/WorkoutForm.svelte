<script>
    import { postFetch } from "../util/fetchUtil.js";
    import toastr from "toastr";

    export let onClose; // callback from Parent (Home)
    let workoutData = { title: "", description: "" };
    
    async function createWorkout(event){
        event.preventDefault();
        const result = await postFetch("/api/workouts", workoutData);

        if (!result) {
            toastr.error("Could not create workout");
        } else {
            toastr.success(result.message)
            onClose();
        }
    };
</script>

<form class="workout-form" onsubmit={createWorkout}>
    <label class="workout-label">Title:
        <input type="text" bind:value={workoutData.title} />
    </label>
    <label class="workout-label">Description:
        <input type="text" bind:value={workoutData.description} />
    </label>
    <button type="submit" class="workout-button">Create workout</button>
</form>

