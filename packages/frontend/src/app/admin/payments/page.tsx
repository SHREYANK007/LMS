'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

export default function AdminPaymentsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedMethod, setSelectedMethod] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: "Total Revenue",
      value: "$48,920",
      description: "This month",
      icon: DollarSign,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Successful Payments",
      value: "156",
      description: "This month",
      icon: CheckCircle2,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Pending Payments",
      value: "12",
      description: "Awaiting processing",
      icon: Clock,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Failed Payments",
      value: "8",
      description: "Need attention",
      icon: XCircle,
      color: "from-red-500 to-red-600"
    }
  ]

  const payments = [
    {
      id: "PAY-001",
      transactionId: "TXN-2024-1220-001",
      studentName: "Alice Johnson",
      studentEmail: "alice.johnson@email.com",
      course: "PTE Academic Preparation",
      amount: 299.00,
      currency: "USD",
      paymentMethod: "Credit Card",
      status: "completed",
      date: "2024-12-20",
      paymentGateway: "Stripe",
      receiptSent: true
    },
    {
      id: "PAY-002",
      transactionId: "TXN-2024-1220-002",
      studentName: "Mark Davis",
      studentEmail: "mark.davis@email.com",
      course: "NAATI CCL Preparation",
      amount: 399.00,
      currency: "USD",
      paymentMethod: "PayPal",
      status: "pending",
      date: "2024-12-20",
      paymentGateway: "PayPal",
      receiptSent: false
    },
    {
      id: "PAY-003",
      transactionId: "TXN-2024-1219-003",
      studentName: "Emma Wilson",
      studentEmail: "emma.wilson@email.com",
      course: "1-on-1 Tutoring Session",
      amount: 75.00,
      currency: "USD",
      paymentMethod: "Debit Card",
      status: "failed",
      date: "2024-12-19",
      paymentGateway: "Stripe",
      receiptSent: false
    },
    {
      id: "PAY-004",
      transactionId: "TXN-2024-1219-004",
      studentName: "James Brown",
      studentEmail: "james.brown@email.com",
      course: "PTE Speaking Masterclass",
      amount: 149.00,
      currency: "USD",
      paymentMethod: "Bank Transfer",
      status: "refunded",
      date: "2024-12-19",
      paymentGateway: "Manual",
      receiptSent: true
    },
    {
      id: "PAY-005",
      transactionId: "TXN-2024-1218-005",
      studentName: "Sarah Miller",
      studentEmail: "sarah.miller@email.com",
      course: "NAATI Mock Test Package",
      amount: 99.00,
      currency: "USD",
      paymentMethod: "Credit Card",
      status: "completed",
      date: "2024-12-18",
      paymentGateway: "Square",
      receiptSent: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'Credit Card': return 'bg-blue-100 text-blue-800'
      case 'Debit Card': return 'bg-purple-100 text-purple-800'
      case 'PayPal': return 'bg-orange-100 text-orange-800'
      case 'Bank Transfer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Payments & Billing
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage transactions, refunds, and financial records
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Manual Payment
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Methods</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Transactions</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Refresh Data
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Transaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">#{payment.id}</p>
                        <p className="text-xs text-gray-500">{payment.transactionId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">{payment.studentName}</p>
                        <p className="text-xs text-gray-500">{payment.studentEmail}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-800">{payment.course}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-800">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMethodColor(payment.paymentMethod)}`}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-600">{payment.date}</p>
                      <p className="text-xs text-gray-500">{payment.paymentGateway}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Download className="h-4 w-4" />
                        </Button>
                        {payment.status === 'failed' && (
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        {payment.status === 'completed' && !payment.receiptSent && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            Send Receipt
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Revenue Analytics</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">View detailed revenue reports and trends</p>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              View Analytics
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Refund Center</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Process refunds and manage disputes</p>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              Manage Refunds
            </Button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800">Failed Payments</h4>
            </div>
            <p className="text-sm text-gray-600 mb-4">Review and retry failed transactions</p>
            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
              Review Failed
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}