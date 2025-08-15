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

      {/* Expand Button - positioned at same level as sidebar Home button */}
      {!isOpen && (
        <button
          onClick={open}
          className="fixed bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md shadow-lg transition-colors xl:block hidden z-10"
          style={{ 
            left: '6rem', // Position it to the right of the sidebar (80px = 5rem, so 6rem puts it just outside)
            top: 'calc(var(--nav-height, 64px) + 1rem + 0.25rem)' // Same as sidebar padding + small offset for alignment
          }}
          title="Open Academy Menu"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>
      )}

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
