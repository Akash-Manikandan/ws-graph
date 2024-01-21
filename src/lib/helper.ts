import axios from 'axios';
import * as cheerio from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';

export async function getHTMLData($: cheerio.CheerioAPI) {
	$('*')
		.contents()
		.each(function () {
			if (this.nodeType === 8) {
				$(this).remove();
			}
		});
	$('footer').remove();
	$('style').remove();
	$('script').remove();
	$('header').remove();
	$('.site-footer').remove();
	const meaningfulContent = $('body')
		.find('.section')
		.text()
		.replace(/\t+/g, '')
		.replace('&nbsp;', ' ')
		.replace(/  +/g, '')
		.replace(/[\r\n]+/g, '\n')
		.replaceAll('&amp;', '&')
		.trim();
	let content = meaningfulContent;
	content = DOMPurify.sanitize(meaningfulContent, {
		USE_PROFILES: { html: true }
	});
	content = content.replace(/{.*?}/g, '');
	console.log(content, content.length);
	return content;
}
