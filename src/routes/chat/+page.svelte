<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chat } from './types';
	import MarkdownIt from 'markdown-it';
	const md = new MarkdownIt();

	let maxWidth = 0;


	let innerHeight: number;
	let question: string;
	let chats: Chat[] = [];
	let disableInput: boolean = false;

	function stripTextBeforeColon(text: string) {
		const index = text.indexOf(':');
		const beforeColon = text.substring(0, index).trim();
		if (index !== -1 && beforeColon === 'SVCE AI') {
			return text.substring(index + 1).trim();
		} else {
			return text;
		}
	}

	const onSubmit = async () => {
		if (question.trim().length != 0) {
			disableInput = true;
			chats = [...chats, { role: 'User', message: question.trim() }];
			const que = question.trim();
			question = '';

			try {
				const response = await fetch('https://ea2d-34-106-80-113.ngrok-free.app/chat/', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						question: que.trim()
					})
				});
				const reader = response.body?.getReader();
				const decoder = new TextDecoder();
				let answer = '';
				while (true && reader) {
					const { done, value } = await reader.read();
					if (done) break;

					const text = decoder.decode(value);
					if (chats[chats.length - 1].role == 'SVCE AI') {
						chats.pop();
					}
					answer += text;
					chats = [...chats, { role: 'SVCE AI', message: stripTextBeforeColon(answer) }];
					window.scrollTo(0, document.body.scrollHeight);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
			}
			disableInput = false;
		}
	};

	function handleKeyDown(event: any) {
		if (event.key === 'Enter') {
			onSubmit();
		}
	}

	onMount(() => {
		maxWidth = Math.floor(window.innerWidth * 0.84);
		const updateMaxWidth = () => {
			maxWidth = Math.floor(window.innerWidth * 0.84);
		};
		window.addEventListener('resize', updateMaxWidth);
		return () => {
			window.removeEventListener('resize', updateMaxWidth);
		};
	});
</script>

<svelte:window bind:innerHeight />
<div class="">
	<nav class="fixed text-2xl h-14 top-0 w-full bg-[#fff] text-[#EE972E] drop-shadow-md">
		<div class="flex flex-row gap-3 items-center h-full">
			<img src="/logo.png" width="140" height="90" alt="logo" />
		</div>
	</nav>
	<div class="top-0 h-14 w-full bg-[#fff]"></div>
	<div class="h-full w-full flex flex-col" >
		{#each chats as chat, index}
			<div class={'flex w-full p-2 ' + (index % 2 === 0 ? 'justify-end ' : 'justify-start ')}>
				<div
					class={'flex flex-col w-fit max-w-96 p-2 gap-3 rounded-xl ' +
						(index % 2 === 0
							? 'bg-[#2b579a] text-white items-end pl-4'
							: ' bg-[#EE972E] text-black items-start pr-4')}
					style="max-width: {maxWidth}px;"
				>
					<div class="text-xl font-bold">
						<p class="">{chat.role}</p>
					</div>
					<p class={'text-lg ' + (index % 2 === 0 ? 'text-right' : 'text-left')}>
						{@html md.render(chat.message)}
					</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="sticky w-full bg-white h-[5.5rem] bottom-0 max-sm:h-[6.6rem]"></div>
	<div class="fixed w-full bottom-0 flex flex-col justify-end">
		{#if disableInput}
			<div class="flex items-center gap-4 justify-center">
				<div
					class="w-fit flex items-center gap-4 justify-center bg-white drop-shadow-md p-2 rounded-lg"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						{...$$props}
						><rect width="2.8" height="12" x="1" y="6" fill="currentColor"
							><animate
								id="svgSpinnersBarsScale0"
								attributeName="y"
								begin="0;svgSpinnersBarsScale1.end-0.1s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="6;1;6"
							/><animate
								attributeName="height"
								begin="0;svgSpinnersBarsScale1.end-0.1s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="12;22;12"
							/></rect
						><rect width="2.8" height="12" x="5.8" y="6" fill="currentColor"
							><animate
								attributeName="y"
								begin="svgSpinnersBarsScale0.begin+0.1s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="6;1;6"
							/><animate
								attributeName="height"
								begin="svgSpinnersBarsScale0.begin+0.1s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="12;22;12"
							/></rect
						><rect width="2.8" height="12" x="10.6" y="6" fill="currentColor"
							><animate
								attributeName="y"
								begin="svgSpinnersBarsScale0.begin+0.2s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="6;1;6"
							/><animate
								attributeName="height"
								begin="svgSpinnersBarsScale0.begin+0.2s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="12;22;12"
							/></rect
						><rect width="2.8" height="12" x="15.4" y="6" fill="currentColor"
							><animate
								attributeName="y"
								begin="svgSpinnersBarsScale0.begin+0.3s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="6;1;6"
							/><animate
								attributeName="height"
								begin="svgSpinnersBarsScale0.begin+0.3s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="12;22;12"
							/></rect
						><rect width="2.8" height="12" x="20.2" y="6" fill="currentColor"
							><animate
								id="svgSpinnersBarsScale1"
								attributeName="y"
								begin="svgSpinnersBarsScale0.begin+0.4s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="6;1;6"
							/><animate
								attributeName="height"
								begin="svgSpinnersBarsScale0.begin+0.4s"
								calcMode="spline"
								dur="0.6s"
								keySplines=".36,.61,.3,.98;.36,.61,.3,.98"
								values="12;22;12"
							/></rect
						></svg
					>
					<p>Loading Response</p>
				</div>
			</div>
		{/if}

		<div class="w-full flex flex-col items-center px-2 max-sm:text-center">
			<div class="w-full flex items-center justify-between gap-3 mx-2 my-2">
				<input
					type="text"
					placeholder="Enter query here"
					class={'w-full py-2 px-4 rounded-lg text-xl bg-[#fff] placeholder-[#111A21aa] border border-gray-300 text-[#111A21] focus:ring-[#2b579a] focus:border-[#2b579a] block ' +
						(disableInput && 'cursor-not-allowed')}
					bind:value={question}
					disabled={disableInput}
					on:keydown={handleKeyDown}
				/>
				<button
					type="button"
					disabled={disableInput}
					class={'bg-[#EE972E] rounded-lg ' + (disableInput && 'cursor-not-allowed')}
					on:click={onSubmit}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						viewBox="0 0 24 24"
						class="m-2"
						><path
							fill="#2b579a"
							d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z"
						/></svg
					>
				</button>
			</div>
			<div class="text-sm mb-1 flex gap-1 max-sm:flex-col max-sm:gap-0">
				<p>SVCE AI can make mistakes.</p>
				<div>
					Consider checking important information at
					<a class="underline" href="https://www.svce.ac.in/" target="_blank">www.svce.ac.in</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.chat-container {
		overflow-y: auto;
		height: 300px;
	}
</style>
