import React, { useState, useEffect } from 'react'
import { History as HistoryIcon, Search, Filter, Download, Eye, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

const History = () => {
  const [calculations, setCalculations] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockData = [
      {
        id: 1,
        product: 'Aluminum Pipe',
        route: 'Conventional',
        energy: 'Renewable',
        co2: 8.5,
        cost: 234.50,
        date: '2024-01-15',
        units: 10
      },
      {
        id: 2,
        product: 'Aluminum Sheet',
        route: 'Recycled',
        energy: 'Non-renewable',
        co2: 12.3,
        cost: 189.75,
        date: '2024-01-14',
        units: 25
      },
      {
        id: 3,
        product: 'Aluminum Pipe',
        route: 'Recycled',
        energy: 'Renewable',
        co2: 5.2,
        cost: 156.20,
        date: '2024-01-12',
        units: 15
      }
    ]
    
    setTimeout(() => {
      setCalculations(mockData)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCalculations = calculations.filter(calc => {
    const matchesSearch = calc.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         calc.route.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || calc.product.toLowerCase().includes(filterType)
    return matchesSearch && matchesFilter
  })

  const handleDelete = (id) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <HistoryIcon className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calculation History</h1>
          <p className="text-gray-600">View and manage your previous LCA calculations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search calculations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field"
            >
              <option value="all">All Products</option>
              <option value="pipe">Pipes</option>
              <option value="sheet">Sheets</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredCalculations.length === 0 ? (
          <div className="card text-center py-12">
            <HistoryIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No calculations found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by creating your first LCA calculation'
              }
            </p>
          </div>
        ) : (
          filteredCalculations.map((calc, index) => (
            <motion.div
              key={calc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-hover"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{calc.product}</h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <span>{calc.route} Route</span>
                        <span>•</span>
                        <span>{calc.energy} Energy</span>
                        <span>•</span>
                        <span>{calc.units} units</span>
                        <span>•</span>
                        <span>{calc.date}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">CO₂ Emissions</p>
                        <p className="text-lg font-bold text-success-600">{calc.co2} kg</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Total Cost</p>
                        <p className="text-lg font-bold text-gray-900">${calc.cost}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(calc.id)}
                    className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default History