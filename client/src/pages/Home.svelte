<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";

    import PRForm from '../components/PRForm.svelte';
    import WorkoutForm from '../components/WorkoutForm.svelte';

    import toastr from 'toastr';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); // Start med et tomt array
    let exercises = $state({}); // Brug et objekt eller Map til exercises, organiseret efter workoutId
    let profileData = $state({});
    let formType = $state(null);

    // fetching pr data
    onMount(async() => {
        const result = await getFetch("/api/users/prdata");

        if (result && result.success) {
            userTrainingData = result.data; 
            console.log(userTrainingData);
        } else {
            toastr.error("Could not load training data");
        }
    }); 

    // fetching workouts
    onMount(async() => {
        const result = await getFetch("/api/workouts");

        if (!result) {
            toastr.error("Could not load workouts");
        } else {
            workoutsData = result.data; 
            console.log(workoutsData);
        }
    });

    /*
    onMount(async() => {
        const result = await getFetch(`/api/workouts/${workoutsData.data.id}/exercises`)

        if (!result) {
            toastr.error("Could not fetch exercises for workouts");
        } else {
            exercises = result.data; 
            console.log(exercises);
        }
    }) */

    // fetching picture 
    onMount(async() => {
        const result = await getFetch("/api/users/profile");

        if (result && result.success) {
            profileData = result.data; 
            console.log(profileData);
        } else {
            toastr.error("Could not load profile data");
        }
    }); 

</script>

<h1>Training Feed</h1>



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
    <PRForm {userTrainingData} onClose={() => formType = null}/>
    <button onclick={() => formType = null}>Cancel</button>

{:else if formType === "workout"}
    <WorkoutForm onClose={() => formType = null}/>
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
        flex-direction: column;
        gap: 15px;
        max-width: 600px;
        margin: 20px auto;
        padding: 0 10px;
    }

    .workout-card {
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
    }
</style>