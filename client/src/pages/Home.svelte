<script>
    import toastr from 'toastr';
    import io from 'socket.io-client';
    
    import { onMount } from 'svelte';
    import { getFetch } from "../util/fetchUtil.js";

    import PRForm from '../components/PRForm.svelte';
    import WorkoutForm from '../components/WorkoutForm.svelte';
    import FriendList from '../components/FriendList.svelte';
    import PRList from '../components/PRList.svelte';
    import WorkoutList from '../components/WorkoutList.svelte';
    import ProfileFeed from '../components/ProfileFeed.svelte';
    
    let userTrainingData = $state({});
    let workoutsData = $state([]); 
    let profileData = $state({ name: '', image_path: '' });
    let friends = $state([]);
    let formType = $state(null);
    let socket; 

    // socket connection
    onMount(() => {
        socket = io(import.meta.env.VITE_BASE_URL, {
            withCredentials: true
        });

        socket.on('friend-status-update', (data) => {
            const { userId, isOnline } = data; // collects userId and online status from data

            friends = friends.map(friend => {
                if (friend.id == userId) { 
                    return { ...friend, isOnline: isOnline };
                }
                return friend;
            });
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    });

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

    // fetching friends
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

</script>
{#if formType === null}
    <div class="dashboard">
        <div class="content-layout"> 
            <div class="left-column"> 
                <ProfileFeed {profileData} {userTrainingData} {workoutsData}></ProfileFeed>
                <PRList {userTrainingData} onUpdatePr={() => formType = "pr"} ></PRList>
            </div>
            <div class="right-column">
                <FriendList {friends}></FriendList>
            </div>
        </div> 
        <div class="workouts-section full-width">
            <WorkoutList {workoutsData} onUpdateWorkout={() => formType = "workout"}></WorkoutList>
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
</style>