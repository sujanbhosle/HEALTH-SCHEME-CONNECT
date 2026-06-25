
import React, { useState, useEffect, useMemo } from 'react';
import { searchHospitals, getBedStatusForHospital } from '../services/apiService';
import type { Hospital, BedStatus } from '../types';
import HospitalCard from '../components/HospitalCard';
import { MOCK_SCHEMES } from '../data/mockData';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResultsPageProps {
  searchQuery: { city: string; scheme: string };
  onSelectHospital: (hospital: Hospital) => void;
}

export interface HospitalWithBedStatus extends Hospital {
  bedStatus?: BedStatus | null;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchQuery, onSelectHospital }) => {
  const [hospitals, setHospitals] = useState<HospitalWithBedStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('rating');
  const [filterNabh, setFilterNabh] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!searchQuery.city && !searchQuery.scheme) {
          setHospitals([]);
          setLoading(false);
          return;
      }
      try {
        setLoading(true);
        setError(null);
        const results = await searchHospitals(searchQuery.city, searchQuery.scheme);
        
        const hospitalsWithStatus = await Promise.all(results.map(async (hospital) => {
            const bedStatus = await getBedStatusForHospital(hospital.id);
            return { ...hospital, bedStatus };
        }));

        setHospitals(hospitalsWithStatus);
      } catch (err) {
        setError('Failed to fetch hospitals. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, [searchQuery]);

  const sortedAndFilteredHospitals = useMemo(() => {
    return [...hospitals]
      .filter(h => filterNabh ? h.is_nabh : true)
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'beds') {
          const totalA = a.bedStatus ? a.bedStatus.available_general + a.bedStatus.available_icu + a.bedStatus.available_maternity : 0;
          const totalB = b.bedStatus ? b.bedStatus.available_general + b.bedStatus.available_icu + b.bedStatus.available_maternity : 0;
          return totalB - totalA;
        }
        return 0;
      });
  }, [hospitals, sortBy, filterNabh]);

  const schemeName = MOCK_SCHEMES.find(s => s.code === searchQuery.scheme)?.name || searchQuery.scheme;
  const hasSearchQuery = searchQuery.city || searchQuery.scheme;

  return (
    <div className="space-y-8 pb-12">
       {hasSearchQuery && (
        <div className="bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-800/60 p-10 rounded-[2.5rem] shadow-sm border border-gray-200 dark:border-gray-700 relative overflow-hidden">
            <div className="relative z-10">
                <h1 className="text-3xl font-extrabold text-text-primary font-heading tracking-tight">{t('searchResultsTitle')}</h1>
                <p className="text-text-secondary mt-3 text-lg font-medium">
                {t('searchResultsShowing')} <span className="font-bold text-primary-blue bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-xl shadow-sm">{searchQuery.city}</span> {t('searchResultsAccepting')} <span className="font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-xl shadow-sm">{schemeName}</span>
                </p>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        </div>
       )}
      
      {!loading && !error && hospitals.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-24 z-30 bg-bg-primary/95 dark:bg-bg-primary/95 backdrop-blur-md py-5 px-1 transition-all border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative group">
                    <select 
                        id="sort" 
                        value={sortBy} 
                        onChange={e => setSortBy(e.target.value)} 
                        className="appearance-none pl-4 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-primary-blue/10 focus:border-primary-blue bg-white dark:bg-gray-800 text-text-primary shadow-sm cursor-pointer text-sm font-bold transition-all hover:border-gray-300 dark:hover:border-gray-600"
                    >
                        <option value="rating" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t('sortBestRating')}</option>
                        <option value="beds" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{t('sortMostBeds')}</option>
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
                </div>

                <div 
                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl border-2 cursor-pointer transition-all duration-300 select-none ${filterNabh ? 'bg-blue-50 border-primary-blue dark:bg-blue-900/40 dark:border-blue-500 shadow-blue-500/10 shadow-lg' : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 hover:border-gray-300'}`}
                    onClick={() => setFilterNabh(!filterNabh)}
                >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filterNabh ? 'bg-primary-blue border-primary-blue text-white scale-110' : 'border-gray-300 dark:border-gray-600 bg-transparent'}`}>
                        {filterNabh && <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                    </div>
                    <span className={`font-bold text-sm tracking-tight ${filterNabh ? 'text-primary-blue' : 'text-text-secondary'}`}>{t('nabhOnly')}</span>
                </div>
            </div>
            
            <span className="text-sm text-text-muted font-bold tracking-widest uppercase">{sortedAndFilteredHospitals.length} {t('hospitals').toUpperCase()} FOUND</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-24">
          <div className="relative w-24 h-24 mx-auto mb-10">
             <div className="absolute inset-0 border-8 border-gray-100 dark:border-gray-800 rounded-full"></div>
             <div className="absolute inset-0 border-8 border-primary-blue rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl font-bold text-text-secondary animate-pulse tracking-tight">{t('findingHospitals')}</p>
        </div>
      )}
      
      {error && (
        <div className="text-center text-error bg-red-50 dark:bg-red-900/30 p-10 rounded-[2.5rem] border border-red-100 dark:border-red-900/50 max-w-lg mx-auto shadow-xl">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-inner">⚠️</div>
          <p className="font-bold text-xl mb-4 text-red-600 dark:text-red-400">{error}</p>
          <button className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      
      {!loading && !error && (
        sortedAndFilteredHospitals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedAndFilteredHospitals.map(hospital => (
              <HospitalCard 
                key={hospital.id} 
                hospital={hospital} 
                onSelect={() => onSelectHospital(hospital)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border border-gray-200 dark:border-gray-700 animate-in zoom-in duration-300">
            <div className="bg-gray-50 dark:bg-gray-900 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8 text-6xl shadow-inner grayscale opacity-50">🏥</div>
            <h3 className="text-3xl font-extrabold text-text-primary mb-4 tracking-tight">{t('noHospitalsFound')}</h3>
            <p className="text-text-muted max-w-md mx-auto text-lg font-medium leading-relaxed mb-10 px-6">{t('noHospitalsFoundSub')}</p>
            <button className="px-10 py-4 bg-primary-blue text-white font-extrabold rounded-2xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 active:scale-95" onClick={() => window.history.back()}>
                Reset Search
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default SearchResultsPage;
