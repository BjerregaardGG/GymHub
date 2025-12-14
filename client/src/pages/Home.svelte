<script>
    import toastr from 'toastr';
    import io from 'socket.io-client';

    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";

    import PRForm from '../components/forms/PRForm.svelte';
    import WorkoutForm from '../components/forms/WorkoutForm.svelte';
    import SearchBar from '../components/SearchBar.svelte'

    import FriendList from '../components/feeds/FriendList.svelte';
    import PRList from '../components/feeds/PRList.svelte';
    import WorkoutList from '../components/feeds/WorkoutList.svelte';
    import ProfileFeed from '../components/feeds/ProfileFeed.svelte';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); 
    let profileData = $state({ id: null, name: '', image_path: '' });
    let following = $state([]);
    let formType = $state(null);
    let currentUserID = $state(null);
    let socket; 

    // socket connection
    onMount(() => {
        socket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true
        });

        socket.on('friend-status-update', (data) => {
            const { userId, isOnline } = data; // collects userId and online status from data

            following = following.map(user => {
                if (user.id == userId) { 
                    return { ...user, isOnline: isOnline };
                }
                return user;
            });
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    });

    async function loadPRData(){
        const result = await getFetch("/api/users/prdata");

        if (!result) {
            toastr.error("Could not load training data");
        } else {
            userTrainingData = result.data; 
            console.log($state.snapshot(userTrainingData));
        }
    }; 

    async function loadFriends(){
        const result = await getFetch("/api/relations/following"); 

        if (!result) {
            toastr.error("Could not load friends"); 
        } else {
            following = result.data; 
            console.log($state.snapshot(following));
        }
    };

    async function loadWorkouts(){
        const result = await getFetch("/api/workouts");

        if (!result) {
            toastr.error("Could not load workouts");
        } else {
            workoutsData = result.data; 
            console.log("Workouts:", $state.snapshot(workoutsData));
        }
    };

    async function loadProfile(){
        const result = await getFetch("/api/users/profile");

        if (!result) {
            toastr.error("Could not load profile data");
        } else {
            profileData = result.data; 
            currentUserID = profileData.id; 
        }
    };

    onMount(loadProfile);
    onMount(loadFriends);
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
                <FriendList {following}></FriendList>
                <SearchBar {following} {currentUserID}></SearchBar>
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
</style>