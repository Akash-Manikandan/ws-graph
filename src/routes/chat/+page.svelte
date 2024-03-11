<script lang="ts">
	import type { Chat } from './types';

	let innerHeight: number;
	let question: string;
	let chats: Chat[] = [];
	let response: string = 'This is the response';

	const onSubmit = async () => {
		chats.push({ role: 'User', message: question });
		setTimeout(() => {
			chats.push({ role: 'SVCE AI', message: response });
			console.log(chats);
		}, 3000);
	};
</script>

<svelte:window bind:innerHeight />
<!-- style:height={`${innerHeight}px`} -->
<div class="">
	<nav class="fixed text-2xl p-3 top-0 w-full bg-[#111A21] text-[#EDABEF]">
		<p>Chat</p>
	</nav>
	<div class="top-0 h-14 w-full bg-[#111A21]"></div>
	<!-- <div class="">
		{#each chats as chat, index}
			<p>{chat.role}</p>
			<p>{chat.message}</p>
		{/each}
	</div> -->

	<div class="h-full w-full flex flex-col">
		{#each Array(40) as _, index (index)}
			<div class={'flex w-full gap-3 p-2 ' + (index % 2 === 0 ? 'justify-end' : 'justify-start')}>
				<p>{index + 1}</p>
				<p>message</p>
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
			/>
			<button type="button" class="bg-[#EDABEF] rounded-full" on:click={onSubmit}>
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
