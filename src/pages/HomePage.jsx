import React, { useState } from 'react';
import FileInputCompany from '../components/FileInputCompany';
import FileInputContact from '../components/FileInputContact';

function HomePage() {
    const [showCompanyInput, setShowCompanyInput] = useState(true);

    const handleToggleInput = () => {
        setShowCompanyInput(!showCompanyInput);
    };

    return (
        <div>
            <h1>Import Excel Data in React.js</h1>
            <div>
                <button onClick={handleToggleInput}>
                    {showCompanyInput ? 'Switch to Contacts' : 'Switch to Companies'}
                </button>
            </div>
            {showCompanyInput ? <FileInputCompany /> : <FileInputContact />}
        </div>
    );
}

export default HomePage;
