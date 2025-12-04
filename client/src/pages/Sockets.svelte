<script>
    import io from 'socket.io-client'; 
    import {onMount} from 'svelte'; 

    let colorInputValue = "#0000ff";
    let socket; 

    onMount(() => {
        socket = io("http://localhost:8080"); // ikke hardcodet

        // lytter på callback funktionen 
        socket.on("server-sends-color", (data) => {
            // some code 
        })
    })

    function submitColor() {
        console.log(colorInputValue); 

        socket.emit("client-sends-color", { color: colorInputValue});
    }

</script>

<input type="color" bind:value={colorInputValue}>
<button onclick={submitColor}>Submit color</button>
