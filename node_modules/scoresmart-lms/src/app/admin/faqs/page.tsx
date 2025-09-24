'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'

export default function AdminFAQsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const stats = [
    {
      title: "Total FAQs",
      value: "67",
      description: "All questions",
      icon: HelpCircle,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Published",
      value: "52",
      description: "Live on website",
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Draft",
      value: "10",
      description: "Pending review",
      icon: Edit,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg. Helpfulness",
      value: "4.2",
      description: "User rating",
      icon: ThumbsUp,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const faqs = [
    {
      id: 1,
      question: "How do I register for PTE classes?",
      answer: "To register for PTE classes, go to the 'Courses' section, select 'PTE Academic', choose your preferred schedule, and complete the enrollment process. You can pay online using various payment methods.",
      category: "Registration",
      status: "published",
      views: 245,
      helpfulVotes: 42,
      notHelpfulVotes: 3,
      lastUpdated: "2024-12-15",
      author: "Admin Team"
    },
    {
      id: 2,
      question: "What is the refund policy for courses?",
      answer: "We offer a full refund if you cancel within 48 hours of enrollment. After that, refunds are provided on a case-by-case basis depending on the circumstances.",
      category: "Payments",
      status: "published",
      views: 189,
      helpfulVotes: 35,
      notHelpfulVotes: 8,
      lastUpdated: "2024-12-10",
      author: "Finance Team"
    },
    {
      id: 3,
      question: "How can I access recorded sessions?",
      answer: "Recorded sessions are available in your student portal under 'My Courses' > 'Recordings'. They are typically uploaded within 24 hours after the live session.",
      category: "Technical",
      status: "draft",
      views: 0,
      helpfulVotes: 0,
      notHelpfulVotes: 0,
      lastUpdated: "2024-12-18",
      author: "Tech Team"
    },
    {
      id: 4,
      question: "What are the requirements for NAATI CCL preparation?",
      answer: "For NAATI CCL preparation, you should have intermediate to advanced proficiency in both English and your LOTE (Language Other Than English). We recommend taking our placement test first.",
      category: "Courses",
      status: "published",
      views: 156,
      helpfulVotes: 28,
      notHelpfulVotes: 2,
      lastUpdated: "2024-12-12",
      author: "Academic Team"
    }
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Registration': return 'bg-blue-100 text-blue-800'
      case 'Payments': return 'bg-green-100 text-green-800'
      case 'Technical': return 'bg-purple-100 text-purple-800'
      case 'Courses': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const toggleFaqExpansion = (faqId: number) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                FAQs Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage frequently asked questions and help content
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <MessageCircle className="w-4 h-4" />
              View Analytics
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Add FAQ
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Registration">Registration</option>
              <option value="Payments">Payments</option>
              <option value="Technical">Technical</option>
              <option value="Courses">Courses</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* FAQs List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">FAQ Collection</h3>
            <Button variant="outline" size="sm">
              Export FAQs
            </Button>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <HelpCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(faq.status)}`}>
                          {faq.status}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(faq.category)}`}>
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFaqExpansion(faq.id)}
                      >
                        {expandedFaq === faq.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-2 cursor-pointer"
                      onClick={() => toggleFaqExpansion(faq.id)}>
                    {faq.question}
                  </h4>

                  {expandedFaq === faq.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 mb-4">{faq.answer}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Views: {faq.views}</span>
                          <span>Author: {faq.author}</span>
                          <span>Updated: {faq.lastUpdated}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <ThumbsUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-600">{faq.helpfulVotes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsDown className="h-3 w-3 text-red-500" />
                            <span className="text-red-600">{faq.notHelpfulVotes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>Views: {faq.views}</span>
                      <span>Updated: {faq.lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">{faq.helpfulVotes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ThumbsDown className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">{faq.notHelpfulVotes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}