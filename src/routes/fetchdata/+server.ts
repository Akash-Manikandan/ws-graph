import { json } from '@sveltejs/kit';
import { prisma } from '../db/prisma';

export async function GET({ request }) {
	const data = await prisma.node.findMany({
		select: {
			id: true,
			url: true,
			pagerank: true,
			content: {
				select: {
					content: true,
					id: true
				}
			}
		},
		orderBy: {
			pagerank: 'desc'
		}
	});
	let filteredData = data.filter((entry) => entry.content !== null);
	let filteredData1 = filteredData.filter((entry) => entry.content?.content.trim().length !== 0);
	return json(filteredData1);
}
