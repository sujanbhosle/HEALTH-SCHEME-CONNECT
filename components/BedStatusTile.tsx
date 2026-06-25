
import React from 'react';
import type { BedStatus } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BedStatusTileProps {
  status: BedStatus;
}

const BedItem: React.FC<{ label: string; count: number; icon: string }> = ({ label, count, icon }) => {
  const { t } = useLanguage();
  const statusClass = count > 10 ? 'high' : count > 0 ? 'medium' : 'critical';
  
  const statusStyles = {
    high: { color: 'var(--color-success)', border: 'rgba(16, 185, 129, 0.2)', darkBorder: 'rgba(16, 185, 129, 0.4)' },
    medium: { color: 'var(--color-warning)', border: 'rgba(245, 158, 11, 0.2)', darkBorder: 'rgba(245, 158, 11, 0.4)' },
    critical: { color: 'var(--color-error)', border: 'rgba(239, 68, 68, 0.2)', darkBorder: 'rgba(239, 68, 68, 0.4)' },
  };

  const statusText = {
      high: t('available'),
      medium: t('limited'),
      critical: t('full'),
  }

  return (
    <div 
      className="bed-item bg-bg-secondary dark:bg-gray-800 rounded-lg p-4 text-center relative border-2"
      style={{ borderColor: statusStyles[statusClass].border }}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: statusStyles[statusClass].color }}></div>
      <div className="bed-item__icon text-3xl mb-1">{icon}</div>
      <div className="bed-item__label text-sm text-text-secondary font-medium">{label}</div>
      <div className="bed-item__count text-4xl font-extrabold" style={{ color: statusStyles[statusClass].color }}>{count}</div>
      <div className="bed-item__status text-xs font-semibold uppercase tracking-wider" style={{ color: statusStyles[statusClass].color }}>
        {statusText[statusClass]}
      </div>
    </div>
  );
};


const BedStatusTile: React.FC<BedStatusTileProps> = ({ status }) => {
  const { t } = useLanguage();
  const lastUpdated = new Date(status.last_updated);
  const timeSinceUpdate = Math.round((new Date().getTime() - lastUpdated.getTime()) / (1000 * 60));

  return (
    <div className="bg-bg-secondary p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="bed-status__header flex justify-between items-center mb-4">
        <h4 className="text-xl font-bold font-heading text-text-primary">{t('liveBedAvailability')}</h4>
        <span className="timestamp text-xs text-text-muted">{t('updatedAgo', timeSinceUpdate)}</span>
      </div>
      
      <div className="bed-grid grid grid-cols-2 md:grid-cols-3 gap-4">
        <BedItem label={t('general')} count={status.available_general} icon="🏥" />
        <BedItem label={t('icu')} count={status.available_icu} icon="🚨" />
        <BedItem label={t('maternity')} count={status.available_maternity} icon="👶" />
      </div>
      
      <button 
        onClick={() => alert('Notification feature is coming soon!')}
        className="w-full mt-4 text-sm bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
        {t('notifyMe')}
      </button>
    </div>
  );
};

export default BedStatusTile;
