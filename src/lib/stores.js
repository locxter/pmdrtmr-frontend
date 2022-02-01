'use strict';

import { writable } from 'svelte/store';

// Creating and exporting the stores
export const ACCESS_TOKEN = writable();
export const SERVER_ADDRESS = writable();
