<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";

    import PRForm from '../components/PRForm.svelte';
    import WorkoutForm from '../components/WorkoutForm.svelte';

    import toastr from 'toastr';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); 
    let profileData = $state({
        name: '',
        image_path: ''
    });

    let formType = $state(null);

    // fetching pr data
    onMount(async() => {
        const result = await getFetch("/api/users/prdata");

        if (result && result.success) {
            userTrainingData = result.data; 
            console.log($state.snapshot(userTrainingData));
        } else {
            toastr.error("Could not load training data");
        }
    }); 

    // Reusable fetchWorkouts function
    async function fetchWorkouts() {
        const result = await getFetch("/api/workouts");

        if (!result) {
            toastr.error("Could not load workouts");
        } else {
            workoutsData = result.data; 
            console.log("Workouts:", $state.snapshot(workoutsData));
        }
    };

    onMount(fetchWorkouts); // fetches workouts in the beginning 

    // fetching picture 
    onMount(async() => {
        const result = await getFetch("/api/users/profile");

        if (result && result.success) {
            profileData = result.data; 
        } else {
            toastr.error("Could not load profile data");
        }
    }); 

</script>

<h1>Training Feed</h1>

{#if profileData.image_path}
    <img src={profileData.image_path} alt={`Profilbillede for ${profileData.name}`} id="profile-pic"/>
{/if}

{#if formType === null}
<div class="dashboard">
    <div class="pr-section">
        {#if Object.keys(userTrainingData).length > 0}
            <ul class="pr-list">
            {#each Object.entries(userTrainingData) as [metric, value]}
                <li class="pr-item">
                    <strong>{metric.replace(/_/g, ' ').toUpperCase()}:</strong> {value}
                </li>
            {/each}
            </ul>
        {:else}
            <p>No training data yet.</p>
        {/if}
        <button onclick={() => formType = "pr"}>Update PR Data</button>
    </div>

    <div class="workouts-section">
        <h2>Workouts</h2>
        {#if workoutsData && workoutsData.length > 0}
            <div class="workouts-list">
                {#each workoutsData as workout}
                    <div class="workout-card">
                        <h3>{workout.title}</h3>
                        <p>{workout.description}</p>
                        <small>{new Date(workout.date_recorded).toLocaleDateString()}</small>
                        
                        {#if workout.exercises.length > 0}
                            <hr>
                            <h4>Exercises:</h4>
                            <ul>
                            {#each workout.exercises as exercise}
                                <li>
                                    {exercise.name}:
                                    (Sets: {exercise.sets}, Reps: {exercise.reps}, Vægt: {exercise.weight_kg}kg)
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
        <button onclick={() => formType = "workout"}>Create Workout</button>
    </div>
</div>

{:else if formType === "pr"}
    <PRForm bind:userTrainingData={userTrainingData} onClose={() => formType = null}/>
    <button onclick={() => formType = null}>Cancel</button>

{:else if formType === "workout"}
    <WorkoutForm onClose={async () => {
        formType = null;
        await fetchWorkouts(); 
    }}/>
    <button onclick={() => formType = null}>Cancel</button>
{/if}

<style>
    .pr-list {
        list-style: none; 
        margin-top: 20px;
        margin-bottom: 20px;
        max-width: 500px; 
        margin-left: auto;
        margin-right: auto;
        padding: 0 20px; 
    }

    #profile-pic {
      width: 150px; 
      height: 150px; 
      object-fit: cover; 
      border-radius: 50%; 
      border: 4px solid #4CAF50; 
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.2); 
      margin-bottom: 10px; 
      transition: transform 0.3s ease-in-out;
    }

     #profile-pic:hover {
      transform: scale(1.05); 
    }

    .pr-item {
        padding: 8px 0;
        border-bottom: 1px solid #eeeeee; 
        display: flex; 
        justify-content: space-between; 
        font-size: 1.1em;
        color: #333;
        align-items: center;
    }

    .pr-item:last-child {
        border-bottom: none; 
    }

    .pr-item strong {
        font-weight: 600; 
        color: #1a4571; 
        margin-right: 20px;
    }

    /* --- Dark Mode for PR-Sektion --- */
    @media (prefers-color-scheme: dark) {
        .pr-item {
            color: #dddddd;
            border-bottom: 1px solid #444444;
        }
        .pr-item strong {
            color: #5aa7ff;
        }
    }

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
    
    /* --- Styling for Exercises (Indlejret i workout-card) --- */
    .workout-card hr {
        border: 0;
        border-top: 1px solid #eee; 
        margin: 10px 0;
    }

    .workout-card h4 {
        margin: 10px 0 5px 0;
        color: #007bff; /* Fremhæver overskriften */
        font-size: 1em;
    }

    .workout-card ul {
        list-style: none;
        padding: 0;
        margin: 5px 0 0 0;
    }

    .workout-card li {
        padding: 5px 0;
        border-left: 3px solid #007bff; /* Visuel adskillelse */
        padding-left: 10px;
        margin-bottom: 3px;
        font-size: 0.95em;
        line-height: 1.4;
    }
    
    /* --- Responsivt Design (Gå tilbage til én kolonne på mobil) --- */
    @media (max-width: 700px) {
        .workout-card {
            width: 100%; /* Kortene fylder hele bredden */
            min-width: unset;
        }
    }
    
    /* --- Dark Mode Justeringer for Workouts --- */
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
        
        /* Dark Mode for Exercises */
        .workout-card hr {
            border-top: 1px solid #333; 
        }
        
        .workout-card h4 {
            color: #4da6ff;
        }
        
    }
</style>