let runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
let runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

NodeCG.waitForReplicants(runDataActiveRun, runDataArray).then(loadFromSpeedControl);

function getNextRuns(runData, amount) {
	let nextRuns = [];
	let indexOfCurrentRun = findIndexInRunDataArray(runData);
	for (let i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun + i]) {
			break;
		}
		nextRuns.push(runDataArray.value[indexOfCurrentRun + i]);
	}
	return nextRuns;
}

function findIndexInRunDataArray(run) {
	let indexOfRun = -1;
	if (run) {
		for (let i = 0; i < runDataArray.value.length; i++) {
			if (run.id === runDataArray.value[i].id) {
				indexOfRun = i; break;
			}
		}
	}
	return indexOfRun;
}

function loadFromSpeedControl() {
	runDataActiveRun.on('change', (newVal, oldVal) => {
		refreshNextRunsData(newVal);
	});

	runDataArray.on('change', (newVal, oldVal) => {
		refreshNextRunsData(runDataActiveRun.value);
	});

}

function refreshNextRunsData(currentRun) {
	const NUM_RUNS = 4;
	let nextRuns = getNextRuns(currentRun, NUM_RUNS);

	let upNextGame = '#up-next-game';
	let upNextNames = '#up-next-names';
	let upNextCategory = '#up-next-category';
	let upNextEstimate = '#up-next-estimate';
	fadeHtml(upNextGame, currentRun.game, true);
	fadeHtml(upNextCategory, currentRun.category, true);
	fadeHtml(upNextNames, getNamesForRun(runDataActiveRun.value).join(', '), true);
	fadeHtml(upNextEstimate, 'EST ' + currentRun.estimate, true);
	if (nodecg.bundleConfig.customData.useCustomHost && currentRun.customData.host !== undefined) {
		fadeHtml('#host', 'Host: ' + currentRun.customData.host);
		fadeHtml('#hostPronouns', currentRun.customData.hostPronouns);
	}
	else {
		fadeHtml('#host', '');
		fadeHtml('#hostPronouns', '');
	}

	let i = 0;
	for (let run of nextRuns) {
		if (i >= NUM_RUNS) {
			break;
		}
		let onDeckGame = '#on-deck-game' + (i + 1);
		let onDeckNames = '#on-deck-names' + (i + 1);
		let onDeckCategory = '#on-deck-category' + (i + 1);
		let onDeckEstimate = '#on-deck-estimate' + (i + 1);
		fadeHtml(onDeckGame, run.game, true);
		fadeHtml(onDeckNames, getNamesForRun(run).join(', '), true);
		fadeHtml(onDeckCategory, run.category, true);
		fadeHtml(onDeckEstimate, 'EST ' + run.estimate, true);
		i += 1;
	}
}
