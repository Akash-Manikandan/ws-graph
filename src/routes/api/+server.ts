import { json } from '@sveltejs/kit';
import axios from 'axios';
import * as cheerio from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function isURLValid(url: string): boolean {
	const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
	return urlPattern.test(url);
}

function removeTrailingSpecialChars(inputString: string) {
	const regex = /[^\w\s]+$/;
	return inputString.replace(regex, '');
}

const baseUrl = 'https://www.svce.ac.in';

export async function POST({ request, cookies }) {
	const { url } = await request.json();
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);
		const links: string[] = [];
		$('a').each((_, element) => {
			const link = $(element).attr('href');
			if (link) {
				const absoluteUrl = new URL(link, url).href;
				if (
					new URL(absoluteUrl).host === new URL(baseUrl).host &&
					!/\.(docx|pdf|doc)$/i.test(absoluteUrl)
				) {
					if (isURLValid(absoluteUrl)) {
						const cleanedUrl = removeTrailingSpecialChars(absoluteUrl).replace(/\/$/, '');
						links.push(cleanedUrl);
					}
				}
			}
		});
		return json({
			message: 'Success',
			content: links
		});	
	} catch (error) {
		console.error('Error fetching the webpage:', error);
		return json({
			message: 'Error fetching the webpage',
			content: []
		});
	}
}












	// $('*')
		// 	.contents()
		// 	.each(function () {
		// 		if (this.nodeType === 8) {
		// 			// Node type 8 represents a comment
		// 			$(this).remove();
		// 		}
		// 	});

		// Extract meaningful content from specific tags
		// const meaningfulContent = $('body')
		// 	.find('.section')
		// 	.not('script, style, header, footer')
		// 	.text()
		// 	.replace(/\t+/g, '')
		// 	.replace('&nbsp;', ' ')
		// 	.replace(/  +/g, '')
		// 	.replace(/[\r\n]+/g, '\n')
		// 	.replaceAll('&amp;', '&')
		// 	.trim();
		// let content = meaningfulContent;
		// DOMPurify.sanitize(meaningfulContent, {
		// 	USE_PROFILES: { html: true }
		// });

		// console.log(content);
		// return {
		//   message: "Success",
		//   content: content,
		// };