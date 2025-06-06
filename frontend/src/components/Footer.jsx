import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('exam.title')}
            </h3>
            <p className="text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h3>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('common.dashboard')}
              </a>
              <a href="/training" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('common.training')}
              </a>
              <a href="/exam" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('common.exam')}
              </a>
              <a href="/questions" className="block text-gray-400 hover:text-white text-sm transition-colors">
                {t('common.questions')}
              </a>
            </div>
          </div>

          {/* Language Selector and Contact */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-white mb-4">
              {t('language.selectLanguage')}
            </h3>
            <div className="flex justify-center md:justify-end mb-4">
              <LanguageSelector />
            </div>
            <div className="text-gray-400 text-sm space-y-1">
              <p>{t('footer.contact')}: serejekee@inbox.ru</p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Driving License Exam System. {t('footer.allRightsReserved')}.
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</a>
              <a href="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</a>
              <a href="/help" className="hover:text-white transition-colors">{t('footer.helpCenter')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
