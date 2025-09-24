import React, { useState } from 'react'
import { Package, Plus, Save, Trash2, Edit3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const ProductInput = () => {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Custom Pipe A',
      type: 'pipe',
      specifications: {
        outer_radius: 0.08,
        inner_radius: 0.06,
        length: 3.0
      },
      lastCalculated: '2024-01-15'
    }
  ])
  
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'pipe',
    specifications: {}
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...formData, id: editingProduct.id, lastCalculated: new Date().toISOString().split('T')[0] }
          : p
      ))
    } else {
      const newProduct = {
        ...formData,
        id: Date.now(),
        lastCalculated: new Date().toISOString().split('T')[0]
      }
      setProducts(prev => [...prev, newProduct])
    }
    
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: '', type: 'pipe', specifications: {} })
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleEdit = (product) => {
    setFormData(product)
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Input</h1>
            <p className="text-gray-600">Create and manage personalized product specifications</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="input-field"
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="input-field"
                  >
                    <option value="pipe">Aluminum Pipe</option>
                    <option value="sheet">Aluminum Sheet</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                {formData.type === 'pipe' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Outer Radius (m)</label>
                      <input
                        type="number"
                        step="0.001"
                        required
                        value={formData.specifications.outer_radius || ''}
                        onChange={(e) => handleInputChange('specifications.outer_radius', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inner Radius (m)</label>
                      <input
                        type="number"
                        step="0.001"
                        required
                        value={formData.specifications.inner_radius || ''}
                        onChange={(e) => handleInputChange('specifications.inner_radius', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.specifications.length || ''}
                        onChange={(e) => handleInputChange('specifications.length', parseFloat(e.target.value))}
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
                        required
                        value={formData.specifications.thickness || ''}
                        onChange={(e) => handleInputChange('specifications.thickness', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Width (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.specifications.width || ''}
                        onChange={(e) => handleInputChange('specifications.width', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Length (m)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.specifications.sheet_length || ''}
                        onChange={(e) => handleInputChange('specifications.sheet_length', parseFloat(e.target.value))}
                        className="input-field"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProduct ? 'Update' : 'Save'} Product</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Saved Products</h2>
        
        {products.length === 0 ? (
          <div className="card text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products saved</h3>
            <p className="text-gray-600 mb-4">Create your first custom product to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{product.type}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-gray-400 hover:text-error-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                      <span className="font-medium">{value} m</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Last calculated: {product.lastCalculated}</p>
                  <button className="mt-2 w-full btn-primary text-sm py-2">
                    Run LCA Analysis
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact Summary</h3>
          <div className="bg-gradient-to-r from-success-50 to-primary-50 p-6 rounded-lg">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                Recycled Route Saves
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-3xl font-bold text-success-600">
                    {(comparisonData.conventional.co2 - comparisonData.recycled.co2).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">kg CO₂e</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-warning-600">
                    {(comparisonData.conventional.electricity - comparisonData.recycled.electricity).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">kWh</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">
                    ${(comparisonData.conventional.cost - comparisonData.recycled.cost).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">USD</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {(comparisonData.conventional.water - comparisonData.recycled.water).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">Liters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductInput
