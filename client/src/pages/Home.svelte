<script>
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";
    import toastr from 'toastr';

    let trainingData = {}

    onMount(async() => {
        const result = await getFetch("/api/usertrainingdata");

        if (result && result.success) {
            trainingData = result.data; 
            console.log(trainingData);
        } else {
            toastr.error("Could not load training data");
        }
    }); 

</script>

<h1>Training Feed</h1>

<!-- We need to use Object.keys to turn our object into an array of its keys (bench_press, squat etc..)-->
{#if Object.keys(trainingData).length > 0}
    <ul class="pr-list">
    {#each Object.entries(trainingData) as [metric, value]} <li class="pr-item"><!-- Object.entries turns our objet into an array of arrays [metric, value] -> [bench_press, 110]-->
        <strong>{metric.replace(/_/g, ' ').toUpperCase()}:</strong> {value} </li> <!-- Removes under_case-->
    {/each}
    </ul>
{:else}
    <p>No training data yet.</p>
{/if}

<style>
    /* 1. UL (Listen) Styling */
    .pr-list {
        list-style: none; /* VIGTIGT: Fjerner standard bullet points */
        margin-top: 20px;
        margin-bottom: 20px;
        max-width: 500px; /* Begrænser bredden for et rent look */
        margin-left: auto;
        margin-right: auto;
        padding: 0 20px; /* Sikrer lidt plads på mobile enheder */
    }

    /* 2. LI (Hvert element) Styling */
    .pr-item {
        padding: 8px 0;
        border-bottom: 1px solid #eeeeee; /* Enkel, lys linje mellem elementer */
        display: flex; /* Gør det nemt at justere teksten */
        justify-content: space-between; /* Skubber navn og værdi til hver sin side */
        font-size: 1.1em;
        color: #333;
        align-items: center;
    }

    .pr-item:last-child {
        border-bottom: none; /* Fjerner linjen under det sidste element */
    }

    /* 3. STRONG (Navn på Metrik) Styling */
    .pr-item strong {
        font-weight: 600; /* Gør navnet let fed */
        color: #1a4571; /* Fremhæver navnet let */
        margin-right: 20px;
    }

    /* Mørk tilstand justeringer */
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