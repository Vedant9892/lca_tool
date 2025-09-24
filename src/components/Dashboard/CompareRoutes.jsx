import React, { useState } from 'react'
import { GitCompare, Leaf, Zap, DollarSign, Droplets, TrendingDown, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { motion } from 'framer-motion'

const CompareRoutes = () => {
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('pipe')

  // Mock comparison data
  const mockData = {
    conventional: {
      co2: 15.8,
      electricity: 45.2,
      cost: 289.50,
      water: 156.3,
      quality: 0.85
    },
    recycled: {
      co2: 8.4,
      electricity: 28.7,
      cost: 198.75,
      water: 89.2,
      quality: 0.78
    }
  }

  const runComparison = () => {
    setLoading(true)
    setTimeout(() => {
      setComparisonData(mockData)
      setLoading(false)
    }, 2000)
  }

  const factors = [
    { key: 'co2', label: 'CO₂ Emissions', unit: 'kg', icon: Leaf, color: '#22c55e' },
    { key: 'electricity', label: 'Electricity', unit: 'kWh', icon: Zap, color: '#f59e0b' },
    { key: 'cost', label: 'Total Cost', unit: 'USD', icon: DollarSign, color: '#8b5cf6' },
    { key: 'water', label: 'Water Usage', unit: 'L', icon: Droplets, color: '#0ea5e9' }
  ]

  const radarData = factors.map(factor => ({
    factor: factor.label,
    conventional: comparisonData?.conventional[factor.key] || 0,
    recycled: comparisonData?.recycled[factor.key] || 0
  }))

  const barData = factors.map(factor => ({
    name: factor.label,
    conventional: comparisonData?.conventional[factor.key] || 0,
    recycled: comparisonData?.recycled[factor.key] || 0,
    unit: factor.unit
  }))

  const calculateImprovement = (conventional, recycled) => {
    const improvement = ((conventional - recycled) / conventional) * 100
    return improvement
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <GitCompare className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Route Comparison</h1>
          <p className="text-gray-600">Compare conventional vs recycled production routes</p>
        </div>
      </div>

      {/* Comparison Setup */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Comparison Setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="input-field"
            >
              <option value="pipe">Aluminum Pipe</option>
              <option value="sheet">Aluminum Sheet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Energy Source</label>
            <select className="input-field">
              <option value="renewable">Renewable</option>
              <option value="non_renewable">Non-renewable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
            <input type="number" min="1" defaultValue="10" className="input-field" />
          </div>
        </div>
        
        <button
          onClick={runComparison}
          disabled={loading}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <GitCompare className="w-5 h-5" />
          <span>{loading ? 'Comparing...' : 'Run Comparison'}</span>
        </button>
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {factors.map((factor, index) => {
              const conventional = comparisonData.conventional[factor.key]
              const recycled = comparisonData.recycled[factor.key]
              const improvement = calculateImprovement(conventional, recycled)
              const isImprovement = improvement > 0
              
              return (
                <div key={factor.key} className="card-hover">
                  <div className="flex items-center space-x-3 mb-3">
                    <factor.icon className="w-5 h-5" style={{ color: factor.color }} />
                    <h3 className="font-semibold text-gray-900">{factor.label}</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Conventional:</span>
                      <span className="font-medium">{conventional} {factor.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Recycled:</span>
                      <span className="font-medium">{recycled} {factor.unit}</span>
                    </div>
                    <div className={`flex items-center justify-between text-sm font-medium ${
                      isImprovement ? 'text-success-600' : 'text-error-600'
                    }`}>
                      <span>Improvement:</span>
                      <div className="flex items-center space-x-1">
                        {isImprovement ? (
                          <TrendingDown className="w-4 h-4" />
                        ) : (
                          <TrendingUp className="w-4 h-4" />
                        )}
                        <span>{Math.abs(improvement).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Side-by-Side Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value, name, props) => [`${value} ${props.payload.unit}`, name]} />
                  <Bar dataKey="conventional" fill="#ef4444" name="Conventional" />
                  <Bar dataKey="recycled" fill="#22c55e" name="Recycled" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Radar Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="factor" />
                  <PolarRadiusAxis />
                  <Radar name="Conventional" dataKey="conventional" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                  <Radar name="Recycled" dataKey="recycled" stroke="#22c55e" fill="#22c55e" fillOpacity={0.3} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Route Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-success-50 border border-success-200 rounded-lg p-6">
                <h4 className="font-semibold text-success-900 mb-2">✅ Recommended: Recycled Route</h4>
                <ul className="space-y-2 text-sm text-success-800">
                  <li>• {calculateImprovement(comparisonData.conventional.co2, comparisonData.recycled.co2).toFixed(1)}% lower CO₂ emissions</li>
                  <li>• {calculateImprovement(comparisonData.conventional.electricity, comparisonData.recycled.electricity).toFixed(1)}% less electricity usage</li>
                  <li>• {calculateImprovement(comparisonData.conventional.cost, comparisonData.recycled.cost).toFixed(1)}% cost reduction</li>
                  <li>• Supports circular economy principles</li>
                </ul>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Conventional Route Benefits</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Higher quality score ({comparisonData.conventional.quality})</li>
                  <li>• More predictable supply chain</li>
                  <li>• Established infrastructure</li>
                  <li>• Consistent material properties</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default CompareRoutes
