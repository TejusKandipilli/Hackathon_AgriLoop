import React, { useState, useEffect } from 'react';
import { Leaf, Calculator, TrendingUp, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImpactCalculator = () => {
  const [wasteType, setWasteType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const [carbonReduction, setCarbonReduction] = useState(0);
  const [counterValue, setCounterValue] = useState(0);
  const navigate = useNavigate();

  const wasteTypes = [
    { 
      id: 'rice-husk', 
      name: 'Rice Husk', 
      factor: 950, // kg CO2-eq/ton when burned (includes CH4, N2O, CO2)
      description: 'Prevents 950 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'wheat-straw', 
      name: 'Wheat Straw', 
      factor: 870, // kg CO2-eq/ton when burned
      description: 'Prevents 870 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'corn-stalks', 
      name: 'Corn Stalks', 
      factor: 1118, // kg CO2-eq/ton when burned (highest emissions)
      description: 'Prevents 1,118 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'sugarcane-bagasse', 
      name: 'Sugarcane Bagasse', 
      factor: 1620, // kg CO2-eq/ton when burned (direct CO2 + other gases)
      description: 'Prevents 1,620 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'rice-straw', 
      name: 'Rice Straw', 
      factor: 1019, // kg CO2-eq/ton when burned
      description: 'Prevents 1,019 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'cotton-stalks', 
      name: 'Cotton Stalks', 
      factor: 920, // kg CO2-eq/ton when burned
      description: 'Prevents 920 kg CO2-eq per ton if recycled instead of burned'
    },
    { 
      id: 'banana-leaves', 
      name: 'Banana Leaves', 
      factor: 750, // kg CO2-eq/ton when burned (lower due to high moisture)
      description: 'Prevents 750 kg CO2-eq per ton if recycled instead of burned'
    }
  ];

  const handleCalculate = () => {
    if (!wasteType || !quantity) return;
    
    setIsCalculating(true);
    setShowResults(false);
    setFillProgress(0);
    setCounterValue(0);
    
    // Calculate carbon reduction based on actual emissions prevented from burning
    const selectedWaste = wasteTypes.find(w => w.id === wasteType);
    const reduction = parseFloat(quantity) * selectedWaste.factor; // Direct kg CO2-eq prevented
    setCarbonReduction(reduction);
    
    // Start animations after a brief delay
    setTimeout(() => {
      setShowResults(true);
      
      // Animate globe fill
      const fillInterval = setInterval(() => {
        setFillProgress(prev => {
          if (prev >= 100) {
            clearInterval(fillInterval);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
      // Animate counter
      const counterInterval = setInterval(() => {
        setCounterValue(prev => {
          if (prev >= reduction) {
            clearInterval(counterInterval);
            return reduction;
          }
          return prev + reduction / 50;
        });
      }, 60);
      
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <h1 onClick={() => navigate('/')} className="text-4xl font-bold text-gray-800 cursor-pointer">AgriLoop</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Environmental Impact Calculator</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the positive environmental impact of recycling your agricultural waste. 
            See how your contribution helps reduce carbon emissions and promotes sustainability.
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Waste Type
              </label>
              <select
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="">Choose your agricultural waste...</option>
                {wasteTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity (tons)
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity in tons"
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          
          <button
            onClick={handleCalculate}
            disabled={!wasteType || !quantity || isCalculating}
            className="w-full mt-6 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
          >
            {isCalculating ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Calculating Impact...
              </>
            ) : (
              <>
                <Calculator className="h-6 w-6 mr-3" />
                Calculate Environmental Impact
              </>
            )}
          </button>
        </div>

        {/* Results Animation */}
        {showResults && (
          <div className="space-y-8">
            {/* Globe Animation */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-500 mr-3" />
                Environmental Impact Visualization
              </h3>
              
              <div className="relative mx-auto w-64 h-64 mb-6">
                {/* Earth Globe */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl overflow-hidden">
                  {/* Continents (simplified) */}
                  <div className="absolute top-8 left-12 w-16 h-12 bg-green-500 rounded-full opacity-80"></div>
                  <div className="absolute top-16 right-8 w-12 h-16 bg-green-500 rounded-lg opacity-80"></div>
                  <div className="absolute bottom-12 left-8 w-20 h-8 bg-green-500 rounded-full opacity-80"></div>
                  <div className="absolute bottom-8 right-12 w-8 h-12 bg-green-500 rounded-full opacity-80"></div>
                  
                  {/* Green liquid fill */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-400 to-green-300 opacity-70 transition-all duration-1000 ease-out"
                    style={{ height: `${fillProgress}%` }}
                  ></div>
                  
                  {/* Sparkle effects */}
                  {fillProgress > 20 && (
                    <div className="absolute inset-0">
                      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                
                {/* Orbital rings */}
                <div className="absolute inset-0 border-2 border-green-300 rounded-full animate-spin opacity-30" style={{ animationDuration: '20s' }}></div>
                <div className="absolute inset-4 border border-blue-300 rounded-full animate-spin opacity-40" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
              </div>
              
              <p className="text-gray-600 text-lg">
                Your waste recycling is making Earth greener! 🌍
              </p>
            </div>

            {/* Carbon Reduction Animation */}
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <Zap className="h-8 w-8 text-yellow-500 mr-3" />
                Carbon Emissions Prevented
              </h3>
              
              <div className="relative">
                {/* Counter Display */}
                <div className="text-6xl font-bold text-green-600 mb-4">
                  {counterValue.toFixed(1)}
                </div>
                <div className="text-xl text-gray-600 mb-6">kg CO₂ equivalent</div>
                
                {/* Visual bars */}
                <div className="max-w-md mx-auto mb-6">
                  <div className="flex items-end justify-center space-x-2 h-32">
                    {[1, 2, 3, 4, 5].map((bar, index) => (
                      <div
                        key={bar}
                        className="bg-gradient-to-t from-red-500 to-orange-400 rounded-t-lg transition-all duration-1000 ease-out"
                        style={{
                          width: '40px',
                          height: `${Math.min((counterValue / carbonReduction) * 100, 100) * (0.6 + index * 0.1)}%`,
                          animationDelay: `${index * 200}ms`
                        }}
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-2">Emissions Reduction Visualization</div>
                </div>
                
                {/* Impact comparisons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold text-green-800">Equivalent to</div>
                    <div className="text-2xl font-bold text-green-600">{(counterValue / 4600).toFixed(1)}</div>
                    <div className="text-sm text-green-700">cars off road for 1 year</div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold text-blue-800">Same as planting</div>
                    <div className="text-2xl font-bold text-blue-600">{(counterValue / 22).toFixed(0)}</div>
                    <div className="text-sm text-blue-700">mature trees</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <Globe className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold text-purple-800">Household energy for</div>
                    <div className="text-2xl font-bold text-purple-600">{(counterValue / 16000).toFixed(1)}</div>
                    <div className="text-sm text-purple-700">years avoided</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h3>
              <p className="text-lg mb-6">
                Join AgriLoop today and turn your agricultural waste into environmental action!
              </p>
              <div className="space-x-4">
                <button 
                 onClick={() => navigate('/login')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Find Waste to Buy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImpactCalculator;