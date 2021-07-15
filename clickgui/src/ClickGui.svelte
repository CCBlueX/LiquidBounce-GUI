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
                enabled: m.getEnabled(),
            });
        }
    } catch (err) {
        console.log(err);
    }

    function getModulesOfCategory(category) {
        return modules.filter((m) => m.category === category);
    }

    var isMousePressed = false;
    document.body.addEventListener("mousedown", function (e) {
        isMousePressed = true;
    });

    window.addEventListener("mouseup", function (e) {
        isMousePressed = false;
    });
    window.addEventListener("mousemove", function (e) {
        if (isMousePressed) {
            window.scrollBy(-e.movementX, -e.movementY);
        }
    });
</script>

<main>
    {#if clickGuiOpened}
        <div>
            {#each categories as category}
                <Panel {category} modules={getModulesOfCategory(category)} />
            {/each}
        </div>
    {/if}
</main>

<style>
    :global(body) {
        margin: 0;
        background-color: rgba(0, 0, 0, 0.4);
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        cursor: default;
    }
</style>
