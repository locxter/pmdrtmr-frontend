'use strict';

import { writable } from 'svelte/store';

// Create and export the stores
export const ACCESS_TOKEN = writable();
export const SERVER_ADDRESS = writable();
