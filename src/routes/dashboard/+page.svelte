<script lang="ts">
	import { browser } from '$app/environment';
	import {
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
		SvelteFlow,
		useSvelteFlow,
		type Node,
		type Edge,
		Position,
		MarkerType
	} from '@xyflow/svelte';
	import { writable } from 'svelte/store';
	import '@xyflow/svelte/dist/style.css';
	import { onMount } from 'svelte';
	import dagre from '@dagrejs/dagre';
	const { screenToFlowPosition, zoomIn, deleteElements } = useSvelteFlow();

	import type { BaseUrl, GraphData, Node as NodeData } from '$lib/types';
	const nodes = writable<Node[]>([]);
	const edges = writable<Edge[]>([]);
	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

	let baseUrlData: BaseUrl;
	let innerHeight: number;
	const snapGrid: any = [25, 25];

	if (browser) {
		baseUrlData = JSON.parse(localStorage.getItem('baseurl')!);
	}

	onMount(async () => {
		nodes.set([
			{
				id: `${baseUrlData.id}`,
				data: {
					label: baseUrlData.url.replace(baseUrlData.url, '/'),
					url: baseUrlData.url
				},
				position: { x: 0, y: 0 },
				type: ''
			}
		]);
		await getAllNodes();
	});
	const nodeWidth = 172;
	const nodeHeight = 36;

	function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
		const isHorizontal = direction === 'LR';
		dagreGraph.setGraph({ rankdir: direction });

		nodes.forEach((node) => {
			dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
		});

		edges.forEach((edge) => {
			dagreGraph.setEdge(edge.source, edge.target);
		});

		edges = edges.map((edge) => ({
			...edge,
			markerEnd: {
				type: MarkerType.ArrowClosed,
				width: 20,
				height: 20,
				color: '#FF0072'
			}
		}));

		dagre.layout(dagreGraph);
		const padding = 30;
		nodes.forEach((node) => {
			const nodeWithPosition = dagreGraph.node(node.id);
			node.targetPosition = isHorizontal ? Position.Left : Position.Top;
			node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
			node.position = {
				x: nodeWithPosition.x - nodeWidth / 2 + padding,
				y: nodeWithPosition.y - nodeHeight / 2 + padding * 10
			};
		});

		return { nodes, edges };
	}
	function onLayout(direction: string) {
		const layoutedElements = getLayoutedElements($nodes, $edges, direction);
		$nodes = layoutedElements.nodes;
		$edges = layoutedElements.edges;
		nodes.set(layoutedElements.nodes);
		edges.set(layoutedElements.edges);
	}
	function getLeafNodes(nodes: Node[], edges: Edge[]): Node[] {
		const nodeIdsWithEdges = new Set();

		edges.forEach((edge) => {
			nodeIdsWithEdges.add(edge.source);
		});
		const levelLink = nodes.filter((node) => !nodeIdsWithEdges.has(node.id));
		const highestLevel = Math.max(...levelLink.map((node) => node.data.level));
		const highestLevelLeafNodes = levelLink.filter((node) => node.data.level === highestLevel);
		return highestLevelLeafNodes;
	}
	const summa = async (url: string) => {
		const response = await fetch('/api/fetchchildren', {
			method: 'POST',
			body: JSON.stringify({
				url: url,
				baseUrl: baseUrlData.url
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await response.json();
		console.log(data);
		// const formattedNodes: Node[] = [];
		// const formattedEdges: Edge[] = [];
		// data.content.nodes.forEach((node, index) => {
		// 	formattedNodes.push({
		// 		id: `${node.id}`,
		// 		data: {
		// 			label:
		// 				node.url.replace(baseUrlData.url, '') == ''
		// 					? '/'
		// 					: node.url.replace(baseUrlData.url, ''),
		// 			url: node.url,
		// 			level: node.level
		// 		},
		// 		position: {
		// 			x: 0,
		// 			y: 0
		// 		}
		// 	});
		// });
		// data.content.edges.forEach((edge) => {
		// 	formattedEdges.push({
		// 		id: `${edge.id}`,
		// 		source: `${edge.sourceNodeId}`,
		// 		target: `${edge.destinationNodeId}`
		// 	});
		// });

		// nodes.set(formattedNodes);
		// edges.set(formattedEdges);
		// onLayout('TL');
	};
	const getAllNodes = async () => {
		const response = await fetch('/api/fetchchildren/allchildren', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data: GraphData = await response.json();
		const formattedNodes: Node[] = [];
		const formattedEdges: Edge[] = [];
		data.content.nodes.forEach((node, index) => {
			formattedNodes.push({
				id: `${node.id}`,
				data: {
					label:
						node.url.replace(baseUrlData.url, '') == ''
							? '/'
							: node.url.replace(baseUrlData.url, ''),
					url: node.url,
					level: node.level
				},
				position: {
					x: 0,
					y: 0
				}
			});
		});
		data.content.edges.forEach((edge) => {
			formattedEdges.push({
				id: `${edge.id}`,
				source: `${edge.sourceNodeId}`,
				target: `${edge.destinationNodeId}`
			});
		});

		nodes.set(formattedNodes);
		edges.set(formattedEdges);
		onLayout('TL');
	};

	const leafRender = async () => {
		const links = getLeafNodes($nodes, $edges);
		console.log(links);
		for (const link of links) {
			await summa(link.data.url);
			console.log(link);
		}
		await getAllNodes();
	};
</script>

<button on:click={leafRender}>Render</button>

<svelte:window bind:innerHeight />

<main>
	<div style:height={`${innerHeight * 0.94}px`}>
		<SvelteFlow
			{nodes}
			{edges}
			{snapGrid}
			fitView
			on:nodeclick={(event) => {
				console.log(event, event.detail.node.data.url);
				// summa(event.detail.node.data.url);
			}}
		>
			<Controls />
			<Background variant={BackgroundVariant.Lines} />
			<MiniMap />
		</SvelteFlow>
	</div>
</main>

<style>
</style>
