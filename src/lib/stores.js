'use strict';

import { writable } from 'svelte/store';

// Create and export the stores
export let ACCESS_TOKEN = writable();
export let SERVER_ADDRESS = writable();
