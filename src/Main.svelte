<script>
    'use strict';

    import 'water.css/out/dark.min.css';
    import Router from 'svelte-spa-router';
    import routes from './lib/routes.js';
</script>

<Router {routes} />
