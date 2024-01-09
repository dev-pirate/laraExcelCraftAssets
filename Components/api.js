import axios from "axios";

export const loadTablesNames = async (onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftTableFetchRoute);

		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const loadExcelFileColumuns = async (fileName, onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftFileColumnsRoute.replace('__#FILENAME_lec#__', fileName));

		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const loadExcelFileData = async (fileName, onSuccess) => {
	try {
		const response = await axios.get(laraExcelCraftFileDataRoute.replace('__#FILENAME_lec#__', fileName));

		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}

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

		if (response.data.success) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};

export const exportTableData = async (formData, onSuccess) => {
	try {
		const response = await axios.post(laraExcelCraftExcelExportRoute, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		if (response.status === 200) {
			onSuccess(response);
		} else {
			console.log(`tables names loading failed.`);
		}
	} catch (error) {
		// Handle errors
		console.error('Error:', error);
	}
};
