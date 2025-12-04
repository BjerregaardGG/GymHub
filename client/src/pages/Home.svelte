<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";
    import { calculateEmblems, getEmblemDescription } from '../util/calculateEmblems.js';

    import PRForm from '../components/PRForm.svelte';
    import WorkoutForm from '../components/WorkoutForm.svelte';

    import toastr from 'toastr';
    import FriendList from '../components/FriendList.svelte';
    import PRList from '../components/PRList.svelte';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); 
    let profileData = $state({ name: '', image_path: '' });
    let friends = $state([]);
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

    onMount(async() => {
        const result = await getFetch("/api/friends"); 

        if (!result) {
            toastr.error("Could not load friends"); 
        } else {
            friends = result.data; 
            console.log($state.snapshot(friends));
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

    // makes sure that we recalculate everytime that the data changes
    const emblems = $derived(calculateEmblems(workoutsData, userTrainingData));

    // convert the emblems object to an array of symbols
    const assignedEmblems = $derived(() => {
        const entries = Object.entries(emblems); 
    
        const validSymbols = entries.filter(([key, value]) => value !== null);
    
        // maps to array of objects 
        return validSymbols.map(([key, symbolPath]) => ({
            key: key,
            path: symbolPath
        }));
    });
</script>

{#if formType === null}
<div class="dashboard">
    <div class="content-layout"> 
        <div class="left-column"> 
            <h1>Training Feed</h1>

            {#if profileData.image_path}
                <img src={profileData.image_path} alt={`Profile picture for ${profileData.name}`} id="profile-pic"/>
            {/if}

                <div class="emblems">
                {#each assignedEmblems() as emblem (emblem.key) }
                <img 
                    src={`./emblems/${emblem.path}`} 
                    alt={`Emblem for ${emblem.key}`}
                    class="badge-icon"
                    title={getEmblemDescription(emblem.key)}
                />
                {/each}

                </div>
                   <PRList {userTrainingData} onUpdatePr={() => formType = "pr"} ></PRList>
                </div>

        <div class="right-column">
            <FriendList {friends}></FriendList>
        </div>

    </div> 
    <div class="workouts-section full-width">
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
    /* General layout */
    .content-layout {
        display: flex;
        gap: 10px;
        padding: 20px;
        max-width: 1100px; 
        margin: 0 auto;
    }

    .left-column {
        flex: 2; 
        min-width: 0; 
        text-align: center;
    }

    .right-column {
        flex: 1; 
        min-width: 250px; 
    }

    .workouts-section.full-width {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 20px;
        text-align: center;
    }
    
    /* For phone */
    @media (max-width: 900px) {
        .content-layout {
            flex-direction: column;
            padding: 10px;
        }
        
        .right-column {
            min-width: unset;
        }

        .workouts-section.full-width {
            padding: 0 10px;
        }
    }

    /* Profile & Emblems */
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

    .emblems {
        display: flex; 
        justify-content: center; 
        align-items: center; 
        gap: 8px; 
        margin-top: 10px;
        margin-bottom: 20px; 
    }

    .badge-icon {
        width: 40px; 
        height: 40px; 
        object-fit: contain; 
        border-radius: 50%; 
        border: 2px solid #4CAF50; 
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
    }

    .badge-icon:hover {
        transform: scale(1.1);
    }

    /* Workouts Sektion */
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
    
    /* Dark Mode */
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