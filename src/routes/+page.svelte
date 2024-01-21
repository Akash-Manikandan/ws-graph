<!-- <script lang="ts">
	import {
		Background,
		BackgroundVariant,
		Controls,
		MiniMap,
		SvelteFlow,
		type Node,
		type Edge,
		Position,
		MarkerType
	} from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { writable } from 'svelte/store';
	import dagre from '@dagrejs/dagre';

	export class NodeList {
		id: number;
		url: string;
		content: string;
		score: number;
		constructor(id: number, url: string, content: string = '', score = 0) {
			this.id = id;
			this.url = url;
			this.content = content;
			this.score = score;
		}
		incrementScore() {
			this.score += 1;
		}
	}
	interface NodeData {
		id: string;
		data: { label: string; url: string };
		position: { x: number; y: number };
	}

	interface EdgeData {
		id: string;
		source: string;
		target: string;
	}

	interface DataResponse {
		message: string;
		content: string[];
	}
	// const nodes = writable<NodeData[]>([]);
	// const edges = writable<EdgeData[]>([]);
	const snapGrid: any = [25, 25];
	let innerHeight: number;
	const baseUrl = 'https://svce.ac.in';
	const findNodeByUrl = (
		url: string,
		listOfNode: NodeList[]
	): { found: boolean; index: number } => {
		const index = listOfNode.findIndex((node) => node.url === url);
		return { found: index !== -1, index };
	};

	const dagreGraph = new dagre.graphlib.Graph();
	dagreGraph.setDefaultEdgeLabel(() => ({}));

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
			},
		}));

		dagre.layout(dagreGraph);

		nodes.forEach((node) => {
			const nodeWithPosition = dagreGraph.node(node.id);
			node.targetPosition = isHorizontal ? Position.Left : Position.Top;
			node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
			node.position = {
				x: nodeWithPosition.x - nodeWidth / 2 + 10,
				y: nodeWithPosition.y - nodeHeight / 2 + 10
			};
		});

		return { nodes, edges };
	}

	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
		[
			{
				id: '1',
				data: { label: '1', url: baseUrl },
				position: { x: 0, y: 0 }
			}
		],
		[]
	);

	const nodes = writable<Node[]>(layoutedNodes);
	const edges = writable<Edge[]>(layoutedEdges);

	function onLayout(direction: string) {
		const layoutedElements = getLayoutedElements($nodes, $edges, direction);
		$nodes = layoutedElements.nodes;
		$edges = layoutedElements.edges;
		nodes.set(layoutedElements.nodes);
		edges.set(layoutedElements.edges);
	}

	let nodes1: NodeData[] = [];
	let edges1: EdgeData[] = [];
	const listOfNode: NodeList[] = [new NodeList(1, baseUrl)];
	const getUrlData = async (mainUrl: string) => {
		const response = await fetch('/api', {
			method: 'POST',
			body: JSON.stringify({ url: mainUrl }),
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data: DataResponse = await response.json();
		for (const url of data.content) {
			const { found, index } = findNodeByUrl(url, listOfNode);
			if (found) {
				listOfNode[index].incrementScore();
			} else {
				const newNode = new NodeList(listOfNode.length + 1, url);
				listOfNode.push(newNode);
			}
		}
		for (const url of listOfNode) {
			nodes1.push({
				id: `${nodes1.length + 1}`,
				data: { label: `${nodes1.length + 1}`, url: url.url },
				position: { x: 0, y: 0 }
			});
			const baseNode = listOfNode[findNodeByUrl(mainUrl, listOfNode).index];
			edges1.push({
				id: `e${baseNode.id}-${url.id}`,
				source: `${baseNode.id}`,
				target: `${url.id}`
			});
		}
		nodes.set(nodes1);
		edges.set(edges1);
		console.log($nodes, $edges);
		onLayout('LR');
	};
</script>

<svelte:window bind:innerHeight />

<main>
	<div style:height={`${innerHeight}px`}>
		<SvelteFlow
			{nodes}
			{edges}
			{snapGrid}
			fitView
			on:nodeclick={(event) => {
				console.log('on node click', event.detail.node.data.url);
				getUrlData(event.detail.node.data.url);
			}}
		>
			<Controls />
			<Background variant={BackgroundVariant.Dots} />
			<MiniMap />
		</SvelteFlow>
	</div>
</main> -->

<script lang="ts">
	import { goto } from '$app/navigation';
	let url: string = 'https://www.svce.ac.in';
	const onSubmit = async () => {
		if (url.length !== 0) {
			const response = await fetch('/addbase', {
				method: 'POST',
				body: JSON.stringify({ url: url, isBaseUrl: true }),
				headers: {
					'Content-Type': 'application/json'
				}
			});
			const data = await response.json();
			localStorage.setItem('baseurl', JSON.stringify(data));
			goto('/dashboard');
		}
	};
</script>

<div class="flex gap-2 p-3">
	<input type="text" class="p-2 border rounded" placeholder="url" bind:value={url} />
	<button type="submit" on:click={onSubmit}>Submit</button>
</div>
