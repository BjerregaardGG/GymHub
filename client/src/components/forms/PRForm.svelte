<script>
    import { postFetch, putFetch } from "../../util/fetchUtil.js";
    import toastr from "toastr";

    let {onClose, userTrainingData = $bindable()} = $props(); 

    function isValidRunTime(runValue) {
        const runTime = parseFloat(runValue); 

        if (isNaN(runTime) || runTime < 0) {
            return false; 
        }

        const minutes = Math.floor(runTime); 
        const decimal = runTime - minutes; 

        return decimal >= 0 && decimal < 0.60; 
    }
    
    async function postPrData(event) {
        event.preventDefault(); 

        if (!isValidRunTime(userTrainingData.run_5k_min)) {
            toastr.error("Not a valid run time"); 
            return; 
        }

        const result = await postFetch("/api/prs/me", userTrainingData); 

        if (!result) {
            toastr.error("Could not post training data");
        } else {
            toastr.success(result.message); 
            onClose(); 
        }
    };

    async function updatePrData(event) {
        event.preventDefault(); 

        if (!isValidRunTime(userTrainingData.run_5k_min)) {
            toastr.error("Not a valid run time"); 
            return; 
        }

        const result = await putFetch("/api/prs/me", userTrainingData); 

        if (!result) {
            toastr.error("Could not update training data");
        } else {
            toastr.success(result.message); 
            onClose(); 
        }
    };
/*
    async function updateTrainingData(event){
        event.preventDefault();

        if (!isValidRunTime(userTrainingData.run_5k_min)) {
            toastr.error("Not a valid run time");
            return;
        }

        const result = await postFetch("/api/prs/me", userTrainingData);

        if (!result) {
            toastr.error("Could not update training data");
        } else {
            toastr.success(result.message)
            onClose();
        }
    };
    */
</script>

{#if userTrainingData?.id}
<form class="pr-form" onsubmit={updatePrData}>
    <label class="pr-label">Bench Press (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.bench_press_kg} />
    </label>
    <label class="pr-label">Squat (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.squat_kg} />
    </label>
    <label class="pr-label">Deadlift (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.deadlift_kg} />
    </label>
    <label class="pr-label">5k Run (min):
        <input type="number" step="0.01" bind:value={userTrainingData.run_5k_min} />
    </label>
    <label class="pr-label">Pull-ups max:
        <input type="number" bind:value={userTrainingData.pull_ups_max} />
    </label>
    <button type="submit" class="pr-button">Update PR Data</button>
</form>

{:else}

<form class="pr-form" onsubmit={postPrData}>
    <label class="pr-label">Bench Press (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.bench_press_kg} />
    </label>
    <label class="pr-label">Squat (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.squat_kg} />
    </label>
    <label class="pr-label">Deadlift (kg):
        <input type="number" step="0.25" bind:value={userTrainingData.deadlift_kg} />
    </label>
    <label class="pr-label">5k Run (min):
        <input type="number" step="0.01" bind:value={userTrainingData.run_5k_min} />
    </label>
    <label class="pr-label">Pull-ups max:
        <input type="number" bind:value={userTrainingData.pull_ups_max} />
    </label>
    <button type="submit" class="pr-button">Create PR Data</button>
</form>
{/if}


<style>
.pr-form {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #eeeeee;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
}

.pr-label {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-weight: 600;
    color: #1a4571;
    font-size: 1.05em;
}

.pr-label input {
    width: 60%;
    padding: 5px 10px;
    border: 1px solid #cccccc;
    border-radius: 5px;
    font-size: 1em;
    transition: border-color 0.2s;
}

.pr-label input:focus {
    outline: none;
    border-color: #4CAF50;
}

.pr-button {
    padding: 10px 15px;
    font-size: 1em;
    font-weight: 600;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    align-self: flex-end;
}

.pr-button:hover {
    background-color: #45a049;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
    .pr-form {
        background-color: #1e1e1e;
        border: 1px solid #444444;
    }
    .pr-label {
        color: #5aa7ff;
    }
    .pr-label input {
        background-color: #2c2c2c;
        color: #ddd;
        border: 1px solid #555;
    }
    .pr-label input:focus {
        border-color: #4CAF50;
    }
    .pr-button {
        background-color: #4CAF50;
    }
    .pr-button:hover {
        background-color: #45a049;
    }
}
</style>