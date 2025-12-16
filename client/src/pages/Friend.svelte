<script>
    import { onMount } from "svelte";
    import { getFetch } from "../util/fetchUtil.js";
    import toastr from "toastr";

    import ProfileFeed from "../components/feeds/ProfileFeed.svelte";
    import PRList from "../components/feeds/PRList.svelte";
    import WorkoutList from "../components/feeds/WorkoutList.svelte";

    let { id } = $props();
    let profileData = $state({ name: '', image_path: '' });
    let userTrainingData = $state({});
    let workoutsData = $state([])

    async function loaddProfile(){
        const result = await getFetch(`/api/users/${id}`);

        if (result && result.success) {
            profileData = result.data;  
        } else {
            toastr.error(result ? result.message : "Could not load profile. Network or access error.");
        }
    };

    async function loadPRData(){
        const result = await getFetch(`/api/prs/${id}`);

        console.log("pr data:", result)

        if (result && result.success) {
            userTrainingData = result.data;  
        } else {
            toastr.error(result ? result.message : "Could not load training data.");
        }
    };

    async function loadWorkouts(){
        const result = await getFetch(`/api/workouts/${id}`);

        if (result && result.success) {
            workoutsData = result.data; 
        } else {
            toastr.error(result ? result.message : "Could not load workout data.");
        }
    };

    onMount(loaddProfile); 
    onMount(loadWorkouts);
    onMount(loadPRData);

</script>

{#if profileData}
    <div class="content-layout"> 
        <div class="left-column"> 
            <ProfileFeed {profileData} {userTrainingData} {workoutsData}></ProfileFeed>
            <PRList {userTrainingData} canUpdate={false} ></PRList>
        </div>
        <div class="workouts-section full-width">
            <WorkoutList {workoutsData} canUpdate={false}></WorkoutList>
        </div>
    </div>

{:else}
    <p>Loading or Error...</p> 
{/if}



