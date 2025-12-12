
// Sørger for, at TypeScript anerkender 'socket.io-client' som et modul,
// der kan importeres, ofte med en default export (io).
declare module 'socket.io-client' {
    import * as io from 'socket.io-client/dist/socket.io';
    export default io;
}

declare module 'svelte-routing' {
    export const Link: any;
    export const Router: any;
    export const Route: any;
    export const navigate: any;
    export const route: any;
}