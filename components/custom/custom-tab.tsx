'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';

interface TabItem {
  value: string;
  label: string;
  component: React.ReactNode;
}

interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

const CustomTabs: React.FC<CustomTabsProps> = ({ tabs, defaultValue }) => {
  const initialTab = defaultValue ?? tabs[0]?.value ?? '';
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid h-auto w-full grid-cols-2 rounded-lg border border-slate-800 bg-slate-900 p-1 text-white sm:w-auto sm:grid-cols-7 md:grid-cols-8">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="rounded-md data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-500"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
