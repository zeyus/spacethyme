<script lang="ts">
    import { pageName } from '$root/lib/stores.js';
    import { enhance } from '$app/forms';
    import { Spinner } from 'flowbite-svelte';
    import { P, Input, Fileupload, Label, Helper, Heading, Button, Select, Textarea } from 'flowbite-svelte'
	import { invalidate } from '$app/navigation';
    import type { Column } from '$lib/types';
    export let data;
	export let form;
    let columns: Column[] = [];
    let creating = false;

    // export let data;
    pageName.set("Import data");
    const authorizedExtensions = ['.csv']; // ['.csv', '.tsv', '.json', '.geojson'];
    const requiredCols = {
        'lat': 'Latitude',
        'lng': 'Longitude',
    };

    const optionalCols = {
        label: 'Label',
        description: 'Description (per entry)',
        date: 'Date',
        category: 'Category',
        radius: 'Radius',
        intensity: 'Intensity',
    };

    $: if (data && data.state) {
        pushCols();
    }

    function pushCols() {
        if (data?.state?.csvHeader) {
            data.state.csvHeader.forEach((col: string, i: number) => {
                columns.push({name: col, index: i});
            });
        }
    }
</script>
<div class="page-content">
    {#if creating}
    <h1>Hang tight, we're processing your data!</h1>
        <div class="text-center"><Spinner size=64 /></div>
    {:else}
        {#if (columns.length === 0)}
            <Heading class="py-4" tag="h6">Ready to visualize your data?</Heading>
            <form
                name="newdds"
                method="post"
                use:enhance={() => {
                    creating = true;
        
                    return async ({ update }) => {
                        await update();
                        pushCols();
                        creating = false;
                    };
                }}
                enctype="multipart/form-data"
                action="/import?/upload">
                {#if form?.error}
                    <P color="text-red-700 dark:text-red-500" class="my-5 px-4 error">Error: {form.message}</P>
                {/if}
                <div class='mb-6'>
                    <Label for='dsname' class='block mb-2'>Give your dataset a name</Label>
                    <Input disabled={creating} id='dsname' name="dsname" value={form?.dsname ?? ''} placeholder="Dataset Name" required />
                </div>
                
                <Label for="dssrc" class="pb-2">Upload file</Label>
                <Fileupload disabled={creating} accept={authorizedExtensions.join(',')} id="dssrc" class="mb-2" name="dssrc" required />
                <Helper>CSV file.</Helper>
                <div class="text-right"><Button type="submit" class="mt-4">Next</Button></div>
            </form>
        {:else}
            <Heading class="py-4" tag="h6">Just a couple more things...</Heading>
            <P class="pb-4">We need to know which columns in your dataset correspond to which data types.</P>
            <form
                name="dsconfig"
                method="post"
                use:enhance={() => {
                    creating = true;
        
                    return async ({ update }) => {
                        await update();
                        creating = false;
                    };
                }}
                action="/import?/configure">
                {#if form?.error}
                    <P color="text-red-700 dark:text-red-500" class="my-5 px-4 error">Error: {form.message}</P>
                {/if}
                <P class="pb-4 text-center" weight="bold">These columns are required</P>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    {#each Object.entries(requiredCols) as [key, value]}
                        <div>
                            <Label for={key} class='block mb-2'>{value}</Label>
                            <Select disabled={creating} id={key} name={key} required>
                                {#each columns as col}
                                    <option value={col.index}>{col.name}</option>
                                {/each}
                            </Select>
                        </div>
                    {/each}
                </div>
                <P class="py-4 text-center" weight="bold">These columns are optional</P>
                <div class="grid gap-6 mb-6 md:grid-cols-2">
                    {#each Object.entries(optionalCols) as [key, value]}
                        <div>
                            <Label for={key} class='block mb-2'>{value}</Label>
                            <Select disabled={creating} id={key} name={key}>
                                <option value={-1}>None</option>
                                {#each columns as col}
                                    <option value={col.index}>{col.name}</option>
                                {/each}
                            </Select>
                        </div>
                    {/each}
                </div>
                <Label for="dsdesc" class="pb-2">Give your dataset a brief description 😊</Label>
                <Textarea disabled={creating} id="dsdesc" name="dsdesc" placeholder="Description" />
                <div class="w-full"><Button type="submit" class="mt-4">Next</Button></div>
            </form>
            <form
                name="newdds"
                method="post"
                use:enhance={() => {
                    creating = true;
                    invalidate('data:foundmaps');
                    invalidate('/mapview');
                    return async ({ update }) => {
                        await update();
                        columns = [];
                        creating = false;
                    };
                }}
                enctype="multipart/form-data"
                action="/import?/resetstate"><Button color="alternative" type="submit" class="mt-4">Reset</Button></form>  
        {/if}
    {/if}
</div>

