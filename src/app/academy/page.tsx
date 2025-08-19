import React from 'react';
import AcademyClientEnterprise from '../../components/AcademyClientEnterprise';
import AcademyPageLayout from '../../components/AcademyPageLayout';
import SanityErrorBoundary from '../../components/SanityErrorBoundary';

export default function AcademyPage() {
  return (
    <SanityErrorBoundary>
      <AcademyPageLayout>
        <AcademyClientEnterprise />
      </AcademyPageLayout>
    </SanityErrorBoundary>
  );
} 