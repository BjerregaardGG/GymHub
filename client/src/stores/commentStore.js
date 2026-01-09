import { writable } from 'svelte/store';

// 2. A counter --> WorkoutComments knows that it need to update (WorkoutComments)
export const commentsUpdated = writable(0);

// 1. Increment the counter everytime it's called (CommentForm).
export function triggerCommentUpdate() {
    commentsUpdated.update(n => n + 1);
}


