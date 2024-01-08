import React, { useEffect, useState } from 'react';
import { message, Select, Form } from 'antd';
import { LOCAL_STORAGE_FORM_NAME } from '../StepsUpload';

function convertTableName(inputString) {
    // Split the string by underscores, capitalize each word, and then join them back with spaces
    return inputString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export const TableNameSelector = ({ onChange, tablesInfo, tableName }) => {
	const [list, setList] = useState([]);
	const [selectedTable, setSelectedTable] = useState(tableName ?? '');

	useEffect(() => {
		setSelectedTable(tableName);
	}, [tableName])

	useEffect(() => {
		setList(Object.keys(tablesInfo).map(key => ({ label: convertTableName(key), value: key })));
	}, [tablesInfo]);

	const onChangeTable = (value) => { 
		onChange(value); 
		setSelectedTable(value);
		const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
		let formData = JSON.parse(localStorageForm) ?? {};
        formData.tableName = value;
		localStorage.setItem(LOCAL_STORAGE_FORM_NAME, JSON.stringify(formData));
	}

    return (
		<Form.Item
			colon={false}
            label={<div style={{ textAlign: 'left', width: '100px' }}>Database Table</div>}
			name="tableName"
			rules={[{ required: true, message: 'Please select a database table!' }]}
		>
			<Select
				showSearch
				defaultValue={selectedTable}
				value={selectedTable}
				placeholder="Select a table name"
				onChange={onChangeTable}
				options={list}
			/>
		</Form.Item>
    );
};
