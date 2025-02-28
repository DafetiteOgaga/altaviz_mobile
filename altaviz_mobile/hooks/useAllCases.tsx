/**
 * handle various cases of strings
 */

const excempts: string[] = [
	"is", "and", "a", "to", "an", "the", "for", "nor", "but", "or", "yet", "so",
	"as", "at", "by", "from", "in", "of", "on", "off", "out", "per", "up", "with",
	"about", "after", "along", "amid", "among", "around", "before", "between",
	"beyond", "despite", "during", "inside", "into", "near", "onto", "outside",
	"over", "past", "since", "through", "throughout", "under", "underneath",
	"until", "upon", "within", "without"
]
const operateOnStr = (str: string, operation: string) => {
	const firstChar = str.charAt(0).toUpperCase()
	// console.log('11111'.repeat(5), {firstChar})
	const otherChars = str.split(operation).map(word => !excempts.includes(word)?word.charAt(0).toUpperCase()+word.slice(1):word)
	// console.log('22222'.repeat(5), {otherChars})
	const newStr = otherChars.map((char, index) => (index===0?firstChar + char.slice(1):char))
	return newStr.join(operation)
}

// convert string to title case
const toTitleCase = (str: string) => {
	if (!str) return ''
	let newStr
	if (str.includes('-')) {
		newStr = operateOnStr(str, '-')
	}
	else if (str.includes('(')) {
		newStr = operateOnStr(str, '(')
	}
	else if (str.includes(' ')) {
		newStr = operateOnStr(str, ' ')
	}
	else if (str.includes('/')) {
		newStr = operateOnStr(str, '/')
	} else {
		newStr = str.charAt(0).toUpperCase() + str.slice(1)
	}
	return newStr
}
export { toTitleCase}