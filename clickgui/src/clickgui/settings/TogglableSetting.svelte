<script>
    import { sineInOut } from "svelte/easing";
    import { slide } from "svelte/transition";

    import BooleanSetting from "./BooleanSetting.svelte";
    import ColorSetting from "./ColorSetting.svelte";
    import ListSetting from "./ListSetting.svelte";
    import RangeSetting from "./RangeSetting.svelte";
    import TextSetting from "./TextSetting.svelte";

    export let name;
    export let getValue;
    export let setValue;
    export let settings;

    let value = getValue();

    console.log(settings);

    function setTogglableValue(v) {
        value = v;
        setValue(v);
    }
</script>

<div class="setting">
    <div class="head">
        <BooleanSetting {name} getValue={() => value} setValue={setTogglableValue} />
    </div>

    {#if value}
        <div class="settings" transition:slide|global={{duration: 400, easing: sineInOut}}>
            {#each settings as s}
                {#if s.type === "boolean"}
                    <BooleanSetting {...s} />
                {:else if s.type === "range"}
                    <RangeSetting {...s} />
                {:else if s.type === "list"}
                    <ListSetting {...s} />
                {:else if s.type === "color"}
                    <ColorSetting {...s} />
                {:else if s.type === "text"}
                    <TextSetting {...s} />
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .settings {
        background-color: rgba(0, 0, 0, 0.36);
        border-right: solid 4px #4677FF;
        overflow: hidden;
    }
</style>