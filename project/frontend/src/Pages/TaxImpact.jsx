import React, { useState, useMemo } from 'react';
import { Calculator, DollarSign, Building, Car, Book, Shield, Droplets, Users, Heart, Recycle } from 'lucide-react';

const TaxImpact = () => {
  const [income, setIncome] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [municipality, setMunicipality] = useState('medium');

  const municipalityData = {
    small: {
      name: 'Small Town',
      incomeTaxRate: 0.015,
      propertyTaxRate: 0.012,
      services: {
        'Public Safety': 0.35,
        'Education': 0.25,
        'Infrastructure': 0.20,
        'Parks & Recreation': 0.08,
        'Health Services': 0.05,
        'Administration': 0.04,
        'Waste Management': 0.03
      }
    },
    medium: {
      name: 'Medium City',
      incomeTaxRate: 0.02,
      propertyTaxRate: 0.015,
      services: {
        'Education': 0.30,
        'Public Safety': 0.25,
        'Infrastructure': 0.18,
        'Health Services': 0.10,
        'Parks & Recreation': 0.08,
        'Transportation': 0.05,
        'Administration': 0.04
      }
    },
    large: {
      name: 'Large City',
      incomeTaxRate: 0.025,
      propertyTaxRate: 0.018,
      services: {
        'Education': 0.28,
        'Public Safety': 0.22,
        'Transportation': 0.15,
        'Infrastructure': 0.12,
        'Health Services': 0.12,
        'Parks & Recreation': 0.06,
        'Administration': 0.05
      }
    }
  };

  const serviceIcons = {
    'Public Safety': Shield,
    'Education': Book,
    'Infrastructure': Building,
    'Parks & Recreation': Users,
    'Health Services': Heart,
    'Transportation': Car,
    'Administration': DollarSign,
    'Waste Management': Recycle
  };

  const calculations = useMemo(() => {
    const annualIncome = parseFloat(income) || 0;
    const propValue = parseFloat(propertyValue) || 0;
    const data = municipalityData[municipality];
    const incomeTax = annualIncome * data.incomeTaxRate;
    const propertyTax = propValue * data.propertyTaxRate;
    const totalTax = incomeTax + propertyTax;
    const serviceBreakdown = Object.entries(data.services).map(([service, percentage]) => ({
      service,
      amount: totalTax * percentage,
      percentage: percentage * 100,
      icon: serviceIcons[service] || Building
    })).sort((a, b) => b.amount - a.amount);
    return { incomeTax, propertyTax, totalTax, serviceBreakdown, municipality: data.name };
  }, [income, propertyValue, municipality]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 dark:from-gray-950 dark:via-green-950/40 dark:to-green-900/30 py-10 px-3">
      <div className="max-w-6xl mx-auto">
        {/* Title and Hero */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-5 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-green-500 dark:to-emerald-700 p-5 rounded-2xl shadow-xl">
              <Calculator className="text-white w-11 h-11" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-800 via-green-700 to-green-900 dark:from-green-300 dark:via-emerald-300 dark:to-green-100 bg-clip-text text-transparent tracking-tighter">
              saafsafai Tax Impact Calculator
            </h1>
          </div>
          <p className="text-emerald-700 dark:text-green-200 text-xl md:text-2xl max-w-3xl mx-auto font-medium">
            Discover how your tax contributions power your community – and build a better future for all.
          </p>
        </div>
        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-9">
          {/* Inputs + summary */}
          <div className="bg-white/80 dark:bg-emerald-950/90 rounded-3xl p-10 shadow-2xl border border-emerald-100/70 dark:border-emerald-800/60 backdrop-blur">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl p-6 mb-8 shadow-md">
              <h2 className="text-2xl font-bold text-white mb-1">Tax Info</h2>
              <p className="text-emerald-100 dark:text-emerald-200">Enter your household details for a custom impact breakdown:</p>
            </div>
            <div className="space-y-9">
              <div>
                <label className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2">Annual Household Income</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-extrabold">₹</span>
                  <input
                    type="number"
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    placeholder="e.g., 800000"
                    className="w-full p-5 pl-12 bg-white/90 dark:bg-emerald-900 border-2 border-emerald-100 dark:border-emerald-800/40 rounded-2xl focus:border-emerald-400 dark:focus:border-emerald-500 text-lg dark:text-white shadow-sm focus:ring-emerald-300 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2">Property Value</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500 font-extrabold">₹</span>
                  <input
                    type="number"
                    value={propertyValue}
                    onChange={e => setPropertyValue(e.target.value)}
                    placeholder="e.g., 5000000"
                    className="w-full p-5 pl-12 bg-white/90 dark:bg-emerald-900 border-2 border-emerald-100 dark:border-emerald-800/40 rounded-2xl focus:border-emerald-400 dark:focus:border-emerald-600 text-lg dark:text-white shadow-sm focus:ring-emerald-300 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-800 dark:text-emerald-200 mb-2">Municipality Type</label>
                <select
                  value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  className="w-full p-5 bg-white/90 dark:bg-emerald-900 border-2 border-emerald-100 dark:border-emerald-800/40 rounded-2xl focus:border-emerald-400 dark:focus:border-emerald-600 text-lg dark:text-white shadow-sm focus:ring-emerald-300 transition"
                >
                  <option value="small">Small Town (&lt;50k population)</option>
                  <option value="medium">Medium City (50k-200k)</option>
                  <option value="large">Large City (&gt;200k)</option>
                </select>
              </div>
            </div>
            <div className="mt-10 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-green-700 dark:to-emerald-700 rounded-2xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-5">Your Annual Tax Contribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-lg border-b border-white/30 pb-2">
                  <span>Local Income Tax</span>
                  <span className="font-bold text-xl">{formatCurrency(calculations.incomeTax)}</span>
                </div>
                <div className="flex justify-between items-center text-lg border-b border-white/30 pb-2">
                  <span>Property Tax</span>
                  <span className="font-bold text-xl">{formatCurrency(calculations.propertyTax)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-semibold mt-4 pt-3 border-t border-white/40">
                  <span>Total</span>
                  <span className="font-bold text-3xl">{formatCurrency(calculations.totalTax)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Service breakdown impact bars */}
          <div className="bg-white/80 dark:bg-emerald-950/85 backdrop-blur rounded-3xl shadow-2xl border border-emerald-100/70 dark:border-emerald-800/60 p-10">
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 dark:from-emerald-700 dark:to-green-700 rounded-2xl p-6 mb-8 shadow-md">
              <h2 className="text-2xl font-bold text-white mb-2">How Your Taxes Fund Local Services</h2>
              <p className="text-emerald-100 dark:text-emerald-200 text-base">
                Based on <span className="font-bold">{calculations.municipality}</span> allocation
              </p>
            </div>
            <div className="space-y-7">
              {calculations.serviceBreakdown.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <div key={service.service} className="group bg-gradient-to-r from-white to-emerald-50/50 dark:from-emerald-900 dark:to-green-900/30 rounded-2xl p-6 border-2 border-emerald-100/50 dark:border-emerald-700 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-lg transition duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 dark:from-emerald-500 dark:to-green-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <span className="font-bold text-emerald-900 dark:text-emerald-100 text-xl">{service.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-900 dark:text-white font-bold text-xl">{formatCurrency(service.amount)}</div>
                        <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 px-3 py-1 font-medium text-sm rounded-full mt-1 inline-block shadow">{service.percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    {/* Bar */}
                    <div className="h-4 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full shadow-inner relative">
                      <div
                        className="absolute left-0 top-0 h-4 rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-700 dark:from-emerald-500 dark:to-emerald-700 transition-all"
                        style={{ width: `${service.percentage}%`, minWidth: '3%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            {calculations.totalTax > 0 && (
              <div className="mt-12 bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 dark:from-emerald-700 dark:via-green-800 dark:to-green-900 rounded-2xl p-8 text-white shadow-xl flex items-center gap-6">
                <div className="w-12 h-12 bg-white/20 dark:bg-white/30 rounded-full flex items-center justify-center">
                  <Heart className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Your Community Impact</h3>
                  <p className="text-lg text-emerald-50 dark:text-emerald-100 leading-relaxed">
                    Your {formatCurrency(calculations.totalTax)} in local taxes sustains vital services — safety, health, education, and more — shaping a vibrant, future-ready India.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-green-600 dark:to-emerald-700 rounded-full shadow-xl border border-emerald-400/30 dark:border-emerald-500/60">
            <div className="w-6 h-6 bg-white/20 dark:bg-white/30 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-lg">Powered by saafsafai – Understanding Your Community</span>
          </div>
          <div className="mt-8 max-w-4xl mx-auto bg-white/60 dark:bg-emerald-950/60 backdrop-blur rounded-2xl p-6 border border-emerald-100/70 dark:border-emerald-700/60">
            <p className="text-emerald-800 dark:text-emerald-200 text-base">
              Tax rates and allocations are for illustration; actual values vary by location. Verify with your local office for real rates and guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxImpact;
