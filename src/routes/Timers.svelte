<script>
    'use strict';

    import { push, link } from 'svelte-spa-router';
    import { globalAccessToken, globalServerAddress } from '../lib/stores.js';
    import { revokeAccessToken, getAllTimersOfUser, createTimer, deleteTimer, getCaldavDescriptions } from '../lib/api-controller.js';

    // Variables for stores and global stuff
    let accessToken;
    let serverAddress;
    let timers;
    let localTask;
    let caldavTasks;
    let showCaldavTasks = false;

    // Subscribe to global stores
    globalAccessToken.subscribe((data) => {
        accessToken = data;
    });
    globalServerAddress.subscribe((data) => {
        serverAddress = data;
    });

    // Function for loading the timer list
    function loadTimers() {
        getAllTimersOfUser(serverAddress, accessToken)
            .then((data) => {
                timers = data;
            })
            .catch((error) => {
                alert(error);
            });
    }

    // Function to log out of the current session
    function logOut() {
        revokeAccessToken(serverAddress, accessToken)
            .then(() => {
                globalAccessToken.set(null);
                globalServerAddress.set(null);
                push('/');
            })
            .catch((error) => {
                alert(error);
            });
    }

    // Function to toggle the visibility of CalDAV fetched tasks
    function toggleShowCaldavTasks() {
        showCaldavTasks = !showCaldavTasks;
        if (showCaldavTasks) {
            caldavTasks = null;
            getCaldavDescriptions(serverAddress, accessToken)
                .then((data) => {
                    caldavTasks = data;
                })
                .catch((error) => {
                    alert(error);
                    showCaldavTasks = false;
                });
        }
    }

    // Function to add a task to the timer list
    function addTask(task) {
        if (task) {
            let timer = {
                description: task,
            };
            if (task === localTask) {
                localTask = null;
            }
            createTimer(serverAddress, accessToken, timer)
                .then(() => {
                    loadTimers();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    }

    // Function to delete a task from the timer list
    function deleteTask(id) {
        deleteTimer(serverAddress, accessToken, id)
            .then(() => {
                loadTimers();
            })
            .catch((error) => {
                alert(error);
            });
    }

    // Function to forward to /timer
    function startWorking() {
        push('/timer');
    }

    loadTimers();
</script>

<header>
    <h1>
        pmdrtmr
    </h1>
    <nav>
        <a href="/timers" use:link>
            Timers
        </a>
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
    <p>
        <button on:click={toggleShowCaldavTasks}>
            {#if showCaldavTasks}
                Hide CalDAV tasks
            {:else}
                Show CalDAV tasks
            {/if}
        </button>
    </p>
    {#if showCaldavTasks}
        {#if caldavTasks && caldavTasks.length > 0}
            <ul>
                {#each caldavTasks as caldavTask}
                    <li>
                        <p>
                            {caldavTask}
                        </p>
                        <p>
                            <button on:click={addTask(caldavTask)}>
                                Add task
                            </button>
                        </p>
                    </li>
                {/each}
            </ul>
        {:else}
            <p>
                No CalDav tasks found
            </p>
        {/if}
    {/if}
    <p>
        <input type="text" placeholder="Task" bind:value={localTask}>
    </p>
    <p>
        <button on:click={addTask(localTask)}>
            Add task
        </button>
    </p>
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
                    <p>
                        <button on:click={deleteTask(timer.id)}>
                            Delete task
                        </button>
                    </p>
                    {/if}
                </li>
            {/each}
        </ol>
        <p>
            <button on:click={startWorking}>
                Start working
            </button>
        </p>
    {:else}
        <p>
            No timers found
        </p>
    {/if}
</main>
<footer>
    <p>
        2022 locxter
    </p>
</footer>
