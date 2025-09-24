import React, { useState } from 'react'
import { Calculator, ChevronDown, ChevronUp, Leaf, Zap, DollarSign, Droplets, Factory, Truck } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import LCAResults from './LCAResults'

const LCATool = () => {
  const [formData, setFormData] = useState({
    product: 'pipe',
    units: 10,
    route_type: 'conventional',
    bauxite_grade: 'medium',
    energy_source: 'renewable',
    eol_option: 'recycle',
    outer_radius_m: 0.05,
    inner_radius_m: 0.045,
    length_m: 2.0,
    thickness_m: 0.004,
    width_m: 1.2,
    sheet_length_m: 2.5
  })
  
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    dimensions: true,
    advanced: false
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/dashboard/stages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const SectionHeader = ({ title, section, icon: Icon }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </button>
  )

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <Calculator className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LCA Calculation Tool</h1>
          <p className="text-gray-600">Calculate environmental impact of aluminum products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card">
              <SectionHeader title="Basic Information" section="basic" icon={Package} />
              <AnimatePresence>
                {expandedSections.basic && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                        <select
                          value={formData.product}
                          onChange={(e) => handleInputChange('product', e.target.value)}
                          className="input-field"
                        >
                          <option value="pipe">Aluminum Pipe</option>
                          <option value="sheet">Aluminum Sheet</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
                        <input
                          type="number"
                          min="1"
                          value={formData.units}
                          onChange={(e) => handleInputChange('units', parseInt(e.target.value))}
                          className="input-field"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Production Route</label>
                        <select
                          value={formData.route_type}
                          onChange={(e) => handleInputChange('route_type', e.target.value)}
                          className="input-field"
                        >
                          <option value="conventional">Conventional (Bauxite)</option>
                          <option value="recycle">Recycled (Scrap)</option>
                        </select>
                      </div>
                      
                      {formData.route_type === 'conventional' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bauxite Grade</label>
                          <select
                            value={formData.bauxite_grade}
                            onChange={(e) => handleInputChange('bauxite_grade', e.target.value)}
                            className="input-field"
                          >
                            <option value="high">High Grade</option>
                            <option value="medium">Medium Grade</option>
                            <option value="low">Low Grade</option>
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Energy Source</label>
                        <select
                          value={formData.energy_source}
                          onChange={(e) => handleInputChange('energy_source', e.target.value)}
                          className="input-field"
                        >
                          <option value="renewable">Renewable</option>
                          <option value="non_renewable">Non-renewable</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End of Life</label>
                        <select
                          value={formData.eol_option}
                          onChange={(e) => handleInputChange('eol_option', e.target.value)}
                          className="input-field"
                        >
                          <option value="recycle">Recycle</option>
                          <option value="reuse">Reuse</option>
                          <option value="landfill">Landfill</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dimensions */}
            <div className="card">
              <SectionHeader title="Product Dimensions" section="dimensions" icon={Package} />
              <AnimatePresence>
                {expandedSections.dimensions && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4">
                      {formData.product === 'pipe' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Outer Radius (m)</label>
                            <input
                              type="number"
                              step="0.001"
                              value={formData.outer_radius_m}
                              onChange={(e) => handleInputChange('outer_radius_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Inner Radius (m)</label>
                            <input
                              type="number"
                              step="0.001"
                              value={formData.inner_radius_m}
                              onChange={(e) => handleInputChange('inner_radius_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.length_m}
                              onChange={(e) => handleInputChange('length_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Thickness (m)</label>
                            <input
                              type="number"
                              step="0.0001"
                              value={formData.thickness_m}
                              onChange={(e) => handleInputChange('thickness_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.width_m}
                              onChange={(e) => handleInputChange('width_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={formData.sheet_length_m}
                              onChange={(e) => handleInputChange('sheet_length_m', parseFloat(e.target.value))}
                              className="input-field"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>{loading ? 'Calculating...' : 'Calculate LCA'}</span>
              </button>
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                Error: {error}
              </div>
            )}
          </form>
        </div>

        {/* Quick Info Panel */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Factors</h3>
            <div className="space-y-4">
              {[
                { icon: Leaf, label: 'CO₂ Emissions', desc: 'Primary environmental impact', color: 'text-success-600' },
                { icon: Zap, label: 'Electricity Usage', desc: 'Energy consumption', color: 'text-warning-600' },
                { icon: Droplets, label: 'Water Usage', desc: 'Wastewater generation', color: 'text-primary-600' },
                { icon: Factory, label: 'Manufacturing', desc: 'Production costs', color: 'text-purple-600' },
                { icon: Truck, label: 'Transport', desc: 'Logistics impact', color: 'text-gray-600' }
              ].map((factor, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <factor.icon className={`w-5 h-5 ${factor.color}`} />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{factor.label}</p>
                    <p className="text-xs text-gray-600">{factor.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Selection</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-medium capitalize">{formData.product}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route:</span>
                <span className="font-medium capitalize">{formData.route_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Energy:</span>
                <span className="font-medium capitalize">{formData.energy_source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Units:</span>
                <span className="font-medium">{formData.units}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && <LCAResults data={results} />}
    </div>
  )
}

export default LCATool
