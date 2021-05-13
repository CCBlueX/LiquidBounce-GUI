<script>
    import { sineInOut } from "svelte/easing";
    import { slide } from "svelte/transition";

    import BooleanSetting from "./settings/BooleanSetting.svelte";
    import RangeSetting from "./settings/RangeSetting.svelte";
    import ListSetting from "./settings/ListSetting.svelte";
    import ColorSetting from "./settings/ColorSetting.svelte";
    import TextSetting from "./settings/TextSetting.svelte";
    import TogglableSetting from "./settings/TogglableSetting.svelte";

    export let name;
    export let enabled;
    export let settings;
    export let setEnabled;

    let expanded = false;

    function handleToggle(e) {
        setEnabled(!enabled);
    }

    function handleToggleSettings(event) {
        if (event.button === 2) {
            expanded = !expanded;
        }  
    }
</script>

<div>
    <div on:mousedown={handleToggleSettings} on:click={handleToggle} class:has-settings={settings.length > 0} class:enabled={enabled} class:expanded={expanded} class="module">{name}</div>
    {#if expanded}
        <div class="settings" transition:slide={{duration: 400, easing: sineInOut}}>
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
                {:else if s.type === "togglable"}
                    <TogglableSetting {...s} />
                {/if}
            {/each}
        </div>
    {/if}
</div>

<style>
    .module {
        color: #CBD1E3;
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        padding: 10px;
        transition: ease background-color 0.2s, ease color 0.2s;
        position: relative;
    }

    .module.enabled {
        color: white;
    }

    .module:hover {
        background-color: rgba(0, 0, 0, 0.36);
    }

    .module.has-settings::after {
        content: "";
        display: block;
        position: absolute;
        height: 10px;
        width: 10px;
        right: 15px;
        top: 50%;
        background-image: url("../img/settings-expand.svg");
        background-position: center;
        background-repeat: no-repeat;
        opacity: 0.5;
        transform-origin: 50% 50%;
        transform: translateY(-50%) rotate(-90deg);
        transition: ease opacity 0.2s, ease transform 0.4s;
    }

    .settings {
        background-color: rgba(0, 0, 0, 0.36);
        border-left: solid 4px #4677FF;
        overflow: hidden;
    }

    .module.has-settings.expanded::after {
        transform: translateY(-50%) rotate(0);
        opacity: 1;
    }
</style>
