'use strict';

import { writable } from 'svelte/store';

// Create and export the stores
export let globalAccessToken = writable();
export let globalServerAddress = writable();
