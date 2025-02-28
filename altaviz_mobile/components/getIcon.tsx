import {Ionicons} from '@expo/vector-icons'

let color: string|undefined = undefined
let getIcon: keyof typeof Ionicons.glyphMap|undefined = undefined
export function useGetIcon({variant}: {variant: string}) {
	if (variant === "pendingComponents") {color = '#17A2B8'; getIcon = 'cog-outline'}
	else if (variant === "pendingParts") {color = '#007BFF'; getIcon = 'cube-outline'}
	else if (variant === "faults") {color = '#FF4C4C'; getIcon = 'construct-outline'}
	else if (variant === "unconfirmedResolutions") {color = '#FFA500'; getIcon = 'hourglass-outline'}
	// console.log({variant}, {color}, {getIcon})
	return {color, getIcon}
}
