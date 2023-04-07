<script>
    'use strict';

    import { push } from 'svelte-spa-router';
    import { globalAccessToken, globalServerAddress } from '../lib/stores.js';
    import { retrieveAccessToken, signUp } from '../lib/api-controller.js';

    // Variables for global stuff
    let username;
    let password;
    let serverAddress = 'http://localhost:8080';

    // Function to sign up or log in a user
    function signUpOrLogIn() {
        if (username && password && serverAddress) {
            let user = {
                username: username,
                password: password,
            };
            retrieveAccessToken(serverAddress, user)
                .then((data) => {
                    globalAccessToken.set(data);
                    globalServerAddress.set(serverAddress);
                    push('/timers');
                })
                .catch((error) => {
                    console.error(error);
                    signUp(serverAddress, user)
                        .then(() => {
                            return retrieveAccessToken(serverAddress, user);
                        })
                        .then((data) => {
                            globalAccessToken.set(data);
                            globalServerAddress.set(serverAddress);
                            push('/timers');
                        })
                        .catch((error) => {
                            alert(error);
                        });
                });
        }
    }
</script>

<header>
    <h1>pmdrtmr</h1>
</header>
<main>
    <h2>Sign up / Log in</h2>
    <p>
        <label for="username">Username:</label>
        <br />
        <input id="username" type="text" placeholder="Username" bind:value={username} />
    </p>
    <p>
        <label for="password">Password:</label>
        <br />
        <input id="password" type="password" placeholder="Password" bind:value={password} />
    </p>
    <p>
        <label for="server-address">Server address:</label>
        <br />
        <input id="server-address" type="text" placeholder="Server address" bind:value={serverAddress} />
    </p>
    <p>
        <button on:click={signUpOrLogIn}>Sign up or log in</button>
    </p>
</main>
<footer>
    <p>2022 locxter</p>
</footer>
