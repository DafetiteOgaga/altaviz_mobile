import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Text, View, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useHeader } from '@/context/headerUpdate';
import { toTitleCase } from '@/hooks/useAllCases';
import { ScreenStyle } from '@/myConfig/navigation';
import { useColorMode } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useGetIcon } from '@/components/getIcon';
import { ThemedText } from '@/components/ThemedText';
import { useGetDataFromStorage } from '@/context/useGetDataFromStorage';
import { useDelete, usePatch } from '@/requests/makeRequests';
import Toast from 'react-native-toast-message';
import RequestItem from './requestItem';

// const DetailScreen = ({ route }) => {
export default function DetailScreen () {
	const [renderComponentRequestForm, setRenderComponentRequestForm] = useState<boolean>(false)
	const [renderPartRequestForm, setRenderPartRequestForm] = useState<boolean>(false)
	const uniColorMode = useColorMode();
	const navigation: any|undefined = useNavigation();
	const userDetails = useGetDataFromStorage('headerDetails')
	const { setHeaderTitle } = useHeader();
	let { data, arrayData, type, variant } = useLocalSearchParams();
	const { color, getIcon } = useGetIcon({variant: String(variant)})

	const handerComponentRequestFormRender = (switchValue=null)=>{setRenderComponentRequestForm(switchValue!==null?switchValue:!renderComponentRequestForm)}
	const handerPartRequestFormRender = (switchValue=null)=>{setRenderPartRequestForm(switchValue!==null?switchValue:!renderPartRequestForm)}
	let item: any
	let parsedArray: any
	// @ts-ignore
	item = JSON.parse(data)
	// @ts-ignore
	parsedArray = JSON.parse(arrayData)
	// title = `${String(type).toLowerCase()!=='fault'?'Request':'Fault'} #${item?.id} - ${toTitleCase(item?.name?.name||item?.title?.name||'')}`
	console.log('Parsed item (detailScreen):', JSON.stringify(item, null, 4));
	const title = `${String(type).toLowerCase()!=='fault'?'Request':'Fault'} #${item?.id} - ${toTitleCase(item?.name?.name||item?.title?.name||'')}`
	useEffect(()=>setHeaderTitle(title), [title])
	const [requestDuration, requestColorStyle, requestMode] = dateDifference(item?.requested_at)?.split?.('-')||[]
	const [faultDuration, fauktColorStyle, faultMode] = dateDifference(item?.created_at)?.split?.('-')||[]
	const loggedBy = item?.logged_by?.custodian?.id
	const assignedTo = item?.fault?.assigned_to?.id||item?.assigned_to?.id
	const managedBy = item?.fault?.managed_by?.id||item?.managed_by?.id
	const supervisedBy = item?.fault?.supervised_by?.id||item?.supervised_by?.id
	const parsedArrayString = JSON.stringify(parsedArray)
	console.log('userDetails (in detailScreen):', userDetails)
	const modeType = (item?.type)?'request':'fault'
	const role = userDetails?.role
	const resolvedBy = (item?.replacement_engineer?.email)||(item?.assigned_to?.email)
	console.log('role:', role)
	const resolutionDetails = {
		loggedBy: item?.logged_by?.custodian?.email,
		assignedTo: item?.assigned_to?.email,
		managedBy: item?.managed_by?.email,
		supervisedBy: item?.supervised_by?.email,
		resolvedBy: resolvedBy,
		region: item?.logged_by?.branch?.region?.name
	}
	const hasRequestsAndApproved = item?.requestComponent?.some?.((comp:any)=>comp.approved)||item?.requestPart?.some?.((part:any)=>part.approved)||false
	console.log({hasRequestsAndApproved})
	return (
		<ScrollView style={[ScreenStyle.allScreenContainer, styles.detailMain, {marginBottom: 0,}]}>
			<ThemedText type={'link'}>Assigned to: {assignedTo}</ThemedText>
			<ThemedText type={'link'}>Managed by: {managedBy}</ThemedText>
			<ThemedText type={'link'}>Supervised by: {supervisedBy}</ThemedText>
			<ThemedText type={'link'}>faultid: {item?.id}</ThemedText>
			<ThemedText type={'link'}>arrayData: {parsedArrayString?.slice(0, 50)}</ThemedText>
			<ThemedText type={'link'}>type: {String(type)}</ThemedText>
			<ThemedText type={'link'}>item type (modeType): {modeType}</ThemedText>
			<ThemedText type={'link'}>replacement_engineer: {item?.replacement_engineer?.email}</ThemedText>
			<ThemedText type={'link'}>assigned_to: {item?.assigned_to?.email}</ThemedText>
			<ThemedText type={'link'}>resolutionDetails: {JSON.stringify(resolutionDetails, null, 4)}</ThemedText>
			<ThemedText type={'link'}>hasRequestsAndApproved: {hasRequestsAndApproved?.toString()}</ThemedText>
			{/* <CustomDropdown /> */}
			{/* <RequestItem id={item?.id} type={'component'} url='request-component' /> */}
			<View style={{paddingBottom: 20}}>
				{!data ?
					(<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />) :
					(
					String(type).toLowerCase()!=='fault' ?
						<View style={[styles.card, {
							// backgroundColor: 'green'
							}]}>
							<View style={[styles.header, {
								backgroundColor: uniColorMode.newdrkb
								// backgroundColor: 'darkslategrey'
								}]}>
								<View style={styles.titleWIcon}>
									<Ionicons name={getIcon} size={15} color={color} />
									<Text style={[styles.title, { color: color }]}>{toTitleCase(item?.name?.name||item?.title?.name)}</Text>
								</View>
								<View style={styles.titleWIcon}>
									<Ionicons name={getIcon} size={15} color={'transparent'} />
									<Text style={[styles.subtitle, { color: 'skyblue' }]}>Quantity: {item?.quantityRequested}</Text>
								</View>
							</View>

							{/* Status Section */}
							<View style={styles.statusContainer}>
								<Text style={styles.label}>Status:</Text>
								<Text style={[styles.statusText, { backgroundColor: getStatusColor({item, type: 'request'}) }]}>
									{getStatusText({item, type: 'request'})}
								</Text>
								<Text style={[styles.statusText, { color: requestColorStyle }]}>
									({requestDuration} {
									(requestMode==='d'&&requestDuration==='1')?'Day':requestMode==='d'&&requestDuration!=='1'?'Days':
									(requestMode==='h'&&requestDuration==='1')?'Hour':requestMode==='h'&&requestDuration!=='1'?'Hours':
									(requestDuration==='1')?'Minute': 'Minutes'} Ago)
								</Text>
							</View>

							{/* pressValue='detailScreen' */}
							{/* Request Details */}
							<View style={[styles.infoContainer, { backgroundColor: uniColorMode.newdrkb1 }]}>
								<InfoRow label="Bank" value={item?.fault?.logged_by?.branch?.bank?.name?.toUpperCase()} valueColor={{ color: 'lightsteelblue' }} icon="business-outline" iconColor={{ color: 'lightblue' }} />
								<InfoRow label="Branch" value={toTitleCase(item?.fault?.logged_by?.branch?.name||'')} valueColor={{ color: 'lightsteelblue' }} icon="location-outline" iconColor={{ color: 'lightblue' }} />
								<InfoRow label="State" value={`${toTitleCase(item?.fault?.logged_by?.branch?.state?.name||'')}|${item?.fault?.logged_by?.branch?.state?.initial}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
								<InfoRow label="Location" value={toTitleCase(item?.fault?.logged_by?.branch?.location?.location||'')} valueColor={{ color: 'lightsteelblue' }} icon="navigate-outline" iconColor={{ color: 'teal' }} />
								<InfoRow label="Requested by" value={toTitleCase(item?.user?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: 'userProfile', additionals: {id: assignedTo}}} />
								<InfoRow label="Requested on" value={formatDate(item?.requested_at)} valueColor={{ color: 'lightsteelblue' }} icon="calendar-outline" iconColor={{ color: 'slateblue' }} />
								<InfoRow label="Fault" value={toTitleCase(item?.fault?.title?.name||'')}
									valueColor={{ color: 'lightsteelblue' }}
									// valueColor={{ color: 'orange', textDecorationLine: 'underline' }}
									icon="alert-circle-outline" iconColor={{ color: 'red' }}
									// pressValue={{path: 'blueBlank', additionals: {id: assignedTo, faultID: item?.fault?.id, arrayData: parsedArrayString}}}
									/>
								<InfoRow label="Fault ID" value={`#${item?.fault?.id}`} valueColor={{ color: 'lightsteelblue' }} icon="barcode-outline" iconColor={{ color: 'red' }} />
								<InfoRow label="Managed by" value={toTitleCase(item?.fault?.managed_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="briefcase-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: 'userProfile', additionals: {id: managedBy}}} />
								<InfoRow label="Supervised by" value={toTitleCase(item?.fault?.supervised_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="checkmark-done-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: 'userProfile', additionals: {id: supervisedBy}}} />
								<InfoRow label="Reason" value={item?.other} valueColor={{ color: 'lightsteelblue' }} icon="help-circle-outline" iconColor={{ color: 'white' }} />
							</View>
						</View>
					:
					<View style={[styles.card, {
						// backgroundColor: uniColorMode.background
						}]}>
						<View style={[styles.header, {
								backgroundColor: uniColorMode.newdrkb
								// backgroundColor: 'darkslategrey'
								}]}>
								<View style={styles.titleWIcon}>
									<Ionicons name={getIcon} size={15} color={color} />
									<Text style={[styles.title, { color: color }]}>{toTitleCase(item?.title?.name||'')}</Text>
								{/* <Text style={[styles.subtitle, { color: 'skyblue' }]}>Quantity: {item?.quantityRequested}</Text> */}
								</View>
							</View>

							{/* Status Section */}
							<View style={styles.statusContainer}>
								<Text style={styles.label}>Status:</Text>
								<Text style={[styles.statusText, { backgroundColor: getStatusColor({item, type: 'fault'}) }]}>
									{getStatusText({item, type: 'fault'})}
								</Text>
								<Text style={[styles.statusText, { color: fauktColorStyle }]}>
									({faultDuration} {
									(faultMode==='d'&&faultDuration==='1')?'Day':faultMode==='d'&&faultDuration!=='1'?'Days':
									(faultMode==='h'&&faultDuration==='1')?'Hour':faultMode==='h'&&faultDuration!=='1'?'Hours':
									(faultDuration==='1')?'Minute': 'Minutes'} Ago)
								</Text>
							</View>

							{/* Request Details */}
							<View style={[styles.infoContainer, { backgroundColor: uniColorMode.newdrkb1 }]}>
								<View style={styles.bankId}>
									<InfoRow label="Bank" value={item?.logged_by?.branch?.bank?.name?.toUpperCase()} valueColor={{ color: 'lightsteelblue' }} icon="business-outline" iconColor={{ color: 'lightblue' }} />
									<InfoRow label="ID" value={`#${item?.id}`} valueColor={{ color: 'white' }} line={{borderWidth: 1,
										// , marginVertical: 0,
										gap: 0,
										}} />
								</View>
								<InfoRow label="Branch" value={toTitleCase(item?.logged_by?.branch?.name||'')} valueColor={{ color: 'lightsteelblue' }} icon="location-outline" iconColor={{ color: 'lightblue' }} />
								<InfoRow label="State" value={`${toTitleCase(item?.logged_by?.branch?.state?.name||'')}|${item?.logged_by?.branch?.state?.initial}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
								<InfoRow label="Region" value={`${toTitleCase(item?.logged_by?.branch?.region?.name||'')}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
								<InfoRow label="Location" value={toTitleCase(item?.logged_by?.branch?.location?.location||'')} valueColor={{ color: 'lightsteelblue' }} icon="navigate-outline" iconColor={{ color: 'teal' }} />
								<InfoRow label="Logged by" value={toTitleCase(item?.logged_by?.custodian?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: 'userProfile', additionals: {id: loggedBy}}} />
								<InfoRow label="Logged on" value={formatDate(item?.created_at)} valueColor={{ color: 'lightsteelblue' }} icon="calendar-outline" iconColor={{ color: 'slateblue' }} />
								<InfoRow label="Assigned to" value={toTitleCase(item?.assigned_to?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: 'userProfile', additionals: {id: assignedTo}}} />
								<InfoRow label="Managed by" value={toTitleCase(item?.managed_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="briefcase-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: 'userProfile', additionals: {id: managedBy}}} />
								<InfoRow label="Supervised by" value={toTitleCase(item?.supervised_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="checkmark-done-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: 'userProfile', additionals: {id: supervisedBy}}} />
								<InfoRow label="Other" value={item?.other} valueColor={{ color: 'lightsteelblue' }} icon="help-circle-outline" iconColor={{ color: 'white' }} />
							</View>

						{ // Requests
						(item?.requestStatus)&& (
						<View style={[styles.requestStatus, {backgroundColor: uniColorMode.newdrkb1,}]}>
							<View>
								<Text style={[styles.title, styles.requestTitle, {backgroundColor: uniColorMode.shadowLeft,}]}>Requests:</Text>
							</View>
							<View style={styles.partsCompContainer}>
								<View>
									{item?.requestComponent&&
									<View>
										<Text style={styles.itemColor}>Component{(item?.requestComponent?.length>1)?'s':undefined}</Text>
									</View>}
									{item?.requestComponent?.map?.((component: Record<string|number, any>, index: number) => {
										const approved = component.approved
										const rejected = component.rejected
										console.log('detailScreen:', {approved}, {rejected})
										return (
											<View
											key={component.id}
											style={[styles.requestRow]}>
												<Ionicons name={approved?'checkmark':rejected?'close':'ellipsis-horizontal-circle-outline'} size={15} color={approved?'green':rejected?'red':'lightsteelblue'} />
												<Text style={styles.requestLabel}>{index+1}. {toTitleCase(component.name.name||'')}:</Text>
												<Text style={styles.requestLabel}>#{component.id}</Text>
											</View>
										);
									})}
								</View>
								<View>
									{item?.requestPart&&
									<View>
										<Text style={styles.itemColor}>Part{(item?.requestPart?.length>1)?'s':undefined}</Text>
									</View>}
									{item?.requestPart?.map?.((part: Record<string|number, any>, index: number) => {
										const approved = part.approved
										const rejected = part.rejected
										console.log('detailScreen:', {approved}, {rejected})
										return (
											<View
											key={part.id}
											style={[styles.requestRow]}>
												<Ionicons name={approved?'checkmark':rejected?'close':'ellipsis-horizontal-circle-outline'} size={15} color={approved?'green':rejected?'red':'lightsteelblue'} />
												<Text style={styles.requestLabel} numberOfLines={1} ellipsizeMode="tail">{index+1}. {toTitleCase(part.name.name||'')}:</Text>
												<Text style={styles.requestLabel}>#{part.id}</Text>
											</View>
										);
									})}
								</View>
							</View>
						</View>
					)}
					</View>)
				}
				{renderComponentRequestForm&&
				<View>
					<RequestItem email={userDetails?.email} id={item?.id} type={'component'} url='request-component' setForm={handerComponentRequestFormRender} />
				</View>}
				{renderPartRequestForm&&
				<View>
					<RequestItem email={userDetails?.email} id={item?.id} type={'part'} url='request-part' setForm={handerPartRequestFormRender} />
				</View>}
				<View style={styles.actionContainer}>
					{(getStatusText({item, type: 'fault'})!=='Unconfirmed') &&
						(modeType === 'request' ?
							<>
								<ActionButton
									icon={getIcon}
									id={item?.id}
									label={role}
									type={item?.type}
									background={['red', 'darkred']}
									buttonText={['Withdraw Request', 'Withdrawing...']}
									modeType={modeType}
									// onPress={() => null}
									/>
							</>
							:
							<>
								<View>
									{role==='engineer' &&
									<View style={{flexDirection: 'row', gap: 20}}>
										<ActionButton
											icon={'cog-outline'}
											id={item?.id}
											label={role}
											// type={item?.type}
											background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
											buttonText={['Request Component', 'Requesting...']}
											modeType={modeType}
											textColor={'#17A2B8'}
											setForm={handerComponentRequestFormRender}
											onPress={5}
											/>
										<ActionButton
											icon={'cube-outline'}
											id={item?.id}
											label={role}
											// type={item?.type}
											background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
											buttonText={['Request Part', 'Requesting...']}
											modeType={modeType}
											textColor={'#007BFF'}
											setForm={handerPartRequestFormRender}
											onPress={5}
											/>
									</View>}
									{/* <View style={}> */}
									<View style={role==='engineer'?{justifyContent: 'center', alignItems: 'center', marginTop: 10}:{flexDirection: 'row', gap: 20}}>
										{(role!=='custodian'||!hasRequestsAndApproved) &&
										<ActionButton
											icon={role==='engineer'?'hourglass-outline':'construct-outline'}
											id={item?.id}
											label={role}
											userID={userDetails?.id}
											// type={item?.type}
											background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
											buttonText={role==='engineer'?['Seek Confirmation', 'Seeking...']:['Withdraw Fault', 'Withdrawing...']}
											modeType={modeType}
											textColor={role==='engineer'?'#FFA500':'#FF4C4C'}
											// onPress={() => null}
											/>}
										{role!=='engineer' &&
										<ActionButton
											icon={'hourglass-outline'}
											id={item?.id}
											label={role}
											userID={userDetails?.id}
											// type={item?.type}
											background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
											buttonText={['Confirm Resolution', 'Confirming...']}
											modeType={modeType}
											textColor={'#FFA500'}
											resolutionDetails={resolutionDetails}
											// onPress={() => null}
											/>}
									</View>
								</View>
							</>)}
				</View>
			</View>
		</ScrollView>
	);
};

const ActionButton = ({ icon, label, id, type, background, buttonText, modeType, textColor, userID, setForm, onPress, resolutionDetails }: customComponent) => {
	const uniColorMode = useColorMode()
	const navigation: any|undefined = useNavigation();
	const { deleteData, isDeleteError, isDeleteLoading, DeleteSetup }: useTypes = useDelete();
	const { patchData, isPatchError, isPatchLoading, PatchSetup }: useTypes = usePatch();
	let url: string = ''
	const handleNavigate = () => {
		if (label?.toLowerCase()==='engineer') {
			if (buttonText?.[0]==='Request Component'||buttonText?.[0]==='Request Part') {setForm!()}
		}
	}
	if (label?.toLowerCase()==='engineer') {
		if (type) {
			url = `request-${type}/${id}/delete/`
		} else if (buttonText?.[0]==='Seek Confirmation') {
			url = `pending-faults/${userID}/`
		}
		console.log('url (ActionButton in detailScreen):', url)
		console.log('label (ActionButton in detailScreen):', label)
		console.log('modeType (ActionButton in detailScreen):', modeType)
		console.log('type (ActionButton in detailScreen):', type)
		console.log('buttonText (ActionButton in detailScreen):', buttonText)
		console.log('id (ActionButton in detailScreen):', id)
		console.log('...')
	} else if (label?.toLowerCase()==='supervisor') {
		buttonText = ['Delete Request']
	} else if (label?.toLowerCase()==='human-resource') {
		buttonText = ['Delete Request']
	} else if (label?.toLowerCase()==='custodian') {
		if (buttonText?.[0]==='Withdraw Fault') {
			url = `fault/${id}/delete/`
		} else if (buttonText?.[0]==='Confirm Resolution') {
			url = `unconfirmed-faults/${userID}/`
		}
	} else if (label?.toLowerCase()==='workshop') {
		buttonText = ['Delete Request']
	} else if (label?.toLowerCase()==='help-desk') {
		buttonText = ['Delete Request']
	}
	const handleRequests = () => {
		const formData = new FormData();
		formData.append('faultID', `${id}`)
		// formData.append('verify_resolve', 'true')
		if (label?.toLowerCase()==='engineer') {
			if (type) {
				DeleteSetup(url)
			} else {
				formData.append('verify_resolve', 'true')
				// @ts-ignore
				PatchSetup(url, formData)
			}
		} else if (label?.toLowerCase()==='custodian') {
			if (buttonText?.[0]==='Withdraw Fault') {
				DeleteSetup(url)
			} else {
				formData.append('confirm_resolve', 'true')
				formData.append('resolvedBy', resolutionDetails.resolvedBy!)
				formData.append('managedBy', resolutionDetails.managedBy!)
				formData.append('supervisedBy', resolutionDetails.supervisedBy!)
				formData.append('region', resolutionDetails.region!)
				formData.append('deliveries', '1')
				// @ts-ignore
				PatchSetup(url, formData)
			}
		}
	}
	useEffect(() => {
		if (isDeleteError||isPatchError) {
            console.log('isDeleteError||isPatchError (detailScreen):', isDeleteError||isPatchError)
			Toast.show({
				type: 'error', // 'success' | 'error' | 'info'
				text1: isDeleteError||isPatchError||'',
			});
        } else if (deleteData||patchData) {
            console.log('deleteData||patchData (detailScreen):', deleteData||patchData)
			Toast.show({
				type: 'success', // 'success' | 'error' | 'info'
				// @ts-ignore
				text1: toTitleCase(deleteData?.msg||patchData?.msg||''),
			});
			// navigation.navigate('dashboard')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteData, isDeleteError, patchData, isPatchError]);
	console.log('detailSreen', {isDeleteLoading}, {modeType})
	return (
		<TouchableOpacity
		onPress={onPress?handleNavigate:handleRequests} disabled={isDeleteLoading}
		style={[styles.actionButton, {backgroundColor: isDeleteLoading?background?.[1]:background?.[0]}]}>
			<Ionicons name={icon} size={15} color={textColor?textColor:uniColorMode.text} />
			<Text style={[styles.actionText, {color: textColor?textColor:uniColorMode.text}]}>{(isDeleteLoading||isPatchLoading)?buttonText?.[1]:buttonText?.[0]}</Text>
		</TouchableOpacity>
	)
};

type customComponent = {
    icon: any,
	mode?: string,
	label: string,
	variant?: string,
	onPress?: any,
	userID?: number,
	urlRoute?: string,
	screen?: string,
	id?: number,
	type?: string,
	background?: string[]|undefined,
	buttonText?: string[]|undefined,
	modeType?: string,
	textColor?: string,
	resolutionDetails?: any,
	setForm?: ()=>void,
	onRefresh?: ()=>void,
	endOnRefresh?: (value: boolean)=>void,
}
type useTypes = {
	deleteData?: Record<string, any>|null,
	isDeleteError?: string|null,
	isDeleteLoading?: boolean,
	DeleteSetup?: (url: string)=>void
	patchData?: Record<string, any>|null,
	isPatchError?: string|null,
	isPatchLoading?: boolean,
	PatchSetup?: (url: string)=>void
	// msg?: string
}

interface InfoRowProps {
    label?: string;
    value?: string | number | null | undefined;
    icon?: keyof typeof Ionicons.glyphMap|undefined,
	iconColor?: { color: string }
	valueColor?: { color: string, textDecorationLine?: string }
	pressValue?: {path: string, additionals?: Record<string, any>}|undefined
	line?: any
}

  // Reusable Row Component
const InfoRow = ({ label, value, icon, iconColor, valueColor, pressValue, line }: InfoRowProps) => {
	const navigation: any|undefined = useNavigation();
	const onpress = ()=>navigation.navigate(
		pressValue!.path,
		{...pressValue!.additionals }
	)
	return (
    <View style={[styles.row]} >
        <Ionicons name={icon} size={18} color={iconColor?.color} />
        <Text style={[styles.label]}>{label}:</Text>
		<TouchableOpacity onPress={onpress} disabled={!pressValue} >
			<Text style={[styles.value, valueColor]}>{value || 'N/A'}</Text>
		</TouchableOpacity>
    </View>
)};

interface itemType {
	item: Record<string, any>
	approved?: boolean
	rejected?: boolean
	confirm_resolve?: boolean
	verify_resolve?: boolean
}
// Function to get status text
const getStatusText = ({item, type}: {item: itemType, type: string}) => {
	if (type==='request') {
		if (!item?.approved && !item?.rejected) return 'Pending';
		return item?.approved ? 'Approved' : 'Rejected';
	} else {
		if (!item?.confirm_resolve && !item?.verify_resolve) return 'Pending';
		return item?.confirm_resolve ? 'Resolved' : 'Unconfirmed';
	}
};

// Function to determine status color
const getStatusColor = ({item, type}: {item: itemType, type: string}) => {
	// console.log()
	if (type==='request') {
		if (!item?.approved && !item?.rejected) return 'orange'; // Orange for pending
		return item?.approved ? 'green' : 'red'; // Green for approved, Red for rejected
	} else {
		if (!item?.verify_resolve && !item?.confirm_resolve) return 'orange'; // Orange for pending
		return item?.confirm_resolve ? 'green' : 'darkcyan';
	}
};

const formatDate = (isoString: string) => {
	const date = new Date(isoString);
	const formattedDate = date.toLocaleDateString("en-US", {
		weekday: "short", // "Mon"
		month: "short",   // "Jan"
		day: "2-digit",   // "13"
		year: "numeric"   // "2025"
	}).replace(/,/g, "") // Remove commas
	const formattedTime = date.toLocaleTimeString("en-GB", {
		hour12: false // to 12hours format
	})
	return `${formattedDate} at ${formattedTime}`
};

const dateDifference = (isoString: string) => {
	if (!isoString) return
	const now = new Date();
	const date = new Date(isoString);
	const timeDiff = now.getTime() - date.getTime();
	let daysDiff = `${Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}-red-d`
	if (Number(daysDiff.split('-')[0]) < 1) {
		daysDiff = `${Math.ceil(timeDiff / (1000 * 60 * 60))}-grey-h`
		if (Number(daysDiff.split('-')[0]) < 1) {
			daysDiff = `${Math.ceil(timeDiff / (1000 * 60))}-grey-m`
		}
	}
	console.log('Days diff: (detailScreen):', daysDiff)
	return daysDiff
};

// Styles
const styles = StyleSheet.create({
    card: {
		paddingHorizontal: 20,
		borderRadius: 20,
		// marginBottom: 20,
	},
    header: {
		marginBottom: 15,
		// backgroundColor: 'yellow',
		alignSelf: 'flex-start',
		paddingVertical: 10,
		paddingRight: 25,
		paddingLeft: 10,
		borderRadius: 5,
		// color: modColor,
	},
    title: {
		fontSize: 18,
		fontWeight: 'bold',
		// color: '#fff'
	},
    subtitle: {
		// fontSize: 14,
		// color: '#fff'
	},
    statusContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		// marginVertical: 5,
		// color: '#fff'
	},
    statusText: {
		padding: 5,
		borderRadius: 5,
		fontStyle: 'italic',
		// color: '#fff',
		fontWeight: 'bold'
	},
    infoContainer: {
		marginTop: 10,
		padding: 10,
		borderRadius: 10,
		// backgroundColor: '#fff'
	},
    row: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 8,
		gap: 5,
		flexWrap: 'wrap',
		// color: '#fff'
	},
    icon: {
		marginRight: 8,
		// color: 'grey',
	},
    label: {
		fontWeight: 'bold',
		// marginRight: 5,
		color: '#fff',
	},
    value: {
		// flexWrap: 'wrap',
		// overflow: 'hidden',
		// backgroundColor: 'yellow'
	},
	detailMain: {
		paddingVertical: 10,
		paddingHorizontal: 15,
		// paddingBottom: 50,
	},
	loading: {
		marginTop: 250,
	},
	titleWIcon: {
		flexDirection: 'row',
		gap: 2,
		// alignItems: 'center'
	},
	requestStatus: {
		flexDirection: 'column',
		padding: 10,
		borderRadius: 10,
		marginTop: 15,
	},
	partsCompContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		gap: 30,
	},
	itemColor: {
		color: 'darkcyan',
		fontSize: 17,
		fontWeight: 'bold',
		paddingBottom: 8,
	},
	requestRow: {
		flexDirection: 'row',
		// alignItems: 'center',
		paddingVertical: 4,
		gap: 3,
		overflow: 'hidden',
		// maxWidth: 200,
		// flexWrap: 'wrap',
		// color: '#fff'
		// borderWidth: 1,
	},
	requestLabel: {
		// fontWeight: 'bold',
		// marginRight: 5,
		color: 'lightsteelblue',
		flexWrap: 'wrap',
		textDecorationLine: 'underline',
	},
	requestTitle: {
		alignSelf: 'flex-start',
		paddingVertical: 3,
		paddingLeft: 5,
		paddingRight: 10,
		marginBottom: 5,
		color: 'skyblue',
		borderRadius: 5,
	},
	actionContainer: {
		marginTop: 15,
		flexDirection: "row",
		justifyContent: "space-evenly",
	},
	actionButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 16,
		// padding: 10,
		// backgroundColor: "#E2E8F0",
		borderRadius: 50,
		// marginBottom: 10,
	},
	actionText: {
		marginLeft: 5,
		fontSize: 16,
		fontWeight: "500",
	},
	bankId: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
});
