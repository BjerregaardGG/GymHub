<script>
    let { userTrainingData, onUpdatePr } = $props();
    
    function handleUpdateButton(){
        onUpdatePr();
    }

</script>

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
    <button onclick={handleUpdateButton}>Update PR Data</button>
</div>

<style>

     /* PR Sektion */
    .pr-section {
        margin-top: 20px;
    }

    .pr-list {
        list-style: none; 
        margin-top: 20px;
        margin-bottom: 20px;
        max-width: 500px; 
        margin-left: auto;
        margin-right: auto;
        padding: 0 20px; 
        text-align: left;
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

    /* Dark Mode */
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