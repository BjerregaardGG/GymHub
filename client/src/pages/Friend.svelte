<script>
    import { onMount } from "svelte";
    import { getFetch } from "../util/fetchUtil.js";
    import toastr from "toastr";

    let { id } = $props();
    let profileData = $state({ name: '', image_path: '' });
    let prData = $state({});
    let loading = $state(true);

    onMount(async () => {
        const result = await getFetch(`/api/users/profile/${id}`)

        if (!result) {
            toastr.error("Could not find user data. You might not have access to this user data.");
        } else {
            profileData = result.data; 
            console.log(profileData); 
        }
    })

    onMount(async () => {
        const result = await getFetch(`/api/users/prdata/${id}`);

        if (!result) {
            toastr.error("Could not find user data. You might not have access to this user data."); 
        } else {
            prData = result.data;  
            console.log(prData);
        }
    }); 

</script>

<h1> {profileData.name}'s Training feed </h1> 

<div class="dashboard">
    <div class="content-layout"> 

        {#if profileData.image_path && profileData.image_path.length > 0}
        <img src={`/${profileData.image_path}`} alt={`Profile picture for ${profileData.name}`} id="profile-pic"/>
{:else}
    <p>Intet billede fundet</p>
{/if}
    </div>
</div>




