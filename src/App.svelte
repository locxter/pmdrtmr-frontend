<script>
    'use strict';

    import Router from 'svelte-spa-router';
    import routes from './routes';
</script>

<Router {routes}>
</Router>

<style>
    :root
    {
        padding: var(--giant-feature);
    }
</style>