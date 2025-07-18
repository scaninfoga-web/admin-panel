'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CustomTable } from '@/components/custom/custom-table';
import Pagination from '@/components/custom/pagination';
import { Card } from '../ui/card';

interface UserSession {
  ipAddress: string | null;
  device: string | null;
  browser: string | null;
  latitude: string | null;
  longitude: string | null;
  userAgent: string | null;
  platform: string | null;
  language: string | null;
  cookiesEnabled: boolean;
  javascriptEnabled: boolean;
  touchSupport: boolean | null;
  deviceType: string | null;
  cpuCores: number | null;
  memory: string | null;
  screenSize: string | null;
  batteryLevel: string | null;
  isCharging: boolean | null;
  gpuRenderer: string | null;
  cameras: string | null;
  microphones: string | null;
  publicIp: string | null;
  isp: string | null;
  asn: string | null;
  city: string | null;
  country: string | null;
  possibleIoT: boolean | null;
  created_at: string;
}

interface Props {
  user_id: number;
}

const LoginHistoryInformation: React.FC<Props> = ({ user_id }) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: 'Date', dataIndex: 'created_at', render: (val: string) => formatDate(val) , width: 120},
    { title: 'IP Address', dataIndex: 'ipAddress' },
    { title: 'Device', dataIndex: 'device' },
    { title: 'Browser', dataIndex: 'browser' },
    { title: 'Platform', dataIndex: 'platform' },
    { title: 'Language', dataIndex: 'language' },
    { title: 'City', dataIndex: 'city' },
    { title: 'Country', dataIndex: 'country' },
    { title: 'Latitude', dataIndex: 'latitude' },
    { title: 'Longitude', dataIndex: 'longitude' },
    { title: 'Public IP', dataIndex: 'publicIp' },
    { title: 'ISP', dataIndex: 'isp' },
    { title: 'ASN', dataIndex: 'asn' },
    { title: 'Cookies Enabled', dataIndex: 'cookiesEnabled', render: (val: boolean) => (val ? 'Yes' : 'No') },
    { title: 'JavaScript Enabled', dataIndex: 'javascriptEnabled', render: (val: boolean) => (val ? 'Yes' : 'No') },
    { title: 'Touch Support', dataIndex: 'touchSupport', render: (val: boolean | null) => val ? 'Yes' : 'No' },
    { title: 'Device Type', dataIndex: 'deviceType' },
    { title: 'CPU Cores', dataIndex: 'cpuCores' },
    { title: 'Memory', dataIndex: 'memory' },
    { title: 'Screen Size', dataIndex: 'screenSize' },
    { title: 'Battery Level', dataIndex: 'batteryLevel' },
    { title: 'Is Charging', dataIndex: 'isCharging', render: (val: boolean | null) => val ? 'Yes' : 'No' },
    { title: 'GPU Renderer', dataIndex: 'gpuRenderer' },
    { title: 'Cameras', dataIndex: 'cameras' },
    { title: 'Microphones', dataIndex: 'microphones' },
    { title: 'Possible IoT', dataIndex: 'possibleIoT', render: (val: boolean | null) => val ? 'Yes' : 'No' }
  ];

  const populateData = async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const res = await get(
        `/api/admin/get-login-history?user_id=${user_id}&page=${currentPage}&page_size=${pageSize}`
      );
      const records = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setSessions(records);
      setTotalRecords(count);
    } catch (error) {
      toast.error('Error fetching login history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [currentPage, pageSize, user_id]);

  const handlePageSizeChange = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  return (
    <Card className='p-4'>
      <h1 className='mb-2 font-semibold'>Login History</h1>
      <CustomTable columns={columns} dataSource={sessions} loading={loading} />
      <Pagination
        currentPage={currentPage}
        totalRecords={totalRecords}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </Card>
  );
};

export default LoginHistoryInformation;
