'use client';

import Navbar from '@/components/Navbar';
import { useState } from 'react';
import { FaCodeFork } from 'react-icons/fa6';

export default function DatePicker() {
    const [fromDate, setFromDate] = useState('2015-01-01');
    const [toDate, setToDate] = useState('2015-02-01');
    const [rangeName, setRangeName] = useState('Custom ranges');

    const handleSetToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setFromDate(today);
        setToDate(today);
        setRangeName('Today');
    };

    const handleSetLastMonth = () => {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        setFromDate(lastMonth.toISOString().split('T')[0]);
        setToDate(today.toISOString().split('T')[0]);
        setRangeName('Last Month');
    };

    return (
        <main className="min-h-screen bg-gray-50 font-sans pb-12">
            <div className="container mx-auto px-4">
                <Navbar />
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-4">
                        Angular Date Range Picker
                        <a href="https://github.com/yiting007/angular-dUtil" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                            <FaCodeFork />
                        </a>
                    </h1>

                    <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                            <p className="text-yellow-700">
                                <strong>Note:</strong> This project was originally an AngularJS directive. Below is a React recreation of the demo functionality.
                            </p>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">Demo</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-4">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSetToday}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Set Today
                                    </button>
                                    <button
                                        onClick={handleSetLastMonth}
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                                    >
                                        Set Last Month
                                    </button>
                                </div>
                                <div className="p-4 bg-gray-100 rounded font-mono text-sm space-y-2">
                                    <p>Range: {rangeName}</p>
                                    <p>From: {fromDate}</p>
                                    <p>To: {toDate}</p>
                                </div>
                            </div>

                            <div className="p-6 border rounded-lg flex flex-col items-center justify-center space-y-4 bg-gray-50">
                                <div className="flex flex-col space-y-2 w-full max-w-xs">
                                    <label className="text-sm font-semibold text-gray-600">Start Date</label>
                                    <input
                                        type="date"
                                        value={fromDate}
                                        onChange={(e) => setFromDate(e.target.value)}
                                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="flex flex-col space-y-2 w-full max-w-xs">
                                    <label className="text-sm font-semibold text-gray-600">End Date</label>
                                    <input
                                        type="date"
                                        value={toDate}
                                        onChange={(e) => setToDate(e.target.value)}
                                        className="p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-4">Original Documentation</h3>
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h4 className="font-bold mb-2">How to install (Legacy)</h4>
                                <pre className="bg-gray-100 p-3 rounded font-mono text-sm">bower install yiting007/angular-dUtil --save</pre>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">How to use (Legacy)</h4>
                                <p className="mb-2">Add the 'dUtilApp' module as a dependency:</p>
                                <pre className="bg-gray-100 p-3 rounded font-mono text-sm">var myAppModule = angular.module('MyApp', ['dUtilApp']);</pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
