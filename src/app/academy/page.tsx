import React from 'react';
import AcademyClient from '../../components/AcademyClient';
import AcademyPageLayout from '../../components/AcademyPageLayout';
import SanityErrorBoundary from '../../components/SanityErrorBoundary';

export default function AcademyPage() {
  return (
    <SanityErrorBoundary>
      <AcademyPageLayout>
        <AcademyClient />
      </AcademyPageLayout>
    </SanityErrorBoundary>
  );
} 