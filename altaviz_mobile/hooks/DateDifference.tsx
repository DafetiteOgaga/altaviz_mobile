

const DateDifference = (isoString: string) => {
	if (!isoString) return
	const now = new Date();
	const date = new Date(isoString);
	const isToday = now.toDateString() === date.toDateString();
	// console.log({now}, {date})
	const timeDiff = now.getTime() - date.getTime();
	// console.log({timeDiff})
	let daysDiff = `${Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}-red-d`
	if (isToday) {
		let hoursOrMinutes = Math.floor(timeDiff / (1000 * 60 * 60))
		daysDiff = `${hoursOrMinutes}-grey-h`
		// console.log({daysDiff})
		if (hoursOrMinutes < 1) {
			hoursOrMinutes = Math.ceil(timeDiff / (1000 * 60))
			daysDiff = `${hoursOrMinutes}-grey-m`
		}
	}
	// console.log('Days diff: (detailScreen):', daysDiff)
	// console.log({daysDiff})

	const [duration, , mode] = daysDiff.split('-')
	const returnedMode = mode==='d'&&duration==='1'?'day':
						mode==='d'&&duration!=='1'?'days':
						mode==='h'&&duration==='1'?'hour':
						mode==='h'&&duration!=='1'?'hours':
						duration==='1'?'minute':
						'minutes'

	// console.log(`###### ${daysDiff}-${returnedMode}`)
	return `${daysDiff}-${returnedMode}`
};
export {DateDifference}