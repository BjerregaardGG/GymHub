<script>
    import toastr from 'toastr';
    import io from 'socket.io-client';

    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";

    import { user } from "../stores/userStore.js";

    import PRForm from '../components/forms/PRForm.svelte';
    import WorkoutForm from '../components/forms/WorkoutForm.svelte';
    import SearchBar from '../components/SearchBar.svelte'

    import FollowingList from '../components/feeds/FollowingList.svelte';
    import FollowerList from '../components/feeds/FollowerList.svelte';
    import PRList from '../components/feeds/PRList.svelte';
    import WorkoutList from '../components/feeds/WorkoutList.svelte';
    import ProfileFeed from '../components/feeds/ProfileFeed.svelte';
    import FollowRequests from '../components/feeds/FollowRequests.svelte';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); 
    let profileData = $state({ id: null, name: '', image_path: '' });
    let following = $state([]);
    let followers = $state([]);
    let followRequests = $state([]);
    let formType = $state(null);
    let currentUserID = $state(null);
    let socket; 

    onMount(() => {
        socket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true
        });

        socket.on('friend-status-update', (data) => {
            const { userId, isOnline } = data; // collects userId and online status from data

            following = following.map(user => 
                user.id === userId ? { ...user, isOnline } : user
            );

            followers = followers.map(user => 
                user.id === userId ? { ...user, isOnline } : user
            );
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    });

    async function loadPRData(){
        const result = await getFetch("/api/prs/me");

        if (!result) {
            toastr.error("Could not load training data");
        } else {
            userTrainingData = result.data; 
        }
    }; 

    async function loadFollowing(){
        const result = await getFetch("/api/relations/me/following"); 

        if (!result) {
            toastr.error("Could not load users you follow"); 
        } else {
            following = result.data; 
        }
    };

    async function loadFollowers(){
        const result = await getFetch("/api/relations/me/followers"); 

        if (!result) {
            toastr.error("Could not load followers"); 
        } else {
            followers = result.data; 
        }
    };

    async function loadWorkouts(){
        const result = await getFetch("/api/workouts/me");

        if (!result) {
            toastr.error("Could not load workouts");
        } else {
            workoutsData = result.data; 
        }
    };

    async function loadProfile(){
        const result = await getFetch("/api/users/me");

        if (!result) {
            toastr.error("Could not load profile data");
        } else {
            profileData = result.data; 
            user.set(result.data); // updates the user store 
            currentUserID = profileData.id; 
        }
    };

    async function loadFollowRequests(){
        const result = await getFetch("/api/relations/me/requests"); 

        if (!result) {
            toastr.error("Could not load requests");
        } else {
            followRequests = result.data; 
        }
    }

    onMount(loadProfile);
    onMount(loadFollowing);
    onMount(loadFollowers); 
    onMount(loadFollowRequests); 
    onMount(loadPRData);
    onMount(loadWorkouts);

</script>
{#if formType === null}
    <div class="dashboard">
        <div class="content-layout"> 
            <div class="left-column"> 
                <ProfileFeed {profileData} {userTrainingData} {workoutsData}></ProfileFeed>
                <PRList {userTrainingData} onUpdatePr={() => formType = "pr"} canUpdate={true} ></PRList>
            </div>
            <div class="right-column">
                <div class="lists-container"> 
                    <FollowingList {following} onDelete={loadFollowing}></FollowingList>
                    <FollowerList {followers} onDelete={loadFollowers}></FollowerList>
                </div>
                <SearchBar {following} {currentUserID} {loadFollowing}></SearchBar>
                {#if followRequests.length > 0}
                    <FollowRequests {followRequests} onAccept={loadFollowers}></FollowRequests>
                {/if}
            </div>
        </div> 
        <div class="workouts-section full-width">
            <WorkoutList {workoutsData} onUpdateWorkout={() => formType = "workout"} canUpdate={true}></WorkoutList>
        </div>
    </div>

{:else if formType === "pr"}
    <PRForm bind:userTrainingData={userTrainingData} onClose={() => formType = null}/>
    <button onclick={() => formType = null}>Cancel</button>

{:else if formType === "workout"}
    <WorkoutForm onClose={async () => {
        formType = null;
        await loadWorkouts(); 
    }}/>
    <button onclick={() => formType = null}>Cancel</button>
{/if}

<style>
    /* General layout */
    .content-layout {
        display: flex;
        gap: 10px;
        padding: 20px;
        max-width: 100%; 
        margin: 0 auto;
    }

    .left-column {
        flex: 3; 
        min-width: 0; 
        text-align: center;
    }

    .right-column {
        flex: 2; 
        display: flex; 
        flex-direction: column; 
        min-width: 250px; 
    }

    .lists-container {
        display: flex; 
        flex-wrap: wrap; 
        gap: 10px; 
    }

    .workouts-section.full-width {
        max-width: 1200px;
        margin: 20px auto;
        padding: 0 20px;
        text-align: center;
    }
    
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
</style>