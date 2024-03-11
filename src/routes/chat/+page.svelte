<script lang="ts">
	import { onMount } from 'svelte';
	import type { Chat } from './types';

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
			<div class={'flex w-full p-2 ' + (index % 2 === 0 ? 'justify-end ' : 'justify-start ')}>
				<div
					class={'flex flex-col w-fit max-w-96 p-2 gap-3 rounded-xl ' +
						(index % 2 === 0
							? 'bg-[#111A21] text-white items-end'
							: ' bg-[#EDABEF] text-black items-start')}
					style="max-width: {maxWidth}px;"
				>
					<div class="text-2xl font-bold">
						{#if index % 2 === 0}
							<p class="">User</p>
						{:else}
							<p class="">SVCE AI</p>
						{/if}
					</div>
					<p class="text-xl">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin laoreet rhoncus est.
						Curabitur a massa pulvinar, interdum nibh non, sodales turpis. Suspendisse pharetra
						hendrerit efficitur. Mauris in enim elit. Cras purus magna, pulvinar et leo id,
						elementum scelerisque ipsum. Nullam ut blandit sem, a auctor ante. Ut aliquam ultrices
						mollis. In quis ligula ipsum. Vestibulum ultrices cursus nibh non accumsan. Aenean ac
						pulvinar ipsum, sed lobortis lectus. Donec elementum sapien et malesuada rhoncus.
						Curabitur tempus lacinia enim, a venenatis urna elementum ut. Donec condimentum dolor
						nec accumsan fringilla. Proin molestie id nisi ut vehicula. Nunc tincidunt dapibus
						maximus. Mauris porta convallis sem id euismod. Praesent vehicula ut lorem nec
						scelerisque. Morbi quis ex et turpis consectetur efficitur. Ut ac felis faucibus,
						ullamcorper metus vitae, auctor erat. Duis sed tellus sit amet mi scelerisque
						condimentum vitae ut dui. Pellentesque pharetra nunc lectus, eget maximus orci hendrerit
						at. Vestibulum pellentesque magna eu eros imperdiet, eget iaculis velit feugiat.
						Interdum et malesuada fames ac ante ipsum primis in faucibus. In ultricies posuere sem
						eget varius. Fusce at cursus ante, sed pellentesque enim. Duis eros massa, blandit nec
						volutpat eu, facilisis vel enim.
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
