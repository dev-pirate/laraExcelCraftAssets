import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { loadExcelFileData } from '../../api';
import { LOCAL_STORAGE_FORM_NAME } from '../StepsUpload';

function convertFieldName(inputString) {
    // Split the string by underscores, capitalize each word, and then join them back with spaces
    return inputString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/([A-Z])/g, ' $1');
}

export const ImportReview = () => {
	const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
	let formData = JSON.parse(localStorageForm) ?? {};

	const [mapping, setMapping] = useState(formData?.columns ?? {});
	const [dataRows, setDataRows] = useState([]);

	const getColumnsConfig = () => {
		const keys = Object.keys(mapping);
		let list = [];
		keys.forEach(key => {
			list.push({
				title: convertFieldName(mapping[key]?.value),
				dataIndex: key,
				key: key,
			});
		});
		return list;
	}

	useEffect(() => {
		if (formData?.fileId) {
			loadExcelFileData(formData?.fileId, (response) => {
				setDataRows(response.data.rows);
			});
		}
	}, []);

    return (
		<>
			<div style={{ textAlign: 'left', margin: '1em'}}>
				<h3> {convertFieldName(formData?.tableName ?? '')} </h3>
			</div>
			
			<Table 
				columns={getColumnsConfig()} 
				dataSource={dataRows}
			/>
		</>
    );
};
