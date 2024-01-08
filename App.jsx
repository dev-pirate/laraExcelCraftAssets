import './App.scss';
import { StepsUpload } from "./Components/ImportExcel/StepsUpload";
import { App as AntdApp } from 'antd';

function App() {
    return (
        <div className="App">
            <AntdApp message={{ maxCount: 1 }} notification={{ placement: 'bottomLeft' }}>
                <StepsUpload />
            </AntdApp>
        </div>
    );
}

export default App;
