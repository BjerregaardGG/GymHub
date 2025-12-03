<script>
    import { postFetch } from "../util/fetchUtil.js";
    import toastr from "toastr";

    let {onClose} = $props(); // callback from Parent (Home)

    let workoutData = $state({ 
        title: "", 
        description: "",
        exercises: []
    });

    // template for new exercise
    let newExercise = {
        name: "", 
        sets: 0,
        reps: 0, 
        weight_kg: 0
    }

    function addExercise(){
        workoutData.exercises = [ ...workoutData.exercises, newExercise ]
    }

    function removeLatestExercise(index){
        workoutData.exercises.splice(index, 1);
        workoutData.exercises = workoutData.exercises;
    }

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
    <h2>Workout formular</h2>
    <label class="workout-label">Title:
        <input type="text" bind:value={workoutData.title} required/>
    </label>
    <label class="workout-label">Description:
        <input type="text" bind:value={workoutData.description} required/>
    </label>

    <hr>
    <h2>Add exercises</h2>
    {#each workoutData.exercises as exercise, index}
        <div class="exercise-group">
            <h4>Exercise {index+1}</h4>

            <label>Name:
                <input type="text" bind:value={exercise.name} required />
            </label>
            
            <label>Sets:
                <input type="number" min="1" bind:value={exercise.sets} required />
            </label>

            <label>Reps:
                <input type="number" min="1" bind:value={exercise.reps} required />
            </label>

            <label>Weight (kg):
                <input type="number" min="0" step="0.5" bind:value={exercise.weight_kg} />
            </label>

            <button type="submit" class="remove-button" onclick={() => removeLatestExercise(index)}>Delete exercise</button>

        </div>
    {/each}
    <button type="submit" class="add-button" onclick={addExercise}>Add exercise</button>
    <button type="submit" class="workout-button">Post your workout</button>
</form>

<style>
    .workout-form {
        max-width: 600px;
        margin: 20px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        background-color: #fff;
        text-align: left;
    }
    
    .workout-form h2 {
        text-align: center;
        color: #1a4571;
        margin-bottom: 20px;
        border-bottom: 2px solid #eeeeee;
        padding-bottom: 10px;
    }

    .workout-form hr {
        border: 0;
        border-top: 1px solid #eee; 
        margin: 20px 0;
    }

    .workout-label {
        display: block;
        margin-bottom: 15px;
        font-weight: 600;
        color: #333;
    }

    .workout-form input[type="text"],
    .workout-form input[type="number"] {
        width: 100%;
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box; 
        transition: border-color 0.2s;
    }

    .workout-form input[type="text"]:focus,
    .workout-form input[type="number"]:focus {
        border-color: #007bff;
        outline: none;
    }

    .exercise-group {
        border: 1px solid #eee;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        background-color: #f9f9f9;
        position: relative;
    }
    
    .exercise-group h4 {
        margin-top: 0;
        margin-bottom: 10px;
        color: #007bff;
        border-bottom: 1px dashed #ddd;
        padding-bottom: 5px;
    }

    .exercise-group label {
        display: inline-block;
        width: calc(50% - 10px); 
        margin-right: 15px;
        margin-bottom: 10px;
        font-weight: 500;
        color: #555;
    }
    
    .exercise-group input {
        margin-top: 3px;
    }

    .exercise-group label:nth-child(2n) {
        margin-right: 0;
    }
    
    .remove-button {
        background-color: #dc3545;
        color: white;
        border: none;
        padding: 8px 12px;
        font-size: 0.9em;
        display: block;
        margin-top: 10px;
        margin-left: auto;
    }
    
    .remove-button:hover {
        background-color: #c82333;
    }

    .workout-form button {
        width: 100%;
        margin-top: 10px;
        padding: 12px;
        font-weight: 600;
        transition: background-color 0.2s, border-color 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .workout-button {
        background-color: #28a745; 
        color: white;
        border-color: #28a745;
    }
    
    .workout-button:hover {
        background-color: #218838;
        border-color: #218838;
    }
    
    .add-button {
        background-color: #007bff; 
        color: white;
        border-color: #007bff;
    }
    
    .add-button:hover {
        background-color: #0056b3;
        border-color: #0056b3;
    }

    @media (prefers-color-scheme: dark) {
        .workout-form {
            background-color: #1a1a1a;
            border-color: #444;
        }

        .workout-form h2 {
            color: #5aa7ff;
            border-bottom: 2px solid #333;
        }
        
        .workout-label {
            color: #ddd;
        }
        
        .workout-form input[type="text"],
        .workout-form input[type="number"] {
            background-color: #2b2b2b;
            color: #ddd;
            border-color: #555;
        }
        
        .workout-form input[type="text"]:focus,
        .workout-form input[type="number"]:focus {
            border-color: #5aa7ff;
        }

        .workout-form hr {
            border-top: 1px solid #333; 
        }

        .exercise-group {
            background-color: #222;
            border-color: #444;
        }
        
        .exercise-group h4 {
            color: #79bbff;
            border-bottom: 1px dashed #555;
        }

        .exercise-group label {
            color: #ccc;
        }
    }
</style>