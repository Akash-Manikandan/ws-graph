<script>
	import { SvelteFlowProvider } from '@xyflow/svelte';
	import '../app.css';
</script>
<SvelteFlowProvider>
	<slot />
</SvelteFlowProvider>
