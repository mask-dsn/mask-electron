const lotion = require("lotion");

let app = lotion({
	initialState: {
		count: 0
	}
});

function transactionHandler(state, transaction) {
	if (state.count === transaction.nonce) {
		state.count++;
	}
}

app.use(transactionHandler);

app.start().then(appInfo => console.log(appInfo.GCI));
