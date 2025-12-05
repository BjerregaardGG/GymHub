<script>
    import { calculateEmblems, getEmblemDescription } from "../util/calculateEmblems.js";
    let {profileData, workoutsData, userTrainingData} = $props();

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

<style>
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
</style>