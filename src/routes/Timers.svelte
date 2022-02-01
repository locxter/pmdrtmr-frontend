<script>
    'use strict';

    import { push, link } from 'svelte-spa-router';
    import { ACCESS_TOKEN, SERVER_ADDRESS } from '../lib/stores.js';
    import { revokeAccessToken, getAllTimersOfUser, createTimer, deleteTimer, getCaldavDescriptions } from '../lib/api-controller.js';

    // Defining variables for stores and global stuff
    let accessToken;
    let serverAddress;
    let timers;
    let task;
    let caldavTasks;
    let showCaldavTasks = false;

    // Subscribing to global stores
    ACCESS_TOKEN.subscribe(data =>
    {
        accessToken = data;
    });
    SERVER_ADDRESS.subscribe(data =>
    {
        serverAddress = data;
    });


    // Function for loading the timer list
    function loadTimers()
    {
        getAllTimersOfUser(serverAddress, accessToken)
            .then(data =>
            {
                timers = data;
            })
            .catch(error =>
            {
                alert(error);
            });
    }

    // Function to log out of the current session
    function logOut()
    {
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

    // Function to toggle the visibility of CalDAV fetched tasks
    function toggleShowCaldavTasks()
    {
        showCaldavTasks = !showCaldavTasks;
        if (showCaldavTasks)
        {
            caldavTasks = null;
            getCaldavDescriptions(serverAddress, accessToken)
                .then(data =>
                {
                    caldavTasks = data;
                })
                .catch(error =>
                {
                    alert(error);
                    showCaldavTasks = false;
                });
        }

    }

    // Function to add a task to the timer list
    function addTask(task)
    {
        if (task)
        {
            let timer =
            {
                description: task
            };
            createTimer(serverAddress, accessToken, timer)
                .then(() =>
                {
                    loadTimers();
                })
                .catch(error =>
                {
                    alert(error);
                });
        }
    }

    // Function to delete a task from the timer list
    function deleteTask(id)
    {
        deleteTimer(serverAddress, accessToken, id)
            .then(() =>
            {
                loadTimers();
            })
            .catch(error =>
            {
                alert(error);
            });
    }

    // Function to forward to /timer
    function startWorking()
    {
        push('/timer');
    }

    loadTimers();
</script>

<header>
    <h1>
        pmdrtmr
    </h1>
    <nav>
        <a href="/settings" use:link>
            Settings
        </a>
        <button on:click={logOut}>
            Log out
        </button>
    </nav>
</header>
<main>
    <h2>
        Timers
    </h2>
    <button on:click={toggleShowCaldavTasks}>
        {#if showCaldavTasks}
        Hide CalDAV tasks
        {:else}
        Show CalDAV tasks
        {/if}
    </button>
    {#if showCaldavTasks}
    {#if caldavTasks && caldavTasks.length > 0}
    <ul>
        {#each caldavTasks as caldavTask}
        <li>
            <p>
                {caldavTask}
            </p>
            <button on:click={addTask(caldavTask)}>
                Add task
            </button>
        </li>
        {/each}
    </ul>
    {:else}
    <p>
        No CalDav tasks found
    </p>
    {/if}
    {/if}
    <input type="text" placeholder="Task" size="60" bind:value={task}>
    <button on:click={()=> {addTask(task); task = null;}}>
        Add task
    </button>
    {#if timers && timers.length > 1}
    <ol>
        {#each timers as timer}
        <li>
            <h3>
                {#if timer.isBreak}
                Break
                {:else}
                Work
                {/if}
            </h3>
            <p>
                {timer.description}
            </p>
            {#if !timer.isBreak}
            <button on:click={deleteTask(timer.id)}>
                Delete task
            </button>
            {/if}
        </li>
        {/each}
    </ol>
    <button on:click={startWorking}>
        Start working
    </button>
    {:else}
    <p>
        No timers found
    </p>
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

    ol > :not(:last-child)
    {
        margin: 0 0 var(--small-feature) 0;
    }

    li > :not(:last-child)
    {
        margin: 0 0 var(--tiny-feature) 0;
    }
</style>