<script>
    'use strict';

    import { push, link } from 'svelte-spa-router';
    import { globalAccessToken, globalServerAddress } from '../lib/stores.js';
    import { revokeAccessToken, getAllTimersOfUser, deleteTimer } from '../lib/api-controller.js';

    // Variables for stores and global stuff
    let accessToken;
    let serverAddress;
    let timers;
    let timer;
    let countdown;
    let countdownTimeLeft;
    let countdownInterval;
    let isPaused = false;
    let workGong = new Audio('sounds/work-gong.mp3');
    let breakGong = new Audio('sounds/break-gong.mp3');

    // Subscribe to global stores
    globalAccessToken.subscribe((data) => {
        accessToken = data;
    });
    globalServerAddress.subscribe((data) => {
        serverAddress = data;
    });

    // Function for running a timer
    function runTimer(index) {
        getAllTimersOfUser(serverAddress, accessToken)
            .then((data) => {
                if (data.length < 2) {
                    push('/timers');
                } else {
                    timers = data;
                    timer = timers[index];
                    countdown = timer.duration + ':00';
                    countdownTimeLeft = timer.duration * 60 - 1;
                    countdownInterval = setInterval(() => {
                        let countdownMinutes = Math.floor(countdownTimeLeft / 60);
                        let countdownSeconds = countdownTimeLeft % 60;
                        if (countdownMinutes < 10) {
                            countdownMinutes = '0' + countdownMinutes;
                        }
                        if (countdownSeconds < 10) {
                            countdownSeconds = '0' + countdownSeconds;
                        }
                        countdown = countdownMinutes + ':' + countdownSeconds;
                        countdownTimeLeft--;
                        if (countdownTimeLeft === 0) {
                            clearInterval(countdownInterval);
                            if (timer.isBreak) {
                                deleteTimer(serverAddress, accessToken, timers[0].id)
                                    .then(() => {
                                        runTimer(0);
                                    })
                                    .catch((error) => {
                                        alert(error);
                                    });
                            } else {
                                runTimer(1);
                            }
                        }
                    }, 1000);
                    if (timer.isBreak) {
                        breakGong.play();
                    } else {
                        workGong.play();
                    }
                }
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

    // Function to toggle the state of a timer
    function toggleIsPaused() {
        isPaused = !isPaused;
        if (isPaused) {
            clearInterval(countdownInterval);
        } else {
            countdownInterval = setInterval(() => {
                let countdownMinutes = Math.floor(countdownTimeLeft / 60);
                let countdownSeconds = countdownTimeLeft % 60;
                if (countdownMinutes < 10) {
                    countdownMinutes = '0' + countdownMinutes;
                }
                if (countdownSeconds < 10) {
                    countdownSeconds = '0' + countdownSeconds;
                }
                countdown = countdownMinutes + ':' + countdownSeconds;
                countdownTimeLeft--;
                if (countdownTimeLeft === 0) {
                    clearInterval(countdownInterval);
                    if (timer.isBreak) {
                        deleteTimer(serverAddress, accessToken, timers[0].id)
                            .then(() => {
                                runTimer(0);
                            })
                            .catch((error) => {
                                alert(error);
                            });
                    } else {
                        runTimer(1);
                    }
                }
            }, 1000);
        }
    }

    // Function to forward to /timers
    function stopWorking() {
        push('/timers');
    }

    runTimer(0);
</script>

<header>
    <h1>pmdrtmr</h1>
    <nav>
        <a href="/timers" use:link>Timers</a>
        <a href="/settings" use:link>Settings</a>
        <button on:click={logOut}>Log out</button>
    </nav>
</header>
<main>
    {#if timer}
        <h2>
            {#if timer.isBreak}
                Break
            {:else}
                Work
            {/if}
        </h2>
        <p>{timer.description}</p>
        <p id="countdown">{countdown}</p>
        <p>
            <button on:click={toggleIsPaused}>
                {#if isPaused}
                    Resume
                {:else}
                    Pause
                {/if}
            </button>
        </p>
        <p>
            <button on:click={stopWorking}>Stop working</button>
        </p>
    {:else}
        <h2>Timer</h2>
        <p>Timer not found</p>
    {/if}
</main>
<footer>
    <p>2022 locxter</p>
</footer>

<style>
    #countdown {
        font-family: monospace;
        font-size: clamp(1.5rem, 30vw, 15rem);
        margin: 0;
    }
</style>
