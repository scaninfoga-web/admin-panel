'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CustomTable } from '@/components/custom/custom-table';
import Pagination from '@/components/custom/pagination';
import { Card } from '../ui/card';

const bookmarkMapping: {[key: number]: string} = {
  1: "Scaninfoga Intelligence"
}

interface Bookmark {
  id: string;
  bookmark_page: number;
  created_at: string;
  payload: {
    mobileNumber: string;
    realtimeData: boolean;
  };
  latitude: string;
  longitude: string;
  case_type: string;
  case_description: string;
  investigator: string;
  updated_at: string;
  status: string;
}

interface Props {
  user_id: number;
}

const BookmarkInformation: React.FC<Props> = ({ user_id }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
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
      title: 'Bookmark Page',
      dataIndex: 'bookmark_page',
      render: (val: number) => bookmarkMapping[val] || 'N/A',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Mobile Number',
      dataIndex: 'payload',
      render: (payload: any) => payload?.mobileNumber || 'N/A',
    },
    {
      title: 'Latitude',
      dataIndex: 'latitude',
    },
    {
      title: 'Longitude',
      dataIndex: 'longitude',
    },
    {
      title: 'Case Type',
      dataIndex: 'case_type',
    },
    {
      title: 'Case Description',
      dataIndex: 'case_description',
    },
    {
      title: 'Investigator',
      dataIndex: 'investigator',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

  const populateData = async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const res = await get(
        `/api/admin/get-user-bookmark-list?user_id=${user_id}&page=${currentPage}&page_size=${pageSize}`
      );
      const records = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setBookmarks(records);
      setTotalRecords(count);
    } catch (error) {
      toast.error('Error fetching bookmarks');
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
        <h1 className='mb-2 font-semibold'>Bookmark Information</h1>
      <CustomTable columns={columns} dataSource={bookmarks} loading={loading} />
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

export default BookmarkInformation;
