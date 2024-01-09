import React, { useEffect, useState } from 'react';
import { Table, Select } from 'antd';
import { loadExcelFileColumuns } from '../../api';
import { LOCAL_STORAGE_FORM_NAME } from '../StepsUpload';

function convertFieldName(inputString) {
    // Split the string by underscores, capitalize each word, and then join them back with spaces
    return inputString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/([A-Z])/g, ' $1');
}

export const TableColumnMapping = ({ onChange, tablesInfo }) => {
	const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
	let formData = JSON.parse(localStorageForm) ?? {};

	const [mapping, setMapping] = useState(formData?.columns ?? {});
	const [fields, setFields] = useState([]);
	const [tableName, setTableName] = useState(formData?.tableName ?? '');

	useEffect(() => {
		if (formData?.fileId) {
			loadExcelFileColumuns(formData?.fileId, (response) => {
				setFields(response.data.columns);
			})
		}
	}, [tableName]);

	const onChangeMap = (key, value) => {
		let map = mapping;
		map[key] = {
			value,
			title: fields.find(ite => ite.key === key)?.title
		};
		setMapping(map);
		formData.columns = map;
		localStorage.setItem(LOCAL_STORAGE_FORM_NAME, JSON.stringify(formData));
	}

    const columns = [
		{
			title: 'Column Header',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Table field',
			dataIndex: 'table_field',
			key: 'table_field',
			render: (text, record, index) => <Select
				style={{ minWidth: '180px' }}
				defaultValue={mapping[record.key]}
				placeholder="Select a table field"
				onChange={(value) => {
					onChangeMap(record.key, value);
				}}
				options={tablesInfo[tableName].map(item => ({
					label: convertFieldName(item),
					value: item
				}))}
			/>,
		},
	];

    return (
		<Table
			columns={columns}
			dataSource={fields.filter(field => field?.title && field?.key)}
			pagination={false}
		/>
    );
};
