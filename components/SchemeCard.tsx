
import React, { useState } from 'react';
import type { Scheme, Hospital } from '../types';
import { getHospitalsForScheme } from '../services/apiService';
import { ExternalLinkIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface SchemeCardProps {
  scheme: Scheme;
  city: string;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, city }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { language, t } = useLanguage();

  const toggleExpand = async () => {
    const shouldExpand = !isExpanded;
    setIsExpanded(shouldExpand);

    if (shouldExpand && hospitals.length === 0) {
      setIsLoading(true);
      try {
        const data = await getHospitalsForScheme(scheme.id, city);
        setHospitals(data);
      } catch (error) {
        console.error("Failed to fetch hospitals for scheme:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const eligibilityText = (() => {
    if (scheme.eligibility_criteria?.bpl_families || scheme.eligibility_criteria?.white_card_holders) {
      return 'BPL / White Card Holders';
    }
    if (scheme.code === 'PMJAY') {
      return 'Based on SECC 2011 data';
    }
    if (scheme.state && scheme.government_level === 'State') {
      return `For residents of ${scheme.state}`;
    }
    return 'Varies, check official website';
  })();
  
  const schemeName = scheme.name_local?.[language] || scheme.name;
  const schemeDescription = scheme.description_local?.[language] || scheme.description;

  return (
    <div className="bg-bg-secondary rounded-[2rem] shadow-lg p-8 border-2 border-transparent hover:border-primary-blue/20 dark:hover:border-primary-blue/30 dark:border-gray-700 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex-grow">
        <div className="flex items-start justify-between mb-2">
            <h2 className="text-2xl font-extrabold text-primary-blue dark:text-blue-400 font-heading tracking-tight leading-tight">{schemeName}</h2>
            <span className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/50 text-primary-blue dark:text-blue-300 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800 shrink-0 ml-4">
                {scheme.code}
            </span>
        </div>
        <p className="text-text-secondary text-base mb-6 font-medium leading-relaxed opacity-90">{schemeDescription}</p>
      </div>
      <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-1 mb-6">
            <p className="text-sm font-bold text-text-muted uppercase tracking-widest">{t('coverageLimit')}</p>
            <p className="text-3xl font-black text-primary-green dark:text-green-400">₹{scheme.coverage_limit > 0 ? scheme.coverage_limit.toLocaleString('en-IN') : 'Varies'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
            <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">{t('eligibility')}</p>
            <p className="text-sm font-bold text-text-primary">{eligibilityText}</p>
        </div>
      </div>
      <div className="mt-auto grid grid-cols-1 gap-3">
        <button 
          onClick={toggleExpand}
          className={`w-full text-base font-extrabold py-4 px-6 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-sm active:scale-95 ${isExpanded ? 'bg-primary-blue text-white shadow-blue-500/20' : 'bg-blue-50 dark:bg-blue-900/40 text-primary-blue dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-100 dark:border-blue-800'}`}
        >
          {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
          ) : null}
          {isLoading ? t('loading') : `${isExpanded ? t('hideHospitals') : t('showHospitals')}`}
          {!isLoading && (
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        {scheme.official_website && (
            <a 
                href={scheme.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-base bg-gray-100 dark:bg-gray-800 text-text-primary font-extrabold py-4 px-6 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex justify-center items-center gap-3 border border-gray-200 dark:border-gray-700"
            >
                {t('officialSite')}
                <ExternalLinkIcon className="h-5 w-5" />
            </a>
        )}
      </div>
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-4 duration-300">
          <p className="text-[10px] font-black text-text-muted mb-4 uppercase tracking-widest">Empanelled in {city}</p>
          {isLoading ? (
            <div className="space-y-3">
                <div className="h-10 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl"></div>
                <div className="h-10 bg-gray-100 dark:bg-gray-900 animate-pulse rounded-xl opacity-50"></div>
            </div>
          ) : hospitals.length > 0 ? (
            <ul className="space-y-2.5">
              {hospitals.map(h => (
                <li key={h.id} className="p-3.5 bg-gray-50 dark:bg-gray-900/40 rounded-xl text-sm font-bold text-text-primary border border-gray-100 dark:border-gray-800 hover:border-primary-blue/30 transition-colors">
                    {h.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-center border border-amber-100 dark:border-amber-900/50">
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{t('noEmpanelledHospitals', city)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemeCard;
