import React from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';

function FileInputContact() {
    const [data, setData] = React.useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { raw: false });
            const formattedData = sheetData.map(row => ({
                ...row,
            }));

            setData(formattedData);
        };

        reader.readAsBinaryString(file);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        if (month < 10) {
            month = `0${month}`;
        }
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        return `${year}-${month}-${day}`;
    };

    const handleRowSubmit = () => {
        axios.post('http://localhost:8001/api/contact/', data)
        .then(response => {
            console.log('Batch submitted successfully:', response.data);
        })
        .catch(error => {
            console.error('Error submitting batch:', error);
        });
    };

    return (
        <div className="container">
            <h1 className="my-4">Excel Data Import - Contacts</h1>
            <div className="row">
                <div className="col-md-6">
                    <input type="file" className="form-control" onChange={handleFileUpload} />
                </div>
            </div>
            {data && (
                <div className="row mt-4">
                    <div className="col-md-12">
                        <h2>Imported Data:</h2>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {Object.keys(data[0]).map((key, index) => (
                                        <th key={index}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {Object.values(row).map((cell, cellIndex) => (
                                            <td key={cellIndex}>
                                                {cell instanceof Date ? formatDate(cell) : cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {data && (
                <div className="row mt-4">
                    <div className="col-md-12">
                        <button
                            className="btn btn-primary"
                            onClick={handleRowSubmit}
                            disabled={!data.some(row => !row.submitted)}
                        >
                            Submit All Rows
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileInputContact;
