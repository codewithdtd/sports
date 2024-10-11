import React from 'react'
import { CSVLink } from 'react-csv'

export const ExportReactCSV = ({csvData, fileName}) => {
    return (
        <button className='border text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white p-1 px-2 m-1 rounded-lg'>
            <CSVLink data={csvData} filename={fileName}>Export</CSVLink>
        </button>
    )
}
