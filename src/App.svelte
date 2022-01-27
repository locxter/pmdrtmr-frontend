<script>
    // Importing needed modules
    import Router from "svelte-spa-router";
    import routes from "./routes";
    
    // Activating strict mode
    'use strict';
</script>

<Router {routes}>
</Router>

<style>
    :root
    {
        padding: var(--giant-feature);
    }
</style>
