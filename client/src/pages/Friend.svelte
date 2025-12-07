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
        const result = await getFetch(`/api/users/profile/${id}`)

        if (!result) {
            toastr.error("Could not find user data. You might not have access to this user data.");
        } else {
            profileData = result.data;  
        }
    };

    async function loadPRData(){
        const result = await getFetch(`/api/users/prdata/${id}`);

        if (!result) {
            toastr.error("Could not find user data. You might not have access to this user data."); 
        } else {
            userTrainingData = result.data;  
        }
    };

    async function loadWorkouts(){
        const result = await getFetch(`/api/workouts/${id}`);

        if (!result) {
            toastr.error("Could not find workout data for user.")
        } else {
            workoutsData = result.data; 
        }
    };

    onMount(loaddProfile); 
    onMount(loadWorkouts);
    onMount(loadPRData);

</script>

<div class="content-layout"> 
    <div class="left-column"> 
        <ProfileFeed {profileData} {userTrainingData} {workoutsData}></ProfileFeed>
        <PRList {userTrainingData} canUpdate={false} ></PRList>
    </div>
    <div class="workouts-section full-width">
        <WorkoutList {workoutsData} canUpdate={false}></WorkoutList>
    </div>
</div>




