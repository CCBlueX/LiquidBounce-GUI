<script>
    import Panel from "./clickgui/Panel.svelte";

    let clickGuiOpened = true;

    const categories = [
        "Movement",
        "Combat",
        "Render",
        "Exploit",
        "Player",
        "World",
        "Misc",
        "Fun",
    ];
    const modules = [];
    
    try {
        const moduleIterator = client.getModuleManager().iterator();

        while (moduleIterator.hasNext()) {
            const m = moduleIterator.next();
            modules.push({
                category: m.getCategory().getReadableName(),
                name: m.getName(),
                instance: m,
                enabled: m.getEnabled()
            });
        }
    } catch (err) {
        console.log(err);
    }

    function getModulesOfCategory(category) {
        return modules.filter(m => m.category === category);
    }
</script>

<main>
    <div class="body">
    
        {#if clickGuiOpened}
            <div class="clickgui-container">
                {#each categories as category}
                    <Panel category={category} modules={getModulesOfCategory(category)} />
                {/each}
            </div>
        {/if}
    </div>
</main>

<style>
    .clickgui-container {
        background-color: rgba(0, 0, 0, .4);
        height: 100vh;
        width: 100vw;
        -webkit-user-select: none;
        -ms-user-select: none; 
        user-select: none; 
        cursor: default;
    }
    .body{
        overflow-y: hidden;
    }
</style>