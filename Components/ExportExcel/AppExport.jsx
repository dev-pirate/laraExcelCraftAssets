import './AppExport.scss';
import {Checkbox, App as AntdApp, Form, Button} from 'antd';
import {exportTableData as exportApi, loadTablesNames} from "../api";
import React, {useEffect, useState} from "react";
import {TableNameSelector} from "./TableNameSelector";

export const LOCAL_STORAGE_FORM_NAME = 'lara_excel_craft_storage_export';

function convertFieldName(inputString) {
    // Split the string by underscores, capitalize each word, and then join them back with spaces
    return inputString.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(/([A-Z])/g, ' $1');
}

function AppExport() {
    const { message, notification } = AntdApp.useApp();
    const [listTables, setListTables] = useState({});
    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
    const selectedTable = JSON.parse(localStorageForm)?.tableName ?? '';

    const [fields, setFields] = useState(listTables[selectedTable] ?? []);
    const [columns, setColumns] = useState(JSON.parse(localStorageForm)?.columns ?? []);

    useEffect(() => {
        loadTablesNames((response) => {
            if (response.status === 200) {
                setListTables(response.data.tablesInfo);
                setFields(response.data.tablesInfo[selectedTable] ?? []);
            }
        })
    }, []);

    const onColumnsChange = (selected) => {
        setColumns(selected);
        const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
        const obj = JSON.parse(localStorageForm) ?? {};
        obj.columns = selected;
        localStorage.setItem(LOCAL_STORAGE_FORM_NAME, JSON.stringify(obj));
    }

    const exportTableData = () => {
        const formData = new FormData();
        const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
        const selectedTable = JSON.parse(localStorageForm)?.tableName ?? '';

        if (!selectedTable) {
            notification.error({
                message: `Error`,
                description: 'Please select a database table to export!!',
            });
            return false;
        }

        if (!columns.length) {
            notification.error({
                message: `Error`,
                description: 'Please select at least one exportable field!!',
            });
            return false;
        }

        formData.append('tbN', selectedTable ?? '');
        formData.append('columns', JSON.stringify(columns) ?? '');

        exportApi(formData, (response) => {
            const redirectTo = response.headers.redirectto ?? '';
            const fileContent = response.data;
            const blob = new Blob([fileContent], { type: 'text/csv' });

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(blob);
            downloadLink.download = 'generated_file.csv'; // Set the desired file name

            // Append the link to the body and trigger the download
            document.body.appendChild(downloadLink);
            downloadLink.click();

            // Clean up: remove the link from the DOM
            document.body.removeChild(downloadLink);
            notification.success({
                message: `Success`,
                description: 'Data exported successfully to the excel sheet!!',
            });
            localStorage.removeItem(LOCAL_STORAGE_FORM_NAME);
            window.location.href = redirectTo;
        })
    }

    return (
        <div className="AppExport">
                <TableNameSelector onChange={(tableName) => setFields(listTables[tableName])} tablesInfo={listTables} />
                <Form.Item
                    className="fields-container"
                    colon={false}
                    label={<div style={{ textAlign: 'left', width: '100px' }}>Exportable Fields</div>}
                    required={true}
                    rules={[{ required: true, message: 'Please select exportable fields!' }]}
                >
                    <Checkbox.Group
                        options={fields.map(item => ({
                            label: convertFieldName(item),
                            value: item
                        }))}
                        value={columns}
                        onChange={(selected) => onColumnsChange(selected)}
                    />
                </Form.Item>
                <Button type="primary" onClick={() => exportTableData()}>
                    Export
                </Button>
        </div>
    );
}

export default AppExport;
