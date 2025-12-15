<script>
    import {patchFetch} from "../../util/fetchUtil"; 
    import toastr from "toastr";

    let { followRequests, onAccept } = $props(); 

    async function handleRequest(senderId, action) {
        let result;
        if (action === 'accept') {
            result = await patchFetch(`/api/relations/requests/accept/${senderId}`);
        } else if (action === 'decline') {
            result = await patchFetch(`/api/relations/requests/decline/${senderId}`);
        }

        if (result && result.success) {
            toastr.success(result.message);
            
            // Remove user from the list 
            followRequests = followRequests.filter(request => request.id != senderId);

            // load followers
            if (action === 'accept' && onAccept) {
                await onAccept(); 
            }
            
        } else {
            toastr.error(result.message || `Fejl ved ${action} af anmodning.`);
        }
    };

</script>

<div class="requests-container">
    <h3>Follow requests ({followRequests.length})</h3>

    {#if followRequests.length === 0}
        <p class="no-requests">No requests at the moment</p>
    {:else}
        <ul class="request-list">
            {#each followRequests as request (request.id)}
                <li class="request-item">
                    <span class="request-name">{request.name}</span>
                    <div class="request-actions">
                        <button 
                            class="btn btn-success" 
                            onclick={() => handleRequest(request.id, 'accept')}>
                            Accept
                        </button>
                        <button 
                            class="btn btn-danger" 
                            onclick={() => handleRequest(request.id, 'decline')}>
                            Decline 
                        </button>
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>

<style>
    .requests-container {
        padding: 15px;
        border: 1px solid #eee;
        border-radius: 20px;
        margin-top: 10px;
        margin-bottom: 20px;
    }
    .request-list {
        list-style: none;
        padding: 0;
    }
    .request-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px dashed #f0f0f0;
    }
    .request-actions button {
        margin-left: 10px;
    }
</style>