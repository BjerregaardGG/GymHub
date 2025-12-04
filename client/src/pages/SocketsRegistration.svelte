<script>
    import { nickname } from "../stores/nickNameStore.js"
    let nicknameInput; 

    function submitNickname(){
        nickname.set(nicknameInput); 

        // brug SESSIONS
        localStorage.setItem("nickname", nicknameInput) // anvende denne til at gemme nickname så man forbliver logget ind (localStorage.getItem)

    }

</script>

<input bind:value={nicknameInput}>
<button onclick={submitNickname}>Submit nickname</button>