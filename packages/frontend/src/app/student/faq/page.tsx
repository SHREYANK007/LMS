'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Users,
  CreditCard,
  Settings,
  Clock,
  Star,
  Lightbulb,
  ExternalLink,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  Globe
} from 'lucide-react'
import { mockFAQs, getFAQsByCategory, getFAQsByCourse, faqCategories } from '@/data/mock/mockCommunication'

export default function StudentHelpPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  // Mock current student course
  const studentCourse = 'PTE' as 'PTE' | 'NAATI' | 'BOTH'

  // Get FAQs for student's course
  const courseFAQs = getFAQsByCourse(studentCourse)

  // Filter FAQs
  const filteredFAQs = courseFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categoryIcons = {
    'Sessions': Users,
    'Courses': BookOpen,
    'Materials': BookOpen,
    'Payments': CreditCard,
    'Access': Settings,
    'Progress': Star,
    'Technical': Settings,
    'General': HelpCircle
  }

  const stats = {
    totalFAQs: courseFAQs.length,
    categories: faqCategories.length,
    popularFAQs: courseFAQs.filter(faq => faq.isPopular).length,
    recentlyUpdated: courseFAQs.filter(faq => {
      if (!faq.lastUpdated) return false
      const daysDiff = Math.floor((new Date().getTime() - faq.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length
  }

  const popularFAQs = courseFAQs.filter(faq => faq.isPopular).slice(0, 6)

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Help Center
              </h1>
              <p className="text-slate-500 text-lg mt-1">Find answers to frequently asked questions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-semibold shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {stats.totalFAQs} FAQs
            </span>
            <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-green-400">
                +{stats.totalFAQs}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalFAQs}</div>
            <p className="text-sm text-slate-300">Total FAQs</p>
            <p className="text-xs text-slate-400 mt-2">Available answers</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-400">
                {stats.categories}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.categories}</div>
            <p className="text-sm text-slate-300">Categories</p>
            <p className="text-xs text-slate-400 mt-2">Organized topics</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-yellow-400">
                {stats.popularFAQs}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.popularFAQs}</div>
            <p className="text-sm text-slate-300">Popular FAQs</p>
            <p className="text-xs text-slate-400 mt-2">Most viewed</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-400">
                {stats.recentlyUpdated}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.recentlyUpdated}</div>
            <p className="text-sm text-slate-300">Recently Updated</p>
            <p className="text-xs text-slate-400 mt-2">This week</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Help</h2>
            <p className="text-slate-500">Popular questions and instant support</p>
          </div>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
            View All Categories <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Contact Support</h3>
            <p className="text-slate-600 text-sm mb-4">Get personalized help from our team</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Submit Ticket
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Phone className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Call Support</h3>
            <p className="text-slate-600 text-sm mb-4">Speak directly with our team</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              +1 (555) 123-4567
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Live Chat</h3>
            <p className="text-slate-600 text-sm mb-4">Chat with support agent</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Start Chat
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Popular FAQs */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Popular Questions</h2>
            <p className="text-slate-500">Most frequently asked questions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {popularFAQs.map((faq) => {
            const IconComponent = categoryIcons[faq.category as keyof typeof categoryIcons] || HelpCircle
            return (
              <div
                key={faq.id}
                onClick={() => toggleFAQ(faq.id)}
                className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800 mb-1">{faq.question}</h4>
                    <p className="text-xs text-slate-500">{faq.category}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 mt-1" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Search and Browse */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Browse All FAQs</h2>
            <p className="text-slate-500">Search and filter through all help articles</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option key="all" value="all">All Categories</option>
              {faqCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq) => {
            const IconComponent = categoryIcons[faq.category as keyof typeof categoryIcons] || HelpCircle
            const isExpanded = expandedFAQ === faq.id

            return (
              <div key={faq.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div
                  onClick={() => toggleFAQ(faq.id)}
                  className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{faq.question}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {faq.category}
                            </span>
                            {faq.isPopular && (
                              <span className="inline-flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs">Popular</span>
                              </span>
                            )}
                            <span className="text-xs">Updated {faq.lastUpdated ? faq.lastUpdated.toLocaleDateString() : 'N/A'}</span>
                          </div>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="ml-14 pl-4 border-l-2 border-indigo-100">
                      <div className="prose prose-slate max-w-none">
                        <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                      </div>

                      {faq.relatedLinks && faq.relatedLinks.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                          <h4 className="text-sm font-medium text-slate-800 mb-2">Related Links:</h4>
                          <div className="space-y-2">
                            {faq.relatedLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {link.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-600">Was this helpful?</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Yes
                            </Button>
                            <Button variant="outline" size="sm">
                              No
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredFAQs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
            <HelpCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No FAQs found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No FAQ articles available for your course'
              }
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="bg-indigo-700 hover:bg-indigo-700 text-white"
              >
                Clear Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}