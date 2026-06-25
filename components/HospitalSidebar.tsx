
import React from 'react';
import type { Hospital } from '../types';
import { LocationPinIcon, PhoneIcon, MailIcon, CertificateIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface HospitalSidebarProps {
  hospital: Hospital;
}

const HospitalSidebar: React.FC<HospitalSidebarProps> = ({ hospital }) => {
  const { t } = useLanguage();
  const lon = hospital.longitude;
  const lat = hospital.latitude;
  // A small bounding box around the hospital coordinates to control the zoom level
  const bbox = `${lon - 0.005},${lat - 0.005},${lon + 0.005},${lat + 0.005}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;


  return (
    <aside className="sticky top-24 space-y-6">
      <div className="bg-bg-secondary rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <iframe
          src={mapUrl}
          width="100%"
          height="250"
          className="border-0 dark:filter dark:invert-[1] dark:hue-rotate-[180deg]"
          loading="lazy"
          title={`Map showing location of ${hospital.name}`}
        ></iframe>
        <div className="p-6">
          <h3 className="font-bold text-lg mb-4 font-heading text-text-primary">{t('hospitalInformation')}</h3>
          <ul className="space-y-3 text-text-secondary text-sm">
            <li className="flex items-start">
              <LocationPinIcon className="w-5 h-5 mr-3 mt-0.5 text-primary-blue flex-shrink-0" />
              <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
            </li>
            <li className="flex items-center">
              <PhoneIcon className="w-5 h-5 mr-3 text-primary-blue" />
              <a href={`tel:${hospital.contact_number}`} className="hover:underline">{hospital.contact_number}</a>
            </li>
            <li className="flex items-center">
              <MailIcon className="w-5 h-5 mr-3 text-primary-blue" />
              <a href={`mailto:${hospital.email}`} className="hover:underline truncate">{hospital.email}</a>
            </li>
            {hospital.is_nabh && (
              <li className="flex items-center">
                <CertificateIcon className="w-5 h-5 mr-3 text-primary-green" />
                <span className="font-semibold text-primary-green">{t('nabhAccredited')}</span>
              </li>
            )}
          </ul>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full inline-block text-center bg-primary-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            {t('getDirections')}
          </a>
        </div>
      </div>
    </aside>
  );
};

export default HospitalSidebar;
