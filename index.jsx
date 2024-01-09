import React from 'react';
import { render } from "react-dom";
import { App as AntdApp } from 'antd';
import App from './Components/ImportExcel/App';
import reportWebVitals from './reportWebVitals';
import AppExport from "./Components/ExportExcel/AppExport";

if (document.getElementById('lara-excel-craft-import')) {
    render(
        <React.StrictMode>
            <AntdApp message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
                <App />
            </AntdApp>
        </React.StrictMode>,
        document.getElementById('lara-excel-craft-import')
    );
} else {
    render(
        <React.StrictMode>
            <AntdApp message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
                <AppExport />
            </AntdApp>
        </React.StrictMode>,
        document.getElementById('lara-excel-craft-export')
    );
}

reportWebVitals();
