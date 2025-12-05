<script>

    let {workoutsData, onUpdateWorkout} = $props();

    function updateWorkout(){
        onUpdateWorkout();
    }

</script>

<h2>Workouts</h2>
{#if workoutsData && workoutsData.length > 0}
    <div class="workouts-list">
        {#each workoutsData as workout}
        <div class="workout-card">
            <h3>{workout.title}</h3>
            <p>{workout.description}</p>
            <small>Posted: {new Date(workout.date_recorded).toLocaleDateString()}</small>
            
            {#if workout.exercises.length > 0}
                <hr>
                <h4>Exercises:</h4>
                <ul>
                {#each workout.exercises as exercise}
                    <li>
                        {exercise.name}:
                        Sets: {exercise.sets} - Reps: {exercise.reps} - Weight: {exercise.weight_kg}kg
                    </li>
                {/each}
                </ul>
            {:else}
                <p>No exercises registered</p>
            {/if}
        </div>
        {/each}
    </div>
{:else}
    <p>No workouts logged yet.</p>
{/if}
<button onclick={updateWorkout}>Create Workout</button>

<style>
    .workouts-list {
        display: flex;
        flex-direction: row; 
        flex-wrap: wrap; 
        gap: 15px;
        max-width: 100%;
        margin: 20px auto;
        padding: 0 10px;
        justify-content: center; 
    }

    .workout-card {
        width: 45%; 
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        background-color: #fff;
        transition: transform 0.2s, box-shadow 0.2s;
    }

    .workout-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .workout-card h3 {
        margin: 0 0 5px 0;
        color: #1a4571;
    }

    .workout-card p {
        margin: 0 0 5px 0;
        color: #333;
    }

    .workout-card small {
        color: #666;
    }
    
    .workout-card hr {
        border: 0;
        border-top: 1px solid #eee; 
        margin: 10px 0;
    }

    .workout-card h4 {
        margin: 10px 0 5px 0;
        color: #007bff; 
        font-size: 1em;
    }

    .workout-card ul {
        list-style: none;
        padding: 0;
        margin: 5px 0 0 0;
    }

    .workout-card li {
        padding: 5px 0;
        border-left: 1px solid #007bff; 
        padding-left: 10px;
        margin-bottom: 3px;
        font-size: 0.95em;
        line-height: 1;
    }

    @media (max-width: 700px) {
        .workout-card {
            width: 100%; 
            min-width: unset;
        }
    }

    @media (prefers-color-scheme: dark) {
        .workouts-list {
            gap: 12px;
        }

        .workout-card {
            background-color: #1a1a1a;
            border-color: #444;
            color: #ddd;
        }

        .workout-card h3 {
            color: #5aa7ff;
        }

        .workout-card p, .workout-card small {
            color: #ccc;
        }
        
        .workout-card hr {
            border-top: 1px solid #333; 
        }
        
        .workout-card h4 {
            color: #4da6ff;
        }
    }

</style>