'use strict';

import { push } from 'svelte-spa-router';
import { wrap } from 'svelte-spa-router/wrap';
import { ACCESS_TOKEN, SERVER_ADDRESS } from './stores.js';
import Index from '../routes/Index.svelte';
import Timers from '../routes/Timers.svelte';
import Settings from '../routes/Settings.svelte';
import Timer from '../routes/Timer.svelte';

// Define variables for stores and subscribe to them
let accessToken;
let serverAddress;
ACCESS_TOKEN.subscribe(value => {
    accessToken = value;
});

SERVER_ADDRESS.subscribe(value => {
    serverAddress = value;
});

// Function for checking whether all need global stores are available
function canLoad() {
    if (accessToken && serverAddress) {
        return true;
    } else {
        setTimeout(() => {
            push('/');
        }, 1);
        return false;
    }
}

// Export the routes configuration
export default {
    '/': Index,
    '/timers': wrap({
        component: Timers,
        conditions: [
            canLoad
        ]
    }),
    '/settings': wrap({
        component: Settings,
        conditions: [
            canLoad
        ]
    }),
    '/timer': wrap({
        component: Timer,
        conditions: [
            canLoad
        ]
    }),
    '*': Index
};
