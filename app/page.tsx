'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              🏗️ MOAIZA AI
            </div>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-primary"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            AI-Powered Construction Bidding
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Upload tenders, extract BOQs, calculate costs, and generate winning bids with AI assistance.
            Built for construction companies in Egypt and GCC markets.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 bg-white dark:bg-gray-800 text-primary border-2 border-primary rounded-lg hover:bg-blue-50 transition text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📄',
                title: 'Tender Upload',
                description: 'Upload PDF, Excel, DOCX, or ZIP files for analysis',
              },
              {
                icon: '🤖',
                title: 'AI Analysis',
                description: 'Automatic BOQ extraction with confidence scoring',
              },
              {
                icon: '📊',
                title: 'Cost Estimation',
                description: 'Intelligent cost calculation with multiple strategies',
              },
              {
                icon: '⚠️',
                title: 'Risk Detection',
                description: 'Identify risks and missing information automatically',
              },
              {
                icon: '💰',
                title: 'Pricing Engine',
                description: 'Dynamic material pricing from multiple suppliers',
              },
              {
                icon: '📈',
                title: 'Bid Strategy',
                description: 'Aggressive, Balanced, or Conservative bidding modes',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Winning Bids?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join construction companies across Egypt and GCC countries using MOAIZA AI
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 transition font-semibold"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 MOAIZA AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
