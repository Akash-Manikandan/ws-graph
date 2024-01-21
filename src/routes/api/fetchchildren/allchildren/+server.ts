import { json } from '@sveltejs/kit';
import { prisma } from '../../../db/prisma';

export async function GET({ request }) {
	const nodes = await prisma.node.findMany({});
	const edges = await prisma.edge.findMany({});
	return json({
		message: 'Success',
		content: {
			nodes,
			edges
		}
	});
}
