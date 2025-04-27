import { useState } from 'react';

const PayrollView = () => {
  const [activeTab, setActiveTab] = useState('current');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  // Sample payroll data
  const payrollData = {
    current: {
      basicSalary: 75000,
      allowances: 15000,
      bonuses: 5000,
      deductions: 3000,
      tax: 7000,
      netPay: 85000,
      status: 'Pending',
      paymentDate: '2023-11-30'
    },
    history: [
      {
        month: 'October 2023',
        basicSalary: 75000,
        netPay: 82000,
        status: 'Paid',
        paymentDate: '2023-10-30'
      },
      {
        month: 'September 2023',
        basicSalary: 75000,
        netPay: 82000,
        status: 'Paid',
        paymentDate: '2023-09-30'
      }
    ]
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Payroll</h1>
            <p className="text-gray-600">View and manage your salary information</p>
          </div>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {months.map((month, index) => (
                <option key={month} value={index + 1}>{month}</option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'current' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Current Payroll
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium text-sm ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payment History
          </button>
        </div>

        {/* Current Payroll */}
        {activeTab === 'current' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Summary Card */}
            <div className="bg-blue-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-700">Payroll for {months[selectedMonth - 1]} {selectedYear}</h3>
                  <p className="text-sm text-gray-500">Payment date: {payrollData.current.paymentDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  payrollData.current.status === 'Paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {payrollData.current.status}
                </span>
              </div>
            </div>

            {/* Payroll Details */}
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Basic Salary</span>
                      <span className="font-medium">Rs. {payrollData.current.basicSalary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Allowances</span>
                      <span className="font-medium">Rs. {payrollData.current.allowances.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bonuses</span>
                      <span className="font-medium">Rs. {payrollData.current.bonuses.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Earnings</span>
                        <span>Rs. {(payrollData.current.basicSalary + payrollData.current.allowances + payrollData.current.bonuses).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Deductions</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-red-600">- Rs. {payrollData.current.tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Other Deductions</span>
                      <span className="font-medium text-red-600">- Rs. {payrollData.current.deductions.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-medium">
                        <span>Total Deductions</span>
                        <span className="text-red-600">- Rs. {(payrollData.current.tax + payrollData.current.deductions).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium text-gray-700">Net Pay</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rs. {payrollData.current.netPay.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Download Payslip
                </button>
                <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                  Request Correction
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Month
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Basic Salary
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Net Pay
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payrollData.history.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.month}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Rs. {item.basicSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        Rs. {item.netPay.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {item.paymentDate}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </button>
                        <button className="text-blue-600 hover:text-blue-900">
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollView;