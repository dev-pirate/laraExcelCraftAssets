import React, {useEffect, useState} from 'react';
import { Steps, theme, Button, App } from 'antd';
import { EyeOutlined, DatabaseOutlined, FileExcelOutlined } from '@ant-design/icons';
import { loadTablesNames, saveExcelFileData } from '../api';
import {FileUpload} from "./FileUpload/FileUpload";
import { TableColumnMapping } from './TableMapping/TableColumnMapping';
import { ImportReview } from './ImportReview/ImportReview';

export const LOCAL_STORAGE_FORM_NAME = 'lara_excel_craft_storage';

const stepsIcons = [
    <FileExcelOutlined />, <DatabaseOutlined />, <EyeOutlined />
];

const getStatusByStep = (step, currentStep) => {
    return step === currentStep ? 'finish' : (
        step < currentStep ? 'finish' : 'wait'
    );
}

export const StepsUpload = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [listTables, setListTables] = useState({});
    const [formData, setFormData] = useState(null);
    const { message, notification } = App.useApp();
    const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);

    const { token } = theme.useToken();
    const contentStyle = {
        //lineHeight: '160px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 6,
    };

    const nextStep = () => {
        const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
        if (currentStep === 0) {
            if (!localStorageForm || !JSON.parse(localStorageForm)?.fileName || !JSON.parse(localStorageForm)?.tableName) {
                notification.info({
                    message: `Warning`,
                    description: 'Please fill all the required fields before proceed!!',
                });
                return false;
            }
        } else {
            if (!localStorageForm || !JSON.parse(localStorageForm)?.columns || !Object.keys(JSON.parse(localStorageForm)?.columns).length) {
                notification.info({
                    message: `Warning`,
                    description: 'Please fill at least one column mapping before proceed!!',
                });
                return false;
            }
        }
        next();
    }

    const saveFileData = () => {
        const formData = new FormData();
        formData.append('file', JSON.parse(localStorageForm)?.fileId ?? '');
        formData.append('tbN', JSON.parse(localStorageForm)?.tableName ?? '');
        formData.append('columns', JSON.stringify(JSON.parse(localStorageForm)?.columns ?? ''));

        saveExcelFileData(formData, (response) => {
            notification.success({
                message: `Success`,
                description: 'Data imported successfully from the excel sheet!!',
            });
            localStorage.removeItem(LOCAL_STORAGE_FORM_NAME);
            window.location.href = response.data.redirectTo;
        })
    }

    useEffect(() => {
		loadTablesNames((response) => {
			if (response.status === 200) {
				setListTables(response.data.tablesInfo);
			}
		})
	}, []);

    useEffect(() => {
        const localStorageForm = localStorage.getItem(LOCAL_STORAGE_FORM_NAME);
        if (localStorageForm && !formData) {
            setFormData(JSON.parse(localStorageForm));
        }
    }, []);

    const [items, setItems] = useState([
        {
            title: 'File Upload',
            status: 'finish',
            icon: stepsIcons[0],
        },
        {
            title: 'Table & Column Mapping',
            status: 'wait',
            icon: stepsIcons[1],
        },
        {
            title: 'Import Review',
            status: 'wait',
            icon: stepsIcons[2],
        },
    ]);

    useEffect(() => {
        setItems(items.map((item, index) => {
            return {
                ...item,
                status: getStatusByStep(index, currentStep),
            };
        }));
    }, [currentStep]);

    const next = () => {
        setCurrentStep(currentStep + 1);
    };
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <>
            <Steps
                type={'navigation'}
                current={currentStep}
                items={items}
            />
            <div style={contentStyle}>
                {currentStep === 0 && (
                    <FileUpload tablesInfo={listTables} />
                )}
                {currentStep === 1 && (
                    <TableColumnMapping onChange={() => {}} tablesInfo={listTables} />
                )}
                {currentStep === 2 && (
                    <ImportReview />
                )}
            </div>
            <div
                style={{
                    marginTop: 24,
                }}
            >
                {currentStep > 0 && (
                    <Button
                        style={{
                            margin: '0 8px',
                        }}
                        onClick={() => prev()}
                    >
                        Previous
                    </Button>
                )}
                {currentStep < items.length - 1 && (
                    <Button type="primary" onClick={() => nextStep()}>
                        Next
                    </Button>
                )}
                {currentStep === items.length - 1 && (
                    <Button type="primary" onClick={() => saveFileData()}>
                        Save Data
                    </Button>
                )}
            </div>
        </>
    );
};
