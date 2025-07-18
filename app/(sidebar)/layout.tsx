import Sidebar from '@/components/custom/sidebar';
import React from 'react';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pt-20 px-10 spacy-y-4 md:space-y-8">{children}</div>
    </>
  );
}