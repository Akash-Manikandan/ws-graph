import { json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST({ request }) {
	const { url, isBaseUrl } = await request.json();
	const data = await prisma.node.upsert({
		where: {
			url: url
		},
		create: {
			url,
			isBaseUrl,
		},
		update: {}
	});

	return json(data);
}
