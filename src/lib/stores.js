// Importing needed modules
import { writable } from 'svelte/store';

// Activating strict mode
'use strict';

// Creating and exporting the stores
export const ACCESS_TOKEN = writable();
export const SERVER_ADDRESS = writable();
