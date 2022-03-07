<script>
    'use strict';

    import { push, link } from 'svelte-spa-router';
    import { ACCESS_TOKEN, SERVER_ADDRESS } from '../lib/stores.js';
    import { revokeAccessToken, getUser, updateUser, deleteUser } from '../lib/api-controller.js';

    // Defining variables for stores and global stuff
    let accessToken;
    let serverAddress;
    let settings;
    let password;
    let deleteConfirmation;

    // Subscribing to global stores
    ACCESS_TOKEN.subscribe((data) => {
        accessToken = data;
    });
    SERVER_ADDRESS.subscribe((data) => {
        serverAddress = data;
    });

    // Function for loading the settings
    function loadSettings() {
        getUser(serverAddress, accessToken)
            .then((data) => {
                settings = data;
            })
            .catch((error) => {
                alert(error);
            });
    }

    // Function to log out of the current session
    function logOut() {
        revokeAccessToken(serverAddress, accessToken)
            .then(() => {
                ACCESS_TOKEN.set(null);
                SERVER_ADDRESS.set(null);
                push('/');
            })
            .catch((error) => {
                alert(error);
            });
    }

    // Function to save the settings
    function saveSettings() {
        if (password) {
            settings.password = password;
            updateUser(serverAddress, accessToken, settings)
                .then(() => {
                    loadSettings();
                })
                .catch((error) => {
                    alert(error);
                })
                .finally(() => {
                    password = null;
                });
        }
    }

    // Function to delete the account on request
    function deleteThisAccount() {
        if (deleteConfirmation === settings.username) {
            deleteUser(serverAddress, accessToken)
                .then(() => {
                    ACCESS_TOKEN.set(null);
                    SERVER_ADDRESS.set(null);
                    push('/');
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }

    loadSettings();
</script>

<header>
    <h1>pmdrtmr</h1>
    <nav>
        <a href="/timers" use:link>Timers</a>
        <button on:click={logOut}>Log out</button>
    </nav>
</header>
<main>
    <h2>Settings</h2>
    {#if settings}
        <label for="username">Username:</label>
        <br />
        <input id="username" type="text" placeholder="Username" bind:value={settings.username} />
        <br />
        <label for="password">Password:</label>
        <br />
        <input id="password" type="password" placeholder="Password" bind:value={password} />
        <br />
        <label for="work-duration">Work duration:</label>
        <br />
        <input id="work-duration" type="number" min="1" max="60" size="2" bind:value={settings.workDuration} />
        <br />
        <label for="short-break-duration">Short break duration:</label>
        <br />
        <input id="short-break-duration" type="number" min="1" max="60" size="2" bind:value={settings.shortBreakDuration} />
        <br />
        <label for="long-break-duration">Long break duration:</label>
        <br />
        <input id="long-break-duration" type="number" min="1" max="60" size="2" bind:value={settings.longBreakDuration} />
        <br />
        <label for="long-break-ratio">Long break ratio:</label>
        <br />
        <input id="long-break-ratio" type="number" min="1" max="10" size="2" bind:value={settings.longBreakRatio} />
        <br />
        <label for="caldav-address">CalDAV address:</label>
        <br />
        <input id="caldav-address" type="text" placeholder="CalDAV address" size="60" bind:value={settings.caldavAddress} />
        <p>
            Remember to always enter a password even though you may not want to change it, as the settings
            <strong>will not be saved</strong>
            otherwise!
        </p>
        <button on:click={saveSettings}>Save settings</button>
        <h3>Danger zone</h3>
        <label for="username">Username:</label>
        <br />
        <input id="username" type="text" placeholder="Username" bind:value={deleteConfirmation} />
        <br />
        <button on:click={deleteThisAccount}>
            <strong>Delete</strong>
            this account
        </button>
    {:else}
        <p>Settings not found</p>
    {/if}
</main>
<footer>
    <p>
        Made with &hearts; in Nothern Germany.
        <br />
        2022
        <a href="https://github.com/locxter">locxter</a>
    </p>
</footer>
