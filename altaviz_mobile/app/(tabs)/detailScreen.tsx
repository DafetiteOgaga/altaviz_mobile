import React, {useEffect, useState} from 'react';
import { ScrollView, StyleSheet, ActivityIndicator, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, useRouter, usePathname } from 'expo-router';
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
import { getComponentName } from '@/hooks/getComponentName';
import { DateDifference } from '@/hooks/DateDifference';

export default function DetailScreen () {
	getComponentName()
	const path = usePathname()
	const [renderComponentRequestForm, setRenderComponentRequestForm] = useState<boolean>(false)
	const [renderPartRequestForm, setRenderPartRequestForm] = useState<boolean>(false)
	const uniColorMode = useColorMode();
	const router = useRouter();
	const userDetails = useGetDataFromStorage('headerDetails')
	const { setHeaderTitle } = useHeader();
	let { data, arrayData, type, variant, engineer } = useLocalSearchParams();
	const { color, getIcon } = useGetIcon({variant: String(variant)})

	const handleComponentRequestFormRender = (switchValue=null)=>{setRenderComponentRequestForm(switchValue!==null?switchValue:!renderComponentRequestForm)}
	const handlePartRequestFormRender = (switchValue=null)=>{setRenderPartRequestForm(switchValue!==null?switchValue:!renderPartRequestForm)}
	let item: any
	let parsedArray: any
	// @ts-ignore
	item = JSON.parse(data)
	// @ts-ignore
	parsedArray = JSON.parse(arrayData)
	// console.log('Parsed item (detailScreen):', JSON.stringify(item, null, 4));
	if (engineer) type = 'fault'
	// console.log(
	// 	'\ntype (detailScreen):', type,
	// 	'\nengineer (detailScreen):', engineer, '12345',
	// 	// '\nitem (detailScreen):', item,
	// 	// '\narrayData (detailScreen):', parsedArray,
	// 	'\nvartiant (detailScreen):', variant,
	// )
	const [requestDuration, requestColorStyle, requestMode, returnedRequestMode] = DateDifference(item?.requested_at)?.split?.('-')||[]
	const [faultDuration, faultColorStyle, faultMode, returnedfaultMode] = DateDifference(item?.created_at)?.split?.('-')||[]
	const loggedBy = item?.logged_by?.custodian?.id
	const assignedTo = item?.fault?.assigned_to?.id||item?.assigned_to?.id
	const managedBy = item?.fault?.managed_by?.id||item?.managed_by?.id
	const supervisedBy = item?.fault?.supervised_by?.id||item?.supervised_by?.id
	const parsedArrayString = JSON.stringify(parsedArray)
	// console.log('userDetails (in detailScreen):', userDetails)
	const role = userDetails?.role
	// console.log('role (detailScreen):', role)
	const modeType =
		// (item?.type==='fixed-part')?'request':
		item?.type?'request':'fault'
	// console.log('modeType (detailScreen):', modeType)
	// console.log('type (detailScreen):', type)
	const title = `${modeType==='fault'?'Fault':
					(String(type).toLowerCase()==='parts'&&role==='human-resource')?'Fixed Part':
					String(type).toLowerCase()==='parts'?'Posted Part':
					'Request'} #${item?.id} - ${toTitleCase(item?.name?.name||item?.title?.name||'')}`
	useEffect(()=>{if (path.split('/')[1]==='detailScreen') setHeaderTitle(title)}, [title])
	const resolvedBy = (item?.replacement_engineer?.email)||(item?.assigned_to?.email)
	const resolutionDetails = {
		loggedBy: item?.logged_by?.custodian?.email,
		assignedTo: item?.assigned_to?.email,
		managedBy: item?.managed_by?.email,
		supervisedBy: item?.supervised_by?.email,
		resolvedBy: resolvedBy,
		region: item?.logged_by?.branch?.region?.name
	}
	const hasRequestsAndApproved = item?.requestComponent?.some?.((comp:any)=>comp.approved)||item?.requestPart?.some?.((part:any)=>part.approved)||false
	// console.log({hasRequestsAndApproved})
	const requestsForComponents = {
		email: userDetails?.email,
		id: item?.id,
		type: 'component',
		url: 'request-component',
		setForm: handleComponentRequestFormRender,
		screen: 'detailScreen',
	}
	const requestsForParts = {
		email: userDetails?.email,
		id: item?.id,
		type: 'part',
		url: 'request-part',
		setForm: handlePartRequestFormRender,
		screen: 'detailScreen',
	}
	const notWorkshopAndHR = role!=='workshop'&&role!=='human-resource'
	const backgroundImage = require('../../assets/images/altavizDoodleDark.png')
	return (
		<ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
			<ScrollView style={[ScreenStyle.allScreenContainer, styles.detailMain, {marginBottom: 0,}]}>
				{/* <ThemedText type={'link'}>Assigned to: {assignedTo}</ThemedText>
				<ThemedText type={'link'}>Managed by: {managedBy}</ThemedText>
				<ThemedText type={'link'}>Supervised by: {supervisedBy}</ThemedText>
				<ThemedText type={'link'}>faultid: {item?.id}</ThemedText>
				<ThemedText type={'link'}>title: {title}</ThemedText>
				<ThemedText type={'link'}>arrayData: {parsedArrayString?.slice(0, 50)}</ThemedText>
				<ThemedText type={'link'}>type: {String(type)}</ThemedText>
				<ThemedText type={'link'}>item type (modeType): {modeType}</ThemedText>
				<ThemedText type={'link'}>replacement_engineer: {item?.replacement_engineer?.email}</ThemedText>
				<ThemedText type={'link'}>assigned_to: {item?.assigned_to?.email}</ThemedText>
				<ThemedText type={'link'}>resolutionDetails: {JSON.stringify(resolutionDetails, null, 4)}</ThemedText>
				<ThemedText type={'link'}>hasRequestsAndApproved: {hasRequestsAndApproved?.toString()}</ThemedText>
				<ThemedText type={'link'}>role: {role}</ThemedText> */}
				{/* <ThemedText type={'link'}>item: {JSON.stringify(item, null, 4)}</ThemedText> */}
				{/* <CustomDropdown /> */}
				{/* <RequestItem id={item?.id} type={'component'} url='request-component' /> */}
				<View style={{paddingBottom: 20}}>
					{(!item||!userDetails) ?
						(<ActivityIndicator style={styles.loading} size="large" color={uniColorMode.buttonSpin} />)
						:
						(<>
							{modeType!=='fault' ?
							// request display
							<View style={[styles.card]}>
								<View style={[styles.header, {
									backgroundColor: uniColorMode.newdrkb}]}>
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
									<Text style={styles.label}>Status:{'  '}</Text>
									<Text style={[styles.statusText, { backgroundColor: getStatusColor({item, type: 'request'}) }]}>
										{getStatusText({item, type: 'request'})}
									</Text>
									<Text style={[styles.statusText, { color: requestColorStyle }]}>
										({requestDuration} {returnedRequestMode} ago)
									</Text>
								</View>

								{/* Request Details others */}
								{notWorkshopAndHR ?
								<View style={[styles.infoContainer, { backgroundColor: uniColorMode.newdrkb1 }]}>
									<View style={styles.bankId}>
									<InfoRow label="Bank" value={item?.fault?.logged_by?.branch?.bank?.name?.toUpperCase()} valueColor={{ color: 'lightsteelblue' }} icon="business-outline" iconColor={{ color: 'lightblue' }} />
										{/* @ts-ignore */}
										<InfoRow label="ID" value={`#${item?.id}`} valueColor={{ color: 'white', fontStyle: 'italic', }} line={{borderWidth: 1, gap: 0}} />
									</View>
									{/* <InfoRow label="Bank" value={item?.fault?.logged_by?.branch?.bank?.name?.toUpperCase()} valueColor={{ color: 'lightsteelblue' }} icon="business-outline" iconColor={{ color: 'lightblue' }} /> */}
									<InfoRow label="Branch" value={toTitleCase(item?.fault?.logged_by?.branch?.name||'')} valueColor={{ color: 'lightsteelblue' }} icon="card-outline" iconColor={{ color: 'lightblue' }} />
									<InfoRow label="State" value={`${toTitleCase(item?.fault?.logged_by?.branch?.state?.name||'')}|${item?.fault?.logged_by?.branch?.state?.initial}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
									<InfoRow label="Location" value={toTitleCase(item?.fault?.logged_by?.branch?.location?.location||'')} valueColor={{ color: 'lightsteelblue' }} icon="navigate-outline" iconColor={{ color: 'teal' }} />
									<InfoRow label="Requested by" value={toTitleCase(item?.user?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: assignedTo}}} />
									<InfoRow label="Requested on" value={formatDate(item?.requested_at)} valueColor={{ color: 'lightsteelblue' }} icon="calendar-outline" iconColor={{ color: 'slateblue' }} />
									<InfoRow label="Fault" value={toTitleCase(item?.fault?.title?.name||'')}
										valueColor={{ color: 'lightsteelblue' }}
										// valueColor={{ color: 'orange', textDecorationLine: 'underline' }}
										icon="alert-circle-outline" iconColor={{ color: 'red' }}
										// pressValue={{path: '/blueBlank', additionals: {id: assignedTo, faultID: item?.fault?.id, arrayData: parsedArrayString}}}
										/>
									<InfoRow label="Fault ID" value={`#${item?.fault?.id}`} valueColor={{ color: 'lightsteelblue' }} icon="barcode-outline" iconColor={{ color: 'red' }} />
									<InfoRow label="Managed by" value={toTitleCase(item?.fault?.managed_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="briefcase-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: managedBy}}} />
									<InfoRow label="Supervised by" value={toTitleCase(item?.fault?.supervised_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="checkmark-done-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: supervisedBy}}} />
									<InfoRow label="Reason" value={item?.other} valueColor={{ color: 'lightsteelblue' }} icon="help-circle-outline" iconColor={{ color: 'white' }} />
								</View>
								:
								// Request Details workshop
								<View style={[styles.infoContainer, { backgroundColor: uniColorMode.newdrkb1 }]}>
									<View style={styles.bankId}>
										<InfoRow label={`${item?.type==='fixed-part'?'Posted':'Requested'} by`} value={toTitleCase(item?.user?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: userDetails?.id}}} />
										{/* @ts-ignore */}
										<InfoRow label="ID" value={`#${item?.id}`} valueColor={{ color: 'white', fontStyle: 'italic', }} line={{borderWidth: 1, gap: 0}} />
									</View>
									{/* <InfoRow label={`${item?.type==='fixed-part'?'Posted':'Requested'} by`} value={toTitleCase(item?.user?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: userDetails?.id}}} /> */}
									<InfoRow label={`${item?.type==='fixed-part'?'Posted':'Requested'} by`} value={formatDate(item?.requested_at)} valueColor={{ color: 'lightsteelblue' }} icon="calendar-outline" iconColor={{ color: 'slateblue' }} />
									{(item?.fault)&&
										<>
											<InfoRow label="Fault" value={toTitleCase(item?.fault?.title?.name||'')}
											valueColor={{ color: 'lightsteelblue' }}
											// valueColor={{ color: 'orange', textDecorationLine: 'underline' }}
											icon="alert-circle-outline" iconColor={{ color: 'red' }}
											// pressValue={{path: '/blueBlank', additionals: {id: assignedTo, faultID: item?.fault?.id, arrayData: parsedArrayString}}}
											/>
											<InfoRow label="Fault ID" value={`#${item?.fault?.id}`} valueColor={{ color: 'lightsteelblue' }} icon="barcode-outline" iconColor={{ color: 'red' }} />
										</>}
									<InfoRow label="Reason" value={item?.other} valueColor={{ color: 'lightsteelblue' }} icon="help-circle-outline" iconColor={{ color: 'white' }} />
								</View>}
							</View>
							:
							// fault display
							<View style={[styles.card]}>
								<View style={[styles.header, {
										backgroundColor: uniColorMode.newdrkb}]}>
										<View style={styles.titleWIcon}>
											<Ionicons name={getIcon} size={15} color={color} />
											<Text style={[styles.title, { color: color }]}>{toTitleCase(item?.title?.name||'')}</Text>
										{/* <Text style={[styles.subtitle, { color: 'skyblue' }]}>Quantity: {item?.quantityRequested}</Text> */}
										</View>
									</View>

									{/* Status Section */}
									<View style={styles.statusContainer}>
										<Text style={styles.label}>Status:{'  '}</Text>
										<Text style={[styles.statusText, { backgroundColor: getStatusColor({item, type: 'fault'}) }]}>
											{getStatusText({item, type: 'fault'})}
										</Text>
										<Text style={[styles.statusText, { color: faultColorStyle }]}>
											({faultDuration} {returnedfaultMode} ago)
										</Text>
									</View>

									{/* fault Details */}
									<View style={[styles.infoContainer, { backgroundColor: uniColorMode.newdrkb1 }]}>
										<View style={styles.bankId}>
											<InfoRow label="Bank" value={item?.logged_by?.branch?.bank?.name?.toUpperCase()} valueColor={{ color: 'lightsteelblue' }} icon="business-outline" iconColor={{ color: 'lightblue' }} />
											{/* @ts-ignore */}
											<InfoRow label="ID" value={`#${item?.id}`} valueColor={{ color: 'white', fontStyle: 'italic', }} line={{borderWidth: 1, gap: 0}} />
										</View>
										<InfoRow label="Branch" value={toTitleCase(item?.logged_by?.branch?.name||'')} valueColor={{ color: 'lightsteelblue' }} icon="card-outline" iconColor={{ color: 'lightblue' }} />
										<InfoRow label="State" value={`${toTitleCase(item?.logged_by?.branch?.state?.name||'')}|${item?.logged_by?.branch?.state?.initial}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
										<InfoRow label="Region" value={`${toTitleCase(item?.logged_by?.branch?.region?.name||'')}`} valueColor={{ color: 'lightsteelblue' }} icon="map-outline" iconColor={{ color: 'teal' }} />
										<InfoRow label="Location" value={toTitleCase(item?.logged_by?.branch?.location?.location||'')} valueColor={{ color: 'lightsteelblue' }} icon="navigate-outline" iconColor={{ color: 'teal' }} />
										<InfoRow label="Logged by" value={toTitleCase(item?.logged_by?.custodian?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'slateblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: loggedBy}}} />
										<InfoRow label="Logged on" value={formatDate(item?.created_at)} valueColor={{ color: 'lightsteelblue' }} icon="calendar-outline" iconColor={{ color: 'slateblue' }} />
										<InfoRow label="Assigned to" value={toTitleCase(item?.assigned_to?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline' }} icon="person-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: assignedTo}}} />
										<InfoRow label="Managed by" value={toTitleCase(item?.managed_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="briefcase-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: managedBy}}} />
										<InfoRow label="Supervised by" value={toTitleCase(item?.supervised_by?.first_name||'')} valueColor={{ color: 'orange', textDecorationLine: 'underline', }} icon="checkmark-done-outline" iconColor={{ color: 'skyblue' }} pressValue={{path: '/inspectUserProfile', additionals: {id: supervisedBy}}} />
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
												console.log('detailScreen:', JSON.stringify(component, null, 4))
												// console.log('detailScreen:', {approved}, {rejected})
												return (
													<View
													key={component.id}
													style={[styles.requestRow]}>
														<Ionicons name={approved?'checkmark':rejected?'close':'ellipsis-horizontal-circle-outline'} size={15} color={approved?'green':rejected?'red':'lightsteelblue'} />
														<Text style={styles.requestLabel}>{toTitleCase(component.name.name||'')}:</Text>
														<Text style={styles.requestLabel}>{component.quantityRequested}</Text>
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
												// console.log('detailScreen:', {approved}, {rejected})
												return (
													<View
													key={part.id}
													style={[styles.requestRow]}>
														<Ionicons name={approved?'checkmark':rejected?'close':'ellipsis-horizontal-circle-outline'} size={15} color={approved?'green':rejected?'red':'lightsteelblue'} />
														<Text style={styles.requestLabel} numberOfLines={1} ellipsizeMode="tail">{toTitleCase(part.name.name||'')}:</Text>
														<Text style={styles.requestLabel}>{part.quantityRequested}</Text>
													</View>
												);
											})}
										</View>
									</View>
								</View>
							)}
							</View>}
							{/* toggle forms */}
							<>
							{renderComponentRequestForm&&
							<View>
								<RequestItem requests={requestsForComponents} />
							</View>}
							{renderPartRequestForm&&
							<View>
								<RequestItem requests={requestsForParts} />
							</View>}
							</>
							{/* button */}
							<View style={styles.actionContainer}>
								{(getStatusText({item, type: 'fault'})!=='Unconfirmed') &&
									((modeType==='request'&&role!=='human-resource') ?
										// request buttons
										<>
											<ActionButton
												icon={getIcon}
												id={item?.id}
												label={role}
												type={item?.type}
												background={['red', 'darkred']}
												buttonText={[`Withdraw ${String(type)==='Parts'&&role==='workshop'?'Part':'Request'}`, 'Withdrawing...']}
												modeType={modeType}
												// onPress={() => null}
												/>
										</>
										:
										// fault buttons
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
														buttonText={['Request Component', 'Requesting...', 'Close Form']}
														modeType={modeType}
														textColor={'#17A2B8'}
														formState={renderComponentRequestForm}
														role={role}
														setForm={handleComponentRequestFormRender}
														onPress={5}
														/>
													<ActionButton
														icon={'cube-outline'}
														id={item?.id}
														label={role}
														// type={item?.type}
														background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
														buttonText={['Request Part', 'Requesting...', 'Close Form']}
														modeType={modeType}
														textColor={'#007BFF'}
														formState={renderPartRequestForm}
														role={role}
														setForm={handlePartRequestFormRender}
														onPress={5}
														/>
												</View>}
												{/* <View style={}> */}
												{role!=='help-desk' &&
												<View style={role==='engineer'?{justifyContent: 'center', alignItems: 'center', marginTop: 10}:{flexDirection: 'row', gap: 20}}>
													{(role!=='custodian'||!hasRequestsAndApproved) &&
													<ActionButton
														icon={role==='engineer'?'hourglass-outline':(role==='supervisor'||role==='human-resource')?'':'construct-outline'}
														id={item?.id}
														item={item}
														label={role}
														userID={userDetails?.id}
														userEmail={userDetails?.email}
														// type={item?.type}
														background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
														buttonText={role==='engineer'?['Seek Confirmation', 'Seeking...']:(role==='human-resource'&&modeType==='request')?['Reject Request', 'Rejecting...']:(role==='supervisor'||role==='human-resource')?['Reject Requests', 'Rejecting...']:['Withdraw Fault', 'Withdrawing...']}
														modeType={modeType}
														textColor={role==='engineer'?'#FFA500':'#FF4C4C'}
														// onPress={() => null}
														/>}
													{role!=='engineer' &&
													<ActionButton
														icon={(role==='supervisor'||role==='human-resource')?'':'hourglass-outline'}
														id={item?.id}
														item={item}
														label={role}
														userID={userDetails?.id}
														userEmail={userDetails?.email}
														// type={item?.type}
														background={[uniColorMode.newdrkb1, uniColorMode.vdrkb]}
														buttonText={(role==='human-resource'&&modeType==='request')?['Approve Request', 'Approving...']:(role==='supervisor'||role==='human-resource')?['Approve Requests', 'Approving...']:['Confirm Resolution', 'Confirming...']}
														modeType={modeType}
														textColor={'#FFA500'}
														resolutionDetails={resolutionDetails}
														// onPress={() => null}
														/>}
												</View>}
											</View>
										</>)
								}
							</View>
						</>)}
				</View>
			</ScrollView>
		</ImageBackground>
	);
};

const ActionButton = ({ item, icon, label, id, type, background, buttonText, modeType, textColor, userID, userEmail, setForm, formState, role, onPress, resolutionDetails }: customComponent) => {
	getComponentName()
	const uniColorMode = useColorMode()
	const router = useRouter()
	const { deleteData, isDeleteError, isDeleteLoading, DeleteSetup }: useTypes = useDelete();
	const { patchData, isPatchError, isPatchLoading, PatchSetup } = usePatch();
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
		// console.log('url (ActionButton in detailScreen):', url)
		// console.log('label (ActionButton in detailScreen):', label)
		// console.log('modeType (ActionButton in detailScreen):', modeType)
		// console.log('type (ActionButton in detailScreen):', type)
		// console.log('buttonText (ActionButton in detailScreen):', buttonText)
		// console.log('id (ActionButton in detailScreen):', id)
		// console.log('...')
	} else if (label?.toLowerCase()==='supervisor') {
		url = `request-status/${userID}/`
	} else if (label?.toLowerCase()==='human-resource') {
		// console.log('item (ActionButton in detailScreen):', JSON.stringify(item, null, 4))
		// url = `${()?'post-part':'request-'+{item?.type}+'/'+{userID}+'/'}`
		if (modeType==='request') {
			url = item?.type==='fixed-part'?`post-part/${userID}/`:`request-${item?.type}/${userID}/`
		} else {
			url = `request-status/${userID}/`
		}
	} else if (label?.toLowerCase()==='custodian') {
		if (buttonText?.[0]==='Withdraw Fault') {
			url = `fault/${id}/delete/`
		} else if (buttonText?.[0]==='Confirm Resolution') {
			url = `unconfirmed-faults/${userID}/`
		}
	} else if (label?.toLowerCase()==='workshop') {
		// console.log('detailScreen',{type})
		if (buttonText?.[0]==='Withdraw Request') {
			url = `request-${type}/${id}/delete/`
		} else if (buttonText?.[0]==='Withdraw Part') {
			url = `post-part/${id}/delete/`
		}
	} else if (label?.toLowerCase()==='help-desk') {
		// help desk
	}
	const handleRequests = () => {
		// console.log('handleREquest in detailScreen')
		let formData = new FormData();
		// formData.append('faultID', `${id}`)
		// formData.append('verify_resolve', 'true')
		if (label?.toLowerCase()==='engineer') {
			formData.append('faultID', `${id}`)
			if (type) {
				DeleteSetup(url)
			} else {
				formData.append('verify_resolve', 'true')
				PatchSetup(url, formData)
			}
		} else if (label?.toLowerCase()==='custodian') {
			formData.append('faultID', `${id}`)
			if (buttonText?.[0]==='Withdraw Fault') {
				DeleteSetup(url)
			} else {
				formData.append('confirm_resolve', 'true')
				formData.append('resolvedBy', resolutionDetails.resolvedBy!)
				formData.append('managedBy', resolutionDetails.managedBy!)
				formData.append('supervisedBy', resolutionDetails.supervisedBy!)
				formData.append('region', resolutionDetails.region!)
				formData.append('deliveries', '1')
				PatchSetup(url, formData)
			}
		} else if (label?.toLowerCase()==='workshop') {
			// console.log('button clicked by woskshop in detailScreen')
			// console.log('button (in detailScreen):', buttonText)
			// console.log('in detailScreen url:', url)
			if (buttonText?.[0]==='Withdraw Part') {
				// console.log('parts button clicked in detailScreen')
				DeleteSetup(url)
			} else if (buttonText?.[0]==='Withdraw Request') {
				// console.log('components button clicked in detailScreen')
				DeleteSetup(url)
			}
		} else if (label?.toLowerCase()==='supervisor') {
			formData = approveOrRejectAllRequests({ item, buttonText, userEmail })
			PatchSetup(url, formData)
		} else if (label?.toLowerCase()==='human-resource') {
			if (modeType==='request') {
				formData.append('requestID', item?.id)
				formData.append('approved_by', String(userEmail))
				if (buttonText?.[0]==='Reject Request') {
					// console.log('Reject Request button clicked in detailScreen')
					formData.append('rejected', 'true')
					// DeleteSetup(url)
				} else if (buttonText?.[0]==='Approve Request') {
					// console.log('Approve Request button clicked in detailScreen')
					formData.append('approved', 'true')
					// DeleteSetup(url)
				}
			} else {
				formData = approveOrRejectAllRequests({ item, buttonText, userEmail })
				// url = `request-status/${userID}/`
			}
			PatchSetup(url, formData)
		}
	}
	useEffect(() => {
		if (isDeleteError||isPatchError) {
            // console.log('isDeleteError||isPatchError (detailScreen):', isDeleteError||isPatchError)
			Toast.show({
				type: 'error', // 'success' | 'error' | 'info'
				text1: isDeleteError||isPatchError||'',
			});
        } else if (deleteData||patchData) {
            // console.log('deleteData||patchData (detailScreen):', deleteData||patchData)
			Toast.show({
				type: 'success', // 'success' | 'error' | 'info'
				text1: toTitleCase(deleteData?.msg||patchData?.msg||''),
			});
			router.push('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deleteData, isDeleteError, patchData, isPatchError]);
	// console.log('detailSreen', {isDeleteLoading}, {modeType})
	return (
		<TouchableOpacity
		onPress={onPress?handleNavigate:handleRequests} disabled={isDeleteLoading}
		style={[styles.actionButton, {backgroundColor: isDeleteLoading?background?.[1]:background?.[0]}]}>
			<Ionicons name={icon} size={15} color={textColor?textColor:uniColorMode.text} />
			<Text style={[styles.actionText, {color: textColor?textColor:uniColorMode.text}]}>{(isDeleteLoading||isPatchLoading)?buttonText?.[1]:(role==='engineer'&&formState)?buttonText?.[2]:buttonText?.[0]}</Text>
		</TouchableOpacity>
	)
};

const approveOrRejectAllRequests = (propObj: any) =>{
	getComponentName()
	const { item, buttonText, userEmail } = propObj
	const formData = new FormData();
	let requestComponentIds;
	let requestPartIDs;
	// console.log(
	// 	'\nbutton clicked by supervisor in detailScreen',
	// 	// '\nitem (in detailScreen):', JSON.stringify(item, null, 4),
	// )
	if (item?.requestComponent) {
		requestComponentIds = item?.requestComponent.map((component:any) => component.id)
		// console.log({requestComponentIds})
	}
	if (item?.requestPart) {
		requestPartIDs = item.requestPart.map((part:any) => part.id)
	}
	if (requestComponentIds) {formData.append('requestComponentIds', requestComponentIds)}
	if (requestPartIDs) {formData.append('requestPartIDs', requestPartIDs)}
	// newFormData.append(type, [...requestComponentIds, ...requestPartIDs])
	// formData.append(type, true)
	formData.append('approved_by', String(userEmail))
	if (buttonText?.[0]==='Reject Requests') {
		// console.log('Reject Requests button clicked in detailScreen')
		formData.append('rejected', 'true')
		// DeleteSetup(url)
	} else if (buttonText?.[0]==='Approve Requests') {
		// console.log('Approve Requests button clicked in detailScreen')
		formData.append('approved', 'true')
		// DeleteSetup(url)
	}
	return formData
}

type customComponent = {
    icon: any,
	mode?: string,
	label: string,
	variant?: string,
	onPress?: any,
	userID?: number,
	userEmail?: string,
	urlRoute?: string,
	screen?: string,
	id?: number,
	item?: Record<string, any>,
	type?: string,
	background?: string[]|undefined,
	buttonText?: string[]|undefined,
	modeType?: string,
	textColor?: string,
	resolutionDetails?: any,
	formState?: boolean,
	role?: string,
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
	const router = useRouter()
	const onpress = ()=>router.push({
		// @ts-ignore
		pathname: pressValue!.path,
		params: pressValue!.additionals
	})
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

// const dateDifference = (isoString: string) => {
// 	if (!isoString) return
// 	const now = new Date();
// 	const date = new Date(isoString);
// 	const isToday = now.toDateString() === date.toDateString();
// 	console.log({now}, {date})
// 	const timeDiff = now.getTime() - date.getTime();
// 	console.log({timeDiff})
// 	let daysDiff = `${Math.ceil(timeDiff / (1000 * 60 * 60 * 24))}-red-d`
// 	if (isToday) {
// 		let hoursOrMinutes = Math.floor(timeDiff / (1000 * 60 * 60))
// 		daysDiff = `${hoursOrMinutes}-grey-h`
// 		console.log({daysDiff})
// 		if (hoursOrMinutes < 1) {
// 			hoursOrMinutes = Math.floor(timeDiff / (1000 * 60))
// 			daysDiff = `${hoursOrMinutes}-grey-m`
// 		}
// 	}
// 	// console.log('Days diff: (detailScreen):', daysDiff)
// 	console.log({daysDiff})
// 	return daysDiff
// };

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
		// textDecorationLine: 'underline',
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
