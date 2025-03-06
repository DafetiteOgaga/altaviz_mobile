import { useState } from 'react';
// import { useAsyncStorageMethods } from '@/context/AsyncMethodsContext';
import { baseUrl } from '@/constants/urlOrigin'
import { getComponentName } from '@/hooks/getComponentName';

let requestType
function useGet () {
	getComponentName()
	const [getData, setGetData] = useState(null)
	const [isGetLoading, setIsGetLoading] = useState(false)
	const [isGetError, setIsGetError] = useState(null);
	requestType = 'GET'
	const GetSetup = async (url) => {
		getComponentName()
		const finalUrl = `${baseUrl}/${url}`
		console.log('finalUrl ###***###:', finalUrl)
		setIsGetLoading(true);
		setIsGetError(null);
		setGetData(null);
		try {
			const response = await fetch(finalUrl);
			const resp = await response.json()
			if (!response.ok) {
				console.log('Error:', resp||'Failed to post data')
				setIsGetError(resp||'Failed to post data')
				throw new Error(resp.message||'Failed to post data')
			}
			// console.log('Response:', resp)
			// console.log('Response:', JSON.stringify(resp, null, 2).slice(0, 100));
			console.log(`${requestType} Response: success (async) ${finalUrl.split(baseUrl)[1]}`)
			setGetData(resp)
		} catch (e) {
			setIsGetError(e.message);
			throw new Error('Error posting data (message):', e.message);
		} finally {
			setIsGetLoading(false);
		}
	}
	return {getData, isGetError, isGetLoading, GetSetup}
}
export { useGet };

function usePost () {
	getComponentName()
	const [postData, setPostData] = useState(null)
	const [isPostLoading, setIsPostLoading] = useState(false)
	const [isPostError, setIsPostError] = useState(null);
	requestType = 'POST'
	const PostSetup = async (url, formData) => {
		getComponentName()
		// console.log('hhhh'.repeat(50))
		const csrfToken = await fetchCsrfToken() // Fetch CSRF token
		// console.log('csrfToken:', csrfToken)
		const finalUrl = `${baseUrl}/${url}`
		console.log('finalUrl ###***###:', finalUrl)
		setIsPostLoading(true);
		setIsPostError(null);
		setPostData(null);
		try {
			const response = await fetch(finalUrl,
				{
					method: 'POST',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					body: formData,
				}
			);
			const resp = await response.json()
			if (!response.ok) {
				console.log('Error:', resp||'Failed to post data')
				setIsPostError(resp||'Failed to post data')
				throw new Error(resp.message||'Failed to post data')
			}
			// console.log('Response:', resp)
			// console.log('Response:', JSON.stringify(resp, null, 2));
			console.log(`${requestType} Response: success (async) ${finalUrl.split(baseUrl)[1]}`)
			setPostData(resp)
		} catch (e) {
			setIsPostError(e.message);
			throw new Error(`Error posting data (message): ${e.message}`);
		} finally {
			setIsPostLoading(false);
		}
	}
	return {postData, isPostError, isPostLoading, PostSetup}
}
export { usePost };

function usePut () {
	getComponentName()
	const [putData, setPutData] = useState(null)
	const [isPutLoading, setIsPutLoading] = useState(false)
	const [isPutError, setIsPutError] = useState(null);
	requestType = 'PUT'
	const PutSetup = async (url, formData) => {
		getComponentName()
		const csrfToken = await fetchCsrfToken() // Fetch CSRF token
		const finalUrl = `${baseUrl}/${url}`
		console.log('finalUrl ###***###:', finalUrl)
		setIsPutLoading(true);
		setIsPutError(null);
		setPutData(null);
		try {
			const response = await fetch(finalUrl,
				{
					method: 'PUT',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					body: formData,
				}
			);
			const resp = await response.json()
			if (!response.ok) {
				console.log('Error:', resp||'Failed to post data')
				setIsPutError(resp||'Failed to post data')
				throw new Error(resp.message||'Failed to post data')
			}
			// console.log('Response:', resp)
			// console.log('Response:', JSON.stringify(resp, null, 2));
			console.log(`${requestType} Response: success (async) ${finalUrl.split(baseUrl)[1]}`)
			setPutData(resp)
		} catch (e) {
			setIsPutError(e.message);
			throw new Error(`Error posting data (message): ${e.message}`);
		} finally {
			setIsPutLoading(false);
		}
	}
	return {putData, isPutError, isPutLoading, PutSetup}
}
export { usePut };

function usePatch () {
	getComponentName()
	const [patchData, setPatchData] = useState(null)
	const [isPatchLoading, setIsPatchLoading] = useState(false)
	const [isPatchError, setIsPatchError] = useState(null);
	requestType = 'PATCH'
	const PatchSetup = async (url, formData) => {
		getComponentName()
		const csrfToken = await fetchCsrfToken() // Fetch CSRF token
		const finalUrl = `${baseUrl}/${url}`
		console.log('finalUrl ###***###:', finalUrl)
		setIsPatchLoading(true);
		setIsPatchError(null);
		setPatchData(null);
		try {
			const response = await fetch(finalUrl,
				{
					method: 'PATCH',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					body: formData,
				}
			);
			const resp = await response.json()
			if (!response.ok) {
				console.log('Error:', resp||'Failed to post data')
				setIsPatchError(resp||'Failed to post data')
				throw new Error(resp.message||'Failed to post data')
			}
			// console.log('Response:', resp)
			// console.log('Response:', JSON.stringify(resp, null, 2));
			console.log(`${requestType} Response: success (async) ${finalUrl.split(baseUrl)[1]}`)
			setPatchData(resp)
		} catch (e) {
			setIsPatchError(e.message);
			throw new Error(`Error posting data (message): ${e.message}`);
		} finally {
			setIsPatchLoading(false);
		}
	}
	return {patchData, isPatchError, isPatchLoading, PatchSetup}
}
export { usePatch };

function useDelete () {
	getComponentName()
	const [deleteData, setDeleteData] = useState(null)
	const [isDeleteLoading, setIsDeleteLoading] = useState(false)
	const [isDeleteError, setIsDeleteError] = useState(null);
	requestType = 'DELETE'
	const DeleteSetup = async (url) => {
		getComponentName()
		const csrfToken = await fetchCsrfToken() // Fetch CSRF token
		const finalUrl = `${baseUrl}/${url}`
		console.log('finalUrl ###***###:', finalUrl)
		setIsDeleteLoading(true);
		setIsDeleteError(null);
		setDeleteData(null);
		// console.log('xxx'.repeat(50))
		try {
			const response = await fetch(finalUrl,
				{
					method: 'DELETE',
					headers: {
						'X-CSRFToken': csrfToken,
					},
					credentials: 'include',
					// body: formData,
				}
			);
			// console.log('xxx'.repeat(50))
			const resp = await response.json()
			if (!response.ok) {
				console.log('Error:', resp||'Failed to post data')
				setIsDeleteError(resp||'Failed to post data')
				throw new Error(resp.message||'Failed to post data')
			}
			// console.log('Response:', resp)
			// console.log('Response:', JSON.stringify(resp, null, 2));
			console.log(`${requestType} Response: success (async) ${finalUrl.split(baseUrl)[1]}`)
			setDeleteData(resp)
		} catch (e) {
			setIsDeleteError(e.message);
			throw new Error(`Error posting data (message): ${e.message}`);
		} finally {
			setIsDeleteLoading(false);
		}
	}
	return {deleteData, isDeleteError, isDeleteLoading, DeleteSetup}
}
export { useDelete };

const fetchCsrfToken = async () => {
	const response = await fetch(`${baseUrl}/api/get-csrf-token/`, {
		method: 'GET',
		credentials: 'include', // Important for CSRF-protected requests
	});

    if (!response.ok) {
        console.log('Failed to fetch CSRF token');
        return null;
    }
	// await SetBaseUrl()
    console.log('Fetching CSRF token success')
    const data = await response.json();
    const csrfToken = data.csrfToken;
	// console.log('CSRF token:', csrfToken);

    return csrfToken;
}
export { fetchCsrfToken };
