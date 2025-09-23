'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  CreditCard,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  Check,
  Clock,
  AlertCircle,
  Star,
  Receipt,
  RefreshCw,
  Trash2,
  Edit3,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Wallet,
  Shield,
  Zap
} from 'lucide-react'
import {
  mockPaymentMethods,
  mockTransactions,
  getTransactionsByUser,
  getTransactionsByStatus,
  getPaymentMethodsByUser,
  getTransactionStats,
  formatCurrency,
  mockIntegrationServices
} from '@/data/mock/mockIntegrations'

export default function StudentPaymentsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'methods' | 'billing'>('overview')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'completed' | 'pending' | 'failed' | 'cancelled'>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isProcessing, setIsProcessing] = useState(false)

  // Mock current student ID
  const currentStudentId = 'student1'

  // Get student data
  const studentTransactions = getTransactionsByUser(currentStudentId)
  const studentPaymentMethods = getPaymentMethodsByUser(currentStudentId)
  const transactionStats = getTransactionStats(currentStudentId)

  // Filter transactions
  const filteredTransactions = selectedStatus === 'all'
    ? studentTransactions
    : studentTransactions.filter(txn => txn.status === selectedStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-gray-600" />
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className="w-5 h-5" />
      case 'paypal':
        return <Wallet className="w-5 h-5" />
      case 'bank_transfer':
        return <DollarSign className="w-5 h-5" />
      default:
        return <CreditCard className="w-5 h-5" />
    }
  }

  const handleProcessPayment = async (amount: number, description: string) => {
    setIsProcessing(true)
    try {
      const result = await mockIntegrationServices.payments.processPayment(
        amount,
        studentPaymentMethods[0]?.id || 'pm_1',
        description
      )
      console.log('Payment processed:', result)
      // Show success message
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-premium bg-gray-25">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Center</h1>
              <p className="text-gray-600">Manage your payments, billing, and transaction history</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-900">{formatCurrency(transactionStats.totalAmount)}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Total Spent</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{transactionStats.completed}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Transactions</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-gray-900">{transactionStats.pending}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Pending</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">{formatCurrency(transactionStats.averageAmount)}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Avg Amount</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'methods', label: 'Payment Methods', icon: CreditCard },
            { id: 'billing', label: 'Billing', icon: DollarSign }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Payment Overview Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending Overview */}
              <div className="card-elevated">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Spending Overview</h3>
                    <select
                      value={selectedPeriod}
                      onChange={(e) => setSelectedPeriod(e.target.value as any)}
                      className="text-sm border-gray-300 rounded-lg"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-700">Total Spent</p>
                          <p className="text-2xl font-bold text-green-900">{formatCurrency(transactionStats.totalAmount)}</p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">One-to-One Sessions</span>
                        <span className="text-sm font-medium text-gray-900">$300</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Smart Quad Sessions</span>
                        <span className="text-sm font-medium text-gray-900">$160</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Course Packages</span>
                        <span className="text-sm font-medium text-gray-900">$1600</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card-elevated">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>

                  <div className="space-y-4">
                    <Button
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => handleProcessPayment(150, 'One-to-One PTE Session')}
                      disabled={isProcessing}
                    >
                      <Plus className="w-5 h-5" />
                      {isProcessing ? 'Processing...' : 'Book Session Payment'}
                    </Button>

                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <Download className="w-5 h-5" />
                      Download Invoices
                    </Button>

                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <Shield className="w-5 h-5" />
                      Payment Security
                    </Button>

                    <Button variant="outline" className="w-full justify-start gap-3 h-12">
                      <RefreshCw className="w-5 h-5" />
                      Auto-Pay Settings
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('transactions')}>
                    View All
                  </Button>
                </div>

                <div className="space-y-3">
                  {studentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          {getStatusIcon(transaction.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount, transaction.currency)}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card-premium">
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'completed', label: 'Completed' },
                      { id: 'pending', label: 'Pending' },
                      { id: 'failed', label: 'Failed' },
                      { id: 'cancelled', label: 'Cancelled' }
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setSelectedStatus(filter.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedStatus === filter.id
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="card-interactive">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Receipt className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>ID: {transaction.id}</span>
                            <span>•</span>
                            <span>{transaction.createdAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{transaction.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 mb-2">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          {transaction.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        Payment Method: {transaction.paymentMethodId}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-4 h-4" />
                          Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="space-y-6">
            {/* Payment Methods */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="space-y-4">
                  {studentPaymentMethods.map((method) => (
                    <div key={method.id} className="card-premium p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            {getPaymentMethodIcon(method.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-gray-900">{method.provider}</h4>
                              {method.isDefault && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {method.type === 'card' && method.last4 && (
                                `**** **** **** ${method.last4}`
                              )}
                              {method.type === 'paypal' && 'PayPal Account'}
                              {method.type === 'bank_transfer' && 'Bank Transfer'}
                            </p>
                            {method.expiryMonth && method.expiryYear && (
                              <p className="text-xs text-gray-500">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="card-elevated bg-blue-50 border-blue-200">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Secure Payments</h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
                    </p>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• 256-bit SSL encryption</li>
                      <li>• PCI DSS compliant</li>
                      <li>• Two-factor authentication available</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            {/* Billing Overview */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Current Plan</h4>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-purple-900">PTE Complete Course</p>
                          <p className="text-sm text-purple-700">6 months subscription</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-purple-900">$1,600</p>
                          <p className="text-xs text-purple-600">paid annually</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Next Billing</h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600">Next payment due</p>
                      <p className="font-semibold text-gray-900">July 1, 2024</p>
                      <p className="text-sm text-gray-600 mt-2">Auto-renewal enabled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Billing Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button variant="outline" className="h-16 gap-3">
                <Download className="w-5 h-5" />
                Download All Invoices
              </Button>
              <Button variant="outline" className="h-16 gap-3">
                <RefreshCw className="w-5 h-5" />
                Update Billing Info
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}