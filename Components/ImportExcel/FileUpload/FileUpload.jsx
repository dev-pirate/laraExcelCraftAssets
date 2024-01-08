import React, { useEffect, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload, Form, App } from 'antd';
import axios from 'axios';
import { TableNameSelector } from './TableNameSelector';
import { LOCAL_STORAGE_FORM_NAME } from '../StepsUpload';
const { Dragger } = Upload;

export const FileUpload = ({ tablesInfo }) => {
    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
    const { message, notification } = App.useApp();

    const [fileList, setFileList] = useState([]);
    const [fileName, setFileName] = useState(JSON.parse(localStorageForm)?.fileName);
    const [tableName, setTableName] = useState(JSON.parse(localStorageForm)?.tableName);

    useEffect(() => {
        if (fileName || JSON.parse(localStorageForm)?.fileName) {
            setFileList([
                {
                    uid: '-1',
                    name: JSON.parse(localStorageForm)?.fileName ?? '',
                    status: 'done',
                },
            ]);
        } else setFileList([]);
    }, []);

    useEffect(() => {
        if (localStorageForm) {
			setFileName(JSON.parse(localStorageForm)?.fileName);
        }
	}, []);

    const handleRequest = async (request) => {
        const file = request.file;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(laraExcelCraftFileImportRoute, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setFileName(file.name);
                let formData = JSON.parse(localStorageForm) ?? {};
                formData.fileId = response.data.fileName;
                formData.fileName = file.name;
                localStorage.setItem(LOCAL_STORAGE_FORM_NAME, JSON.stringify(formData));
                setFileList([
                    {
                        uid: '-1',
                        name: formData?.fileName,
                        status: 'done',
                    },
                ]);
                notification.success({
                    message: `Success`,
                    description: 'File Uploaded successfully!!',
                });
            } else {
                notification.error({
                    message: `Failed`,
                    description: 'File Uploaded Failed!!',
                });
            }

        } catch (error) {
            // Handle errors
            console.error('Error:', error);
        }
    };

    return (
        <div
            style={{ maxWidth: '100%', padding: '2em', display: 'inline-block' }}
        >
            <TableNameSelector onChange={(value) => setTableName(value)} tableName={tableName} tablesInfo={tablesInfo} />
            <Form.Item
                colon={false}
                label={<div style={{ textAlign: 'left', width: '100px' }}>Excel file</div>}
                name="excelFile"
                rules={[{ required: true, message: 'Please select a database table!' }]}
            >
                <Dragger fileList={fileList} name={'file'} customRequest={handleRequest} onRemove={(file) => {
                    setFileName(null);
                    setFileList([]);
                    let formData = JSON.parse(localStorageForm) ?? {};
                    delete formData.fileId;
                    delete formData.fileName;
                    localStorage.setItem(LOCAL_STORAGE_FORM_NAME, JSON.stringify(formData));
                }}
                    onChange={(info) => {
                        const { status } = info.file;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const result = event.target.result;
                            const rows = result.split('\n');
                            const dataArray = [];

                            rows.forEach((row) => {
                                const columns = row.split(',');
                                dataArray.push(columns);
                            });
                            console.table(rows);
                        }
                        //console.log(info);
                        if (info.file && info.file?.status !== 'removed') {
                            reader.readAsText(info.file.originFileObj);
                        }

                        if (status !== 'uploading') {
                            //console.log(info.file, info.fileList);
                        }
                        if (status === 'done') {
                            message.success(`${info.file.name} file uploaded successfully.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} file upload failed.`);
                        }
                    }}
                >
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Upload your excel sheet to proceed the importing.
                    </p>
                </Dragger>
            </Form.Item>
        </div>
    );
};
