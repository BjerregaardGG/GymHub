export async function getFetch(endpoint) {
    try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + endpoint, {
            credentials: 'include'
        });

        return await response.json();

    } catch (error) {
        console.log(error);
    }
}

export async function postFetch(endpoint, body) {
    try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + endpoint, {
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
        return null; 
    }
}

export async function patchFetch(endpoint, body) {
    try {
        const response = await fetch(import.meta.env.VITE_BASE_URL + endpoint, {
            method: 'PATCH', 
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body) 
        });
        
        return await response.json(); 
        
    } catch (error) {
        console.log(error);
        return null; 
    }
}