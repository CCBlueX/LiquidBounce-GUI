<script>
    import { onMount } from "svelte";

    export let name;
    export let min;
    export let max;
    export let step;
    export let getValue;
    export let setValue;

    let value = getValue();
    let multi = false;

    let valueString;
    function updateValueString() {
        if (multi) {
            valueString = `${value[0]} - ${value[1]}`
        } else {
            valueString = value[0].toString();
        }
    }

    let slider = null;
    onMount(() => {
        console.log(getValue());
        multi = value.length > 1;
        updateValueString();

        const start = value;
        let connect = "lower";
        if (multi) {
            connect = true;
        }

        noUiSlider.create(slider, {
            start: start,
            connect: connect,
            padding: [0, 0],
            range: {
                min: min,
                max: max,
            },
            step: step
        });

        slider.noUiSlider.on("update", values => {
            value = values.map(parseFloat);
            setValue[0](value[0]);
            if (multi) {
                setValue[1](value[1]);
            }

            updateValueString();
        });
    });
</script>

<div class="setting animation-fix">
    <div class="name">{name}</div>
    <div class="value">{valueString}</div>
    <div bind:this={slider} class="slider" />
</div>

<style>
    .setting {
        display: grid;
        grid-template-areas:
            "a b"
            "c c";
        grid-template-columns: 1fr;
        padding: 7px 10px;
    }

    /* Fix glitching of settings expand animation */
    .animation-fix {
        min-height: 51px;
    }

    .name {
        grid-area: a;
        font-weight: 500;
        color: white;
        font-size: 12px;
    }

    .slider {
        grid-area: c;
    }

    .value {
        grid-area: b;
        font-weight: 500;
        color: white;
        text-align: right;
        font-size: 12px;
    }
</style>
