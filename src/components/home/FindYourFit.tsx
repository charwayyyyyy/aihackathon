'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/api';
import ProductCard from '../products/ProductCard';
import { Product } from '@/types';

type QuestionStep = 'occasion' | 'fit' | 'style' | 'results';

export default function FindYourFit() {
  const [step, setStep] = useState<QuestionStep>('occasion');
  const [answers, setAnswers] = useState({ occasion: '', fit: '', style: '' });
  const [isCurating, setIsCurating] = useState(false);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts(),
  });

  const handleAnswer = (key: keyof typeof answers, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (key === 'occasion') setStep('fit');
    if (key === 'fit') setStep('style');
    if (key === 'style') {
      setStep('results');
      setIsCurating(true);
      setTimeout(() => setIsCurating(false), 2000); // Artificial luxury loading
    }
  };

  const getFilteredProducts = (): Product[] => {
    if (!products || products.length === 0) return [];
    return products.slice(0, 3); // Return top matches from API
  };

  return (
    <section className="py-32 bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <span className="text-luxury uppercase tracking-[0.3em] text-xs mb-8 block font-bold">
          Signature Experience
        </span>
        <h2 className="text-4xl md:text-5xl font-serif mb-16">Find Your Fit</h2>

        <div className="min-h-[400px] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {step === 'occasion' && (
              <QuestionBlock
                key="occasion"
                question="What is the occasion?"
                options={['Traditional Wedding', 'Business', 'Cultural Event']}
                onSelect={(val) => handleAnswer('occasion', val)}
              />
            )}
            {step === 'fit' && (
              <QuestionBlock
                key="fit"
                question="How do you prefer your fit?"
                options={['Tailored Slim', 'Traditional Loose']}
                onSelect={(val) => handleAnswer('fit', val)}
              />
            )}
            {step === 'style' && (
              <QuestionBlock
                key="style"
                question="Choose your style."
                options={['Bold', 'Minimal']}
                onSelect={(val) => handleAnswer('style', val)}
              />
            )}
            {step === 'results' && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                {isCurating ? (
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-12 h-12 border-t-2 border-luxury rounded-full animate-spin" />
                    <p className="uppercase tracking-widest text-sm text-white/70">
                      Curating your selection...
                    </p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-3xl font-serif mb-12">Curated for You</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-black">
                      {getFilteredProducts().map((product) => (
                        <div key={product.id} className="bg-white">
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setStep('occasion');
                        setAnswers({ occasion: '', fit: '', style: '' });
                      }}
                      className="mt-12 text-xs uppercase tracking-widest text-white/50 hover:text-luxury transition-colors border-b border-transparent hover:border-luxury"
                    >
                      Start Over
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function QuestionBlock({ question, options, onSelect }: { question: string, options: string[], onSelect: (val: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <h3 className="text-2xl md:text-3xl font-serif mb-12">{question}</h3>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="w-full sm:w-auto px-12 py-4 border border-white/20 text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs transition-all duration-300"
          >
            {opt}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
