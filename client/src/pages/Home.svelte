<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";
    import PRForm from '../components/PRForm.svelte';
    import toastr from 'toastr';

    let userTrainingData = {};
    let profileData = {};
    let showForm = false;

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

    function toggleForm(){
        showForm = !showForm;
    }

</script>

<h1>Training Feed</h1>

{#if profileData.image_path}
    <img src={profileData.image_path} alt={`Profilbillede for ${profileData.name}`} id="profile-pic"/>
{/if}

{#if !showForm}
<!-- We need to use Object.keys to turn our object into an array of its keys (bench_press, squat etc..)-->
{#if Object.keys(userTrainingData).length > 0}
    <ul class="pr-list">
    {#each Object.entries(userTrainingData) as [metric, value]} <li class="pr-item"><!-- Object.entries turns our objet into an array of arrays [metric, value] -> [bench_press, 110]-->
        <strong>{metric.replace(/_/g, ' ').toUpperCase()}:</strong> {value} </li> <!-- Removes under_case-->
    {/each}
    </ul>
{:else}
    <p>No training data yet.</p>
{/if}
<button onclick={toggleForm}>Update PR data</button>

{:else}
<PRForm {userTrainingData}/>
<button onclick={toggleForm}>Cancel</button>
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
</style>