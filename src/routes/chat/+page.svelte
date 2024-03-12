<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chat } from './types';
	import snarkdown from 'snarkdown'

	let maxWidth = 0;

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

	let innerHeight: number;
	let question: string;
	let chats: Chat[] = [];
	let response: string = 'This is the response';
	let disableInput: boolean = false;
	const onSubmit = async () => {
		disableInput = true;
		chats = [...chats, { role: 'User', message: question }];
		const que = question
		question = '';
		const response = await fetch("https://9de3-34-136-18-229.ngrok-free.app/chat/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body : JSON.stringify({
				question: que
			})
		})
		const data = await response.json()
		chats = [...chats, { role: 'SVCE AI', message: data.response }];
		disableInput = false;
	};

</script>

<svelte:window bind:innerHeight />
<!-- style:height={`${innerHeight}px`} -->
<div class="">
	<nav class="fixed text-2xl p-3 top-0 w-full bg-[#111A21] text-[#EDABEF]">
		<p>Chat</p>
	</nav>
	<div class="top-0 h-14 w-full bg-[#111A21]"></div>
	<div class="h-full w-full flex flex-col">
		{#each chats as chat, index (index)}
			<div class={'flex w-full p-2 ' + (index % 2 === 0 ? 'justify-end ' : 'justify-start ')}>
				<div
					class={'flex flex-col w-fit max-w-96 p-2 gap-3 rounded-xl ' +
						(index % 2 === 0
							? 'bg-[#111A21] text-white items-end'
							: ' bg-[#EDABEF] text-black items-start')}
					style="max-width: {maxWidth}px;"
				>
					<div class="text-xl font-bold">
						<p class="">{chat.role}</p>
					</div>
					<p class={'text-lg ' + (index % 2 === 0 ? 'text-right' : 'text-left')}>
						{@html chat.message}
					</p>
				</div>
			</div>
		{/each}
	</div>
	<div class="sticky w-full bg-white h-14 bottom-0"></div>
	<div class="fixed w-full bottom-0 flex flex-col justify-end">
		<div class="flex items-center justify-between gap-3 mx-2 my-2">
			<input
				type="text"
				placeholder="Enter query here"
				class="w-full py-2 px-4 rounded-full text-xl bg-[#111A21] placeholder-[#EDABEFaa] border border-gray-300 text-[#EDABEF] focus:ring-blue-500 focus:border-blue-500 block"
				bind:value={question}
				disabled={disableInput}
			/>
			<button type="button" disabled={disableInput} class="bg-[#EDABEF] rounded-full" on:click={onSubmit}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					viewBox="0 0 24 24"
					class="m-2"
					><path
						fill="#111A21"
						d="M4.4 19.425q-.5.2-.95-.088T3 18.5V14l8-2l-8-2V5.5q0-.55.45-.837t.95-.088l15.4 6.5q.625.275.625.925t-.625.925z"
					/></svg
				>
			</button>
		</div>
	</div>
</div>
