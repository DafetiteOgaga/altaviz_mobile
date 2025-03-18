import {Ionicons} from '@expo/vector-icons'

let color: string|undefined = undefined
let getIcon: keyof typeof Ionicons.glyphMap|undefined = undefined
export function useGetIcon({variant}: {variant: string}) {
	if (variant === "pendingComponents") {color = '#17A2B8'; getIcon = 'cog-outline'}
	else if (variant === "pendingParts") {color = '#007BFF'; getIcon = 'cube-outline'}
	else if (variant === "faults") {color = '#FF4C4C'; getIcon = 'construct-outline'}
	else if (variant === "unconfirmedResolutions") {color = '#FFA500'; getIcon = 'hourglass-outline'}
	else if (variant === "account") {color = '#D3D3D3'; getIcon = 'construct-outline'}
	else if (variant === "allFaults") {color = '#FFD700'; getIcon = 'hourglass-outline'}
	else if (variant === "allRequests") {color = '#4682B4'; getIcon = 'hourglass-outline'}
	// console.log({variant}, {color}, {getIcon})
	return {color, getIcon}
}
