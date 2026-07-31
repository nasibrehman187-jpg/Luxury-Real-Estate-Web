'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { formatCurrency } from '@/i18n/formatters';
import { trackEvent, TRACKING_EVENTS } from '@/lib/analytics';
import { Calculator, TrendingUp, Sparkles } from 'lucide-react';

export default function InvestmentIntelligence({ locale }: { locale: string }) {
  const t = useTranslations('Investment');
  const isAr = locale === 'ar';

  const [propertyPrice, setPropertyPrice] = useState<number>(15000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(4.5);

  // Mortgage & ROI Math
  const downPaymentAmount = propertyPrice * (downPaymentPercent / 100);
  const loanPrincipal = propertyPrice - downPaymentAmount;
  const monthlyRate = interestRatePercent / 100 / 12;
  const totalMonths = loanTenureYears * 12;

  const monthlyPayment =
    monthlyRate > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : loanPrincipal / totalMonths;

  const annualEstimatedRentalYield = propertyPrice * 0.075; // 7.5% annual yield
  const fiveYearProjectedValue = propertyPrice * 1.42; // 42% 5-year growth

  // Chart Data
  const chartData = [
    { year: 'Year 1', value: propertyPrice * 1.07 },
    { year: 'Year 2', value: propertyPrice * 1.15 },
    { year: 'Year 3', value: propertyPrice * 1.24 },
    { year: 'Year 4', value: propertyPrice * 1.33 },
    { year: 'Year 5', value: fiveYearProjectedValue },
  ];

  const handleInputChange = (setter: any, val: number) => {
    setter(val);
    trackEvent(TRACKING_EVENTS.ROI_CALCULATOR_USE, { propertyPrice, downPaymentPercent });
  };

  return (
    <section id="investment" className="py-28 bg-neoma-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neoma-gold/30 text-neoma-gold text-xs font-mono tracking-widest uppercase mb-4">
            <Calculator className="w-3.5 h-3.5" />
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-playfair font-bold text-neoma-ivory mb-6">
            {t('title')}
          </h2>
          <p className="text-neoma-gray-300 text-base leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Panel */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-playfair font-bold text-neoma-ivory mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neoma-gold" />
              {isAr ? 'مدخلات التمويل والاستثمار' : 'Investment Inputs'}
            </h3>

            {/* Property Price Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-neoma-gray-300">{t('propertyPrice')}</span>
                <span className="text-neoma-gold font-bold">
                  {formatCurrency(propertyPrice, locale)}
                </span>
              </div>
              <input
                type="range"
                min="5000000"
                max="80000000"
                step="1000000"
                value={propertyPrice}
                onChange={(e) => handleInputChange(setPropertyPrice, Number(e.target.value))}
                className="w-full accent-neoma-gold bg-neoma-surface h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Down Payment Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-neoma-gray-300">{t('downPayment')}</span>
                <span className="text-neoma-gold font-bold">
                  {downPaymentPercent}% ({formatCurrency(downPaymentAmount, locale)})
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                step="5"
                value={downPaymentPercent}
                onChange={(e) => handleInputChange(setDownPaymentPercent, Number(e.target.value))}
                className="w-full accent-neoma-gold bg-neoma-surface h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Loan Tenure Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-neoma-gray-300">{t('loanTenure')}</span>
                <span className="text-neoma-gold font-bold">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={loanTenureYears}
                onChange={(e) => handleInputChange(setLoanTenureYears, Number(e.target.value))}
                className="w-full accent-neoma-gold bg-neoma-surface h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Profit Rate Slider */}
            <div>
              <div className="flex justify-between text-sm mb-2 font-mono">
                <span className="text-neoma-gray-300">{t('interestRate')}</span>
                <span className="text-neoma-gold font-bold">{interestRatePercent}%</span>
              </div>
              <input
                type="range"
                min="2.5"
                max="8.0"
                step="0.25"
                value={interestRatePercent}
                onChange={(e) => handleInputChange(setInterestRatePercent, Number(e.target.value))}
                className="w-full accent-neoma-gold bg-neoma-surface h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Results & Chart Output */}
          <div className="lg:col-span-6 glass-panel p-8 rounded-3xl flex flex-col justify-between space-y-6 border-neoma-gold/30">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-neoma-surface border border-neoma-gold/20">
                <span className="text-xs font-mono text-neoma-gray-400 block mb-1">
                  {t('monthlyPayment')}
                </span>
                <span className="text-xl font-bold text-neoma-gold block">
                  {formatCurrency(monthlyPayment, locale)}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-neoma-surface border border-neoma-emerald/30">
                <span className="text-xs font-mono text-neoma-gray-400 block mb-1">
                  {t('expectedYield')}
                </span>
                <span className="text-xl font-bold text-neoma-emerald block">
                  {formatCurrency(annualEstimatedRentalYield, locale)}
                </span>
              </div>
            </div>

            {/* Projected Capital Growth Chart */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-neoma-gray-300 block">
                {t('projectedRoi')} (5-Year Forecast)
              </span>
              <div className="h-56 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="year" stroke="#737373" fontSize={11} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121212',
                        borderColor: '#D4AF37',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#F5F5F0',
                      }}
                      formatter={(val: any) => [formatCurrency(Number(val), locale), 'Projected Value']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#D4AF37"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#goldGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
