import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts'
import { 
  Leaf, Zap, DollarSign, Droplets, Factory, Truck, 
  TrendingDown, TrendingUp, Download, Share2, ChevronDown, ChevronUp
} from 'lucide-react'

const LCAResults = ({ data }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFactors, setExpandedFactors] = useState({})

  const toggleFactor = (factor) => {
    setExpandedFactors(prev => ({
      ...prev,
      [factor]: !prev[factor]
    }))
  }

  const factors = [
    {
      key: 'carbon_kgco2e',
      label: 'CO₂ Emissions',
      icon: Leaf,
      color: '#22c55e',
      unit: 'kg CO₂e',
      primary: true,
      description: 'Total carbon dioxide equivalent emissions'
    },
    {
      key: 'electricity_kwh',
      label: 'Electricity',
      icon: Zap,
      color: '#f59e0b',
      unit: 'kWh',
      description: 'Total electrical energy consumption'
    },
    {
      key: 'manufacturing_cost_per_unit',
      label: 'Manufacturing Cost',
      icon: DollarSign,
      color: '#8b5cf6',
      unit: 'USD',
      description: 'Total manufacturing cost per unit'
    },
    {
      key: 'wastewater_l',
      label: 'Wastewater',
      icon: Droplets,
      color: '#0ea5e9',
      unit: 'L',
      description: 'Total wastewater generated'
    },
    {
      key: 'naturalGas_nm3',
      label: 'Natural Gas',
      icon: Factory,
      color: '#6b7280',
      unit: 'Nm³',
      description: 'Natural gas consumption'
    },
    {
      key: 'transport_cost_usd',
      label: 'Transport Cost',
      icon: Truck,
      color: '#ef4444',
      unit: 'USD',
      description: 'Transportation and logistics costs'
    }
  ]

  const COLORS = ['#22c55e', '#f59e0b', '#8b5cf6', '#0ea5e9', '#6b7280', '#ef4444']

  // Prepare chart data
  const stageData = data.stages?.filter(stage => stage.scope === 'per_unit') || []
  const totals = data.totals || {}

  const pieData = factors.map((factor, index) => ({
    name: factor.label,
    value: totals.total?.[factor.key] || 0,
    color: COLORS[index]
  })).filter(item => item.value > 0)

  const FactorCard = ({ factor, value, isExpanded, onToggle }) => {
    const Icon = factor.icon
    const isPrimary = factor.primary
    
    return (
      <motion.div
        layout
        className={`card-hover cursor-pointer ${isPrimary ? 'ring-2 ring-success-200 bg-success-50' : ''}`}
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${isPrimary ? 'bg-success-600' : 'bg-gray-100'}`}>
              <Icon className={`w-6 h-6 ${isPrimary ? 'text-white' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${isPrimary ? 'text-success-900' : 'text-gray-900'}`}>
                {factor.label}
                {isPrimary && <span className="ml-2 text-xs bg-success-200 text-success-800 px-2 py-1 rounded-full">PRIMARY</span>}
              </h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {value?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {factor.unit}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-success-600" />
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <p className="text-sm text-gray-600 mb-3">{factor.description}</p>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stageData}>
                    <Area 
                      type="monotone" 
                      dataKey={factor.key} 
                      stroke={factor.color} 
                      fill={factor.color}
                      fillOpacity={0.3}
                    />
                    <XAxis dataKey="stage" hide />
                    <YAxis hide />
                    <Tooltip 
                      formatter={(value) => [`${value.toFixed(2)} ${factor.unit}`, factor.label]}
                      labelFormatter={(label) => `Stage: ${label}`}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Results Header */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">LCA Results</h2>
            <p className="text-primary-100">
              Environmental impact analysis for {data.totals?.total?.units || 0} units
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Environmental Factors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {factors.map((factor) => (
          <FactorCard
            key={factor.key}
            factor={factor}
            value={totals.total?.[factor.key]}
            isExpanded={expandedFactors[factor.key]}
            onToggle={() => toggleFactor(factor.key)}
          />
        ))}
      </div>

      {/* Visualization Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'stages', label: 'Stage Breakdown' },
              { id: 'comparison', label: 'Factor Comparison' },
              { id: 'recommendations', label: 'Recommendations' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-96">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value.toFixed(2), name]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h3>
                <div className="space-y-4">
                  <div className="bg-success-50 p-4 rounded-lg border border-success-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Leaf className="w-5 h-5 text-success-600" />
                      <span className="font-semibold text-success-900">Primary Impact</span>
                    </div>
                    <p className="text-2xl font-bold text-success-900">
                      {totals.total?.carbon_kgco2e?.toFixed(2)} kg CO₂e
                    </p>
                    <p className="text-sm text-success-700 mt-1">
                      Carbon footprint per {totals.total?.units} units
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-lg font-bold text-gray-900">
                        ${(totals.total?.manufacturing_cost_per_unit || 0).toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Energy</p>
                      <p className="text-lg font-bold text-gray-900">
                        {(totals.total?.electricity_kwh || 0).toFixed(1)} kWh
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Production Stage Breakdown</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="stage" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    fontSize={12}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="carbon_kgco2e" fill="#22c55e" name="CO₂ (kg)" />
                  <Bar dataKey="electricity_kwh" fill="#f59e0b" name="Electricity (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Factor Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={stageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stage" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="carbon_kgco2e" stroke="#22c55e" strokeWidth={3} />
                  <Line type="monotone" dataKey="electricity_kwh" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="wastewater_l" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Sustainability Recommendations</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-success-50 border border-success-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-success-600" />
                    <h4 className="font-semibold text-success-900">Switch to Renewable Energy</h4>
                  </div>
                  <p className="text-success-800 text-sm mb-3">
                    Reduce CO₂ emissions by up to 70% by switching from non-renewable to renewable energy sources.
                  </p>
                  <div className="bg-success-100 p-3 rounded-lg">
                    <p className="text-xs text-success-700">
                      <strong>Potential savings:</strong> {((totals.total?.carbon_kgco2e || 0) * 0.7).toFixed(2)} kg CO₂e
                    </p>
                  </div>
                </div>

                <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-primary-600" />
                    <h4 className="font-semibold text-primary-900">Consider Recycled Route</h4>
                  </div>
                  <p className="text-primary-800 text-sm mb-3">
                    Using recycled aluminum can reduce overall environmental impact by 35-65%.
                  </p>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <p className="text-xs text-primary-700">
                      <strong>Estimated reduction:</strong> {((totals.total?.electricity_kwh || 0) * 0.5).toFixed(1)} kWh
                    </p>
                  </div>
                </div>

                <div className="bg-warning-50 border border-warning-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-warning-600" />
                    <h4 className="font-semibold text-warning-900">Optimize End-of-Life</h4>
                  </div>
                  <p className="text-warning-800 text-sm mb-3">
                    Choose recycling over landfill to reduce long-term environmental impact.
                  </p>
                  <div className="bg-warning-100 p-3 rounded-lg">
                    <p className="text-xs text-warning-700">
                      <strong>Impact reduction:</strong> 15% lower carbon footprint
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Factory className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Process Optimization</h4>
                  </div>
                  <p className="text-purple-800 text-sm mb-3">
                    Optimize manufacturing processes to reduce waste and improve efficiency.
                  </p>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <p className="text-xs text-purple-700">
                      <strong>Cost savings:</strong> Up to ${((totals.total?.manufacturing_cost_per_unit || 0) * 0.1).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stage Details Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Stage Analysis</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CO₂ (kg)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Electricity (kWh)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost (USD)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality Score
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stageData.map((stage, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stage.stage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stage.carbon_kgco2e?.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stage.electricity_kwh?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${stage.manufacturing_cost_per_unit_usd?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {stage.quality_score?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

export default LCAResults
