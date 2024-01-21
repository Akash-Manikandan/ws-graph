import { json } from '@sveltejs/kit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../db/prisma';
import { getHTMLData } from '$lib/helper';

function isURLValid(url: string): boolean {
	const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
	return urlPattern.test(url);
}

function isDocumentLink(link: string) {
	return link.endsWith('.pdf') || link.endsWith('.doc') || link.endsWith('.docx');
}

function removeTrailingSpecialChars(inputString: string) {
	const regex = /[^\w\s]+$/;
	return inputString.replace(regex, '');
}

async function ifLinkPresent(url: string, baseUrlId: number, urlLevel: number) {
	try {
		await prisma.node.findUniqueOrThrow({
			where: {
				url: url
			},
			select: {
				id: true
			}
		});
		await prisma.node.update({
			where: {
				url: url
			},
			data: {
				pagerank: {
					increment: 1
				}
			},
			select: {
				id: true
			}
		});
		return true;
	} catch (e: any) {
		if (e instanceof PrismaClientKnownRequestError) {
			if (e.code === 'P2025') {
				const newNode = await prisma.node.create({
					data: {
						url: url,
						level: urlLevel + 1
					},
					select: {
						id: true
					}
				});
				await prisma.edge.create({
					data: {
						sourceNodeId: baseUrlId,
						destinationNodeId: newNode.id
					},
					select: {
						id: true
					}
				});
				return false;
			}
		}
		return false;
	}
}

export async function POST({ request }) {
	const { url, baseUrl } = await request.json();
	console.log(baseUrl);
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);
		const links: string[] = [];
		$('a').each((_, element) => {
			let link = $(element).attr('href');
			if (link) {
				link = removeTrailingSpecialChars(link).trim();
				if (!isDocumentLink(link) && isURLValid(link) && link.trim().includes(baseUrl.trim())) {
					links.push(link);
				}
			}
		});
		const filteredLink = [];
		const urlData = await prisma.node.findUniqueOrThrow({
			where: {
				url: url
			},
			select: {
				id: true,
				level: true,
				content: true
			}
		});

		const contentStr = await getHTMLData($);
		await prisma.content.upsert({
			create: {
				content: contentStr,
				nodeId: urlData.id
			},
			where: {
				nodeId: urlData.id
			},
			update: {
				content: contentStr
			}
		});
		for (const url of links) {
			if (!(await ifLinkPresent(url, urlData.id, urlData.level))) filteredLink.push(url);
		}

		return json({
			message: 'Success',
			content: filteredLink
			// content: {
			// 	nodes,
			// 	edges
			// }
		});
	} catch (error) {
		console.error('Error fetching the webpage:', error);
		return json({
			message: 'Error fetching the webpage',
			content: []
		});
	}
}
