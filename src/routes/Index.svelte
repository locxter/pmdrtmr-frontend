<script>
    'use strict';

    import { push } from 'svelte-spa-router';
    import { ACCESS_TOKEN, SERVER_ADDRESS } from '../lib/stores.js';
    import { retrieveAccessToken, signUp } from '../lib/api-controller.js';

    // Defining variables for global stuff
    let username;
    let password;
    let serverAddress = 'http://localhost:8080';

    // Function to sign up or log in a user
    function signUpOrLogIn()
    {
        if (username && password && serverAddress)
        {
            let user =
            {
                username: username,
                password: password
            };
            retrieveAccessToken(serverAddress, user)
                .then(data =>
                {
                    ACCESS_TOKEN.set(data);
                    SERVER_ADDRESS.set(serverAddress);
                    push('/timers');
                })
                .catch(error =>
                {
                    console.error(error);
                    signUp(serverAddress, user)
                        .then(() =>
                        {
                            return retrieveAccessToken(serverAddress, user);
                        })
                        .then(data =>
                        {
                            ACCESS_TOKEN.set(data);
                            SERVER_ADDRESS.set(serverAddress);
                            push('/timers');
                        })
                        .catch(error =>
                        {
                            alert(error);
                        });
                });
        }
    }

</script>

<header>
    <h1>
        pmdrtmr
    </h1>
</header>
<main>
    <h2>
        Sign up / Log in
    </h2>
    <label for="username">
        Username:
    </label>
    <input id="username" type="text" placeholder="Username" bind:value={username}>
    <label for="password">
        Password:
    </label>
    <input id="password" type="password" placeholder="Password" bind:value={password}>
    <label for="server-address">
        Server address:
    </label>
    <input id="server-address" type="test" placeholder="Server address" bind:value={serverAddress}>
    <button on:click={signUpOrLogIn}>
        Sign up or log in
    </button>
</main>
<footer>
    <p>
        2022
        <a href="https://github.com/locxter">
            locxter
        </a>
    </p>
</footer>

<style>
    header,
    main,
    footer
    {
        align-items: center;
        display: flex;
        flex-flow: column nowrap;
    }

    header,
    main
    {
        margin: 0 0 var(--large-feature) 0;
    }

    :is(header, main) > :not(:last-child)
    {
        margin: 0 0 var(--medium-feature) 0;
    }
</style>