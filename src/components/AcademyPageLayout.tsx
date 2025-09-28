"use client";

import { ReactNode } from 'react';
import { AcademySubmenuProvider, useAcademySubmenu } from './AcademySubmenuProvider';
import { AcademyFiltersProvider } from './AcademyFiltersProvider';
import AcademySubmenu from './AcademySubmenu';
import { FiChevronRight } from 'react-icons/fi';

interface AcademyPageLayoutProps {
  children: ReactNode;
}

function AcademyPageLayoutInner({ children }: AcademyPageLayoutProps) {
  const { isOpen, open, close } = useAcademySubmenu();

  return (
    <div className="relative">
      {/* Academy Submenu */}
      {isOpen && (
        <AcademySubmenu
          isOpen={isOpen}
          onClose={close}
        />
      )}

      {/* Desktop Expand Button - positioned at same level as sidebar Home button */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-lg transition-colors xl:block hidden z-[55]"
          style={{
            left: '6rem', // Position it to the right of the sidebar (80px = 5rem, so 6rem puts it just outside)
            top: 'calc(var(--nav-height, 64px) + 1rem)' // Same as sidebar padding + small offset for alignment
          }}
          title="Open Academy Menu"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Academy Button - Bottom Navigation */}
      <div className="xl:hidden fixed bottom-20 left-4 z-40">
        <button
          onClick={open}
          className={`bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            isOpen ? 'opacity-50' : ''
          }`}
          title="Open Academy Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isOpen ? 'xl:ml-[380px]' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default function AcademyPageLayout({ children }: AcademyPageLayoutProps) {
  return (
    <AcademySubmenuProvider>
      <AcademyFiltersProvider>
        <AcademyPageLayoutInner>
          {children}
        </AcademyPageLayoutInner>
      </AcademyFiltersProvider>
    </AcademySubmenuProvider>
  );
}
