import React from 'react';
import { useI18n } from '../i18n/I18nProvider';

const UnderConstruction = () => {
  const { t } = useI18n();
  return (
    <div style={{ textAlign: 'center', marginTop: 100 }}>
      <h1>{t('withdraw.underConstructionTitle')}</h1>
      <p>{t('withdraw.underConstructionText')}</p>
    </div>
  );
};

export default UnderConstruction;
