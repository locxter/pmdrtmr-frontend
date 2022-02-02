<script>
    'use strict';

    import Router from 'svelte-spa-router';
    import routes from './routes';
</script>

<Router {routes} />

<style>
    :root {
        padding: var(--giant-feature);
    }
</style>