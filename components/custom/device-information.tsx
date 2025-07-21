'use client';

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { get } from '@/lib/api';
import type { DeviceInformationProps } from '@/lib/types';
import { Loader } from './custom-loader';

const LABELS: Record<keyof DeviceInformationProps, string> = {
  ipAddress: 'IP Address',
  device: 'Device',
  browser: 'Browser',
  userAgent: 'User Agent',
  platform: 'Platform',
  language: 'Language',
  cookiesEnabled: 'Cookies Enabled',
  javascriptEnabled: 'JavaScript Enabled',
  touchSupport: 'Touch Support',
  deviceType: 'Device Type',
  cpuCores: 'CPU Cores',
  memory: 'Memory',
  screenSize: 'Screen Size',
  batteryLevel: 'Battery Level',
  isCharging: 'Is Charging',
  gpuRenderer: 'GPU Renderer',
  cameras: 'Cameras',
  microphones: 'Microphones',
  publicIp: 'Public IP',
  isp: 'ISP',
  asn: 'ASN',
  possibleIoT: 'Possible IoT',
};

interface PropsUtil{
  data: DeviceInformationProps | undefined;
  loading: boolean;
}

export const DeviceInformation: React.FC<PropsUtil> = ({data, loading}) => {

 if(loading || !data){
    return (
      <Card>
    <Loader />
      </Card>
    )
  }

  const renderField = (label: string, value: any) => (
    <div key={label} className="flex items-center justify-between">
      <h3 className="font-semibold text-white">{label}:</h3>
      <p className="text-gray-300">{value !== null && value !== undefined ? String(value) : 'N/A'}</p>
    </div>
  );

  return (
    <Card className="card-bg border-slate-700 row-span-2 text-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-emerald-500">
          <MapPin className="h-5 w-5 text-emerald-500" />
          Location Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {data &&
            Object.entries(data).map(([key, value]) => {
              const label = LABELS[key as keyof DeviceInformationProps] || null;
              if(!label){
                return null;
              }
              return renderField(label, value);
            }).filter(item => item !== null)}
        </div>
      </CardContent>
    </Card>
  );
};
