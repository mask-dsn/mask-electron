async function main() {
	let connect = require("lotion-connect");

	let { state, send } = await connect(
		null,
		{
			genesis: require("./genesis.json"),
			nodes: ["http://8b6bcc10.ngrok.io"]
		}
	);

	console.log(await state);
}
main();
