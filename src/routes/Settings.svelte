<script>
    // Importing needed modules
    import { push, link } from 'svelte-spa-router';
    import { ACCESS_TOKEN, SERVER_ADDRESS } from '../lib/stores.js';
    import { revokeAccessToken, getUser, updateUser, deleteUser } from '../lib/api-controller.js';

    // Activating strict mode
    'use strict';

    // Defining variables for stores and global stuff
    let accessToken;
    let serverAddress;
    let settings;
    let password;
    let deleteConfirmation;

    // Subscribing to global stores
    ACCESS_TOKEN.subscribe(data =>
    {
        accessToken = data;
    });

    SERVER_ADDRESS.subscribe(data =>
    {
        serverAddress = data;
    });


    // Function for loading the settings
    function loadSettings()
    {
        getUser(serverAddress, accessToken)
        .then(data =>
        {
            settings = data;
        })
        .catch(error =>
        {
            alert(error);
        });
    }

    // Function to log out of the current session
    function logOut() {
        revokeAccessToken(serverAddress, accessToken)
        .then(() =>
        {
            ACCESS_TOKEN.set(null);
            SERVER_ADDRESS.set(null);
            push('/');
        })
        .catch(error =>
        {
            alert(error);
        });
    }

    // Function to save the settings
    function saveSettings()
    {
        if (password)
        {
            settings.password = password;
            updateUser(serverAddress, accessToken, settings)
            .then(() =>
            {
                loadSettings();
            })
            .catch(error =>
            {
                alert(error);
            })
            .finally(() =>
            {
                password = null;
            });
        }
    }

    // Function to delete the account on request
    function deleteThisAccount()
    {
        if (deleteConfirmation === settings.username)
        {
            deleteUser(serverAddress, accessToken)
            .then(() =>
            {
                ACCESS_TOKEN.set(null);
                SERVER_ADDRESS.set(null);
                push('/');
            })
            .catch(error =>
            {
                alert(error);
            });
        }
    }

    loadSettings();
</script>

<header>
    <h1>
        pmdrtmr
    </h1>
    <nav>
        <a href="/timers" use:link>
            Timers
        </a>
        <button on:click={logOut}>
            Log out
        </button>
    </nav>
</header>
<main>
    <h2>
        Settings
    </h2>
    {#if settings}
        <label for="username">
            Username:
        </label>
        <input id="username" type="text" placeholder="Username" bind:value={settings.username}>
        <label for="password">
            Password:
        </label>
        <input id="password" type="password" placeholder="Password" bind:value={password}>
        <label for="work-duration">
            Work duration:
        </label>
        <input id="work-duration" type="number" min="1" max="60" size="2" bind:value={settings.workDuration}>
        <label for="short-break-duration">
            Short break duration:
        </label>
        <input id="short-break-duration" type="number" min="1" max="60" size="2" bind:value={settings.shortBreakDuration}>
        <label for="long-break-duration">
            Long break duration:
        </label>
        <input id="long-break-duration" type="number" min="1" max="60" size="2" bind:value={settings.longBreakDuration}>
        <label for="long-break-ratio">
            Long break ratio:
        </label>
        <input id="long-break-ratio" type="number" min="1" max="10" size="2" bind:value={settings.longBreakRatio}>
        <label for="caldav-address">
            CalDAV address:
        </label>
        <input id="caldav-address" type="text" placeholder="CalDAV address" size="60" bind:value={settings.caldavAddress}>
        <p>
            Remember to always enter a password even though you may not want to change it, as the settings
            <b>
                will not be saved
            </b>
            otherwise!
        </p>
        <button on:click={saveSettings}>
            Save settings
        </button>
        <h3 class="danger">
            Danger zone
        </h3>
        <label class="danger" for="username">
            Username:
        </label>
        <input id="username" class="danger" type="text" placeholder="Username" bind:value={deleteConfirmation}>
        <button class="danger" on:click={deleteThisAccount}>
            Delete this account
        </button>
    {/if}
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

    nav
    {
        align-items: center;
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        margin: calc(-1 * var(--small-feature));
    }

    nav > *
    {
        margin: var(--small-feature);
    }

    .danger
    {
        --accent-color: #e01b24;
    }
</style>
