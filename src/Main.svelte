<script>
    'use strict';

    import 'simpledotcss/simple.min.css';
    import Router from 'svelte-spa-router';
    import routes from './lib/routes.js';
</script>

<Router {routes} />

<style>
    :root {
        --accent-bg: var(--bg) !important;
        --accent: #3584e4 !important;
    }

    @media (prefers-color-scheme: dark) {
        :root {
            --accent: #62a0ea !important;
        }
    }
</style>
