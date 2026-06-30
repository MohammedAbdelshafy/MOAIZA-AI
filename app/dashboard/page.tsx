'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch tenders
    const fetchTenders = async () => {
      try {
        const response = await fetch('/api/tenders');
        const data = await response.json();
        if (data.success) {
          setTenders(data.tenders);
        }
      } catch (error) {
        console.error('Error fetching tenders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, []);

  const stats = [
    { label: 'Active Tenders', value: tenders.length, color: 'bg-blue-100' },
    { label: 'Total Value', value: '$250M+', color: 'bg-green-100' },
    { label: 'Win Rate', value: '68%', color: 'bg-purple-100' },
    { label: 'Avg. Margin', value: '12.5%', color: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Link
              href="/dashboard/tenders/new"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
            >
              + New Tender
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${stat.color} dark:bg-gray-700 rounded-lg p-6`}
            >
              <h3 className="text-gray-600 dark:text-gray-300 text-sm font-semibold">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Tenders Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold">Recent Tenders</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : tenders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No tenders yet. Create one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Estimated Cost
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tenders.map((tender: any) => (
                    <tr
                      key={tender.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-3">
                        <Link
                          href={`/dashboard/tenders/${tender.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {tender.title}
                        </Link>
                      </td>
                      <td className="px-6 py-3">{tender.clientName}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold
                          ${tender.status === 'ANALYZED' ? 'bg-green-100 text-green-800' : ''}
                          ${tender.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' : ''}
                        `}
                        >
                          {tender.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        ${(tender.estimatedCost / 1000000).toFixed(1)}M
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-500 h-2 rounded-full"
                              style={{
                                width: `${tender.riskScore}%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-semibold">
                            {tender.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/dashboard/tenders/${tender.id}`}
                          className="text-primary hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
