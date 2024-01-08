import axios from "axios";

export const loadTablesNames = async (onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftTableFetchRoute);

		console.log({ response });
		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}

		// Handle the response data as needed
		console.log('Response Data:', response.data);

	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const loadExcelFileColumuns = async (fileName, onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftFileColumnsRoute.replace('__#FILENAME_lec#__', fileName));

		console.log({ response });
		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}

		// Handle the response data as needed
		console.log('Response Data:', response.data);

	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const loadExcelFileData = async (fileName, onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftFileDataRoute.replace('__#FILENAME_lec#__', fileName));

		console.log({ response });
		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}

		// Handle the response data as needed
		console.log('Response Data:', response.data);

	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const saveExcelFileData = async (formData, onSuccess) => {
	try {
		const response = await axios.post(laraExcelCraftExcelConfirmImportRoute, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
        });

		console.log({ response });
		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}

		// Handle the response data as needed
		console.log('Response Data:', response.data);
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};
