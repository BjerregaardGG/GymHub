export async function getFetch(endpoint) {
    try {
        const response = await fetch(import.meta.env.VITE.BASE_URL + endpoint, {
            credentials: 'include'
        });

        return await response.json();

    } catch (error) {
        console.log(error);
    }
}

export async function postFetch(endpoint, body) {
    try {
        const response = await fetch(import.meta.env.VITE.BASE_URL + endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        return await response.json(); 
    } catch (error) {
        console.log(error);
    }
}