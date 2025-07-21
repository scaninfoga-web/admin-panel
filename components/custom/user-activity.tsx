'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CustomTable, type Column } from '@/components/custom/custom-table';
import Pagination from '@/components/custom/pagination';
import { Card } from '@/components/ui/card';

interface UserActivity {
  id: number;
  email: string;
  api_called: string;
  activity_time: string;
  request_payload: string;
  browser: string;
  ip_address: string;
  latitude: string;
  longitude: string;
}

interface Props {
  user_id: number;
}

const UserActivity: React.FC<Props> = ({ user_id }) => {
  const [records, setRecords] = useState<UserActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'API Called',
      dataIndex: 'api_called',
    },
    {
      title: 'Activity Time',
      dataIndex: 'activity_time',
      render: (val: string) => formatDate(val),
    },
    {
  title: 'Request Payload',
  dataIndex: 'request_payload',
  // render: (val: any) => {
  //   const payloadStr = val && typeof val === 'object'
  //     ? Object.entries(val)
  //         .map(([k, v]) => `${k}: ${String(v)}`)
  //         .join(', ')
  //     : '-';

  //   return (
  //     <div className="max-w-[250px] truncate" title={payloadStr}>
  //       {payloadStr}
  //     </div>
  //   );
  // },
  render: (val: Object) => JSON.stringify(val)
},
    {
      title: 'Browser',
      dataIndex: 'browser',
    },
    {
      title: 'IP Address',
      dataIndex: 'ip_address',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
    },
  ] as Column<UserActivity>[]

  const populateData = async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const res = await get(
        `/api/admin/get-user-activity?user_id=${user_id}&page=${currentPage}&page_size=${pageSize}`
      );
      const result = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setRecords(result);
      setTotalRecords(count);
    } catch (error) {
      toast.error('Error fetching user activity');
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
    <Card className="p-4">
      <h1 className="mb-2 font-semibold">User Activity</h1>
      <CustomTable columns={columns} dataSource={records} loading={loading} />
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

export default UserActivity;
