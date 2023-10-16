<script>
export default {
    name: "Clock",
    data() {
        return {
            hours: 0,
            minutes: 0,
            seconds: 0,
            ampm: ''
        }
    },
    mounted() {
        this.setTime()
        setInterval(() => this.setTime(), 1000)
    },
    methods: {
        setTime() {
            const date = new Date();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();

            // Convert hours to 12-hour format and determine AM/PM
            const ampm = hours < 12 ? 'AM' : 'PM';
            hours = hours % 12 || 12; // convert to 12-hour format
            hours = hours <= 9 ? `${hours}`.padStart(2, 0) : hours;
            minutes = minutes <= 9 ? `${minutes}`.padStart(2, 0) : minutes;
            seconds = seconds <= 9 ? `${seconds}`.padStart(2, 0) : seconds;

            // Update data properties
            this.hours = hours;
            this.minutes = minutes;
            this.seconds = seconds;
            this.ampm = ampm;
        }
    }
}
</script>

<template>
    <div class="Clockcontainer">
        <div class="test">
            <div class="hours">{{ hours }}</div>
            <div class="divider blinking" style="padding-left: 3px;padding-right: 3px;">:</div>
            <div class="minutes">{{ minutes }}</div>
            <div class="ampm" style="padding-left: 10px ;">{{ ampm }}</div>
        </div>
    </div>
</template>

<style scoped>
.test{
    padding: 10px 2em;
    border-radius: 1em;
    display: flex;
    background-color: rgb(var(--v-theme-surface-lighter-2));
}
.Clockcontainer {
    align-items: center;
    justify-content: center;
    margin-left: auto;
    display: flex;
    font-size: xx-large;
    color: rgb(var(--v-theme-primary));
}

.blinking {
    animation: blink 2s step-end infinite;
}

@keyframes blink {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}
</style>