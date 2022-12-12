const data = nodecg.Replicant('data');
const donationTotal = nodecg.Replicant('donationTotal');
const currencyRep = nodecg.Replicant('currency');

let countUp;
let currency;

NodeCG.waitForReplicants(currencyRep, donationTotal).then(() => {
	currencyRep.on('change', (newVal) => {
		currency = newVal;
	});
	donationTotal.on('change', (newVal) => handleCountUp(newVal));

	function handleCountUp(amount) {
		if (!countUp) {
			countUp = new CountUp('donationTotal', amount, amount, 0, 0.75, {
				prefix: currency,
			});
			countUp.start();
		} else countUp.update(amount);
	}
});
