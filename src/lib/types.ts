export interface Node {
	id: number;
	url: string;
	pagerank: number;
	level: number;
	isBaseUrl: boolean;
}

export interface Edge {
	id: number;
	sourceNodeId: number;
	destinationNodeId: number;
}

export interface GraphData {
	message: string;
	content: {
		nodes: Node[];
		edges: Edge[];
	};
}

export interface BaseUrl {
	childNodesId: number[];
	id: number;
	isBaseUrl: boolean;
	level: number;
	pagerank: number;
	url: string;
}
