'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { get } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CustomTable } from '@/components/custom/custom-table';
import Pagination from '@/components/custom/pagination';
import { Card } from '@/components/ui/card';

interface WalletHistoryProps {
  id: number;
  txn_type: 'credit' | 'debit';
  amount: string;
  comment: string;
  created_at: string;
  api_name: string | null;
  txn_id: string | null;
}

interface Props {
  user_id: number;
}

const WalletHistory: React.FC<Props> = ({ user_id }) => {
  const [records, setRecords] = useState<WalletHistoryProps[]>([]);
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
      title: 'Transaction Type',
      dataIndex: 'txn_type',
      render: (val: string) => val.toUpperCase(),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'API Name',
      dataIndex: 'api_name',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'Txn ID',
      dataIndex: 'txn_id',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (val: string) => formatDate(val),
    },
  ];

  const populateData = async () => {
    if (!user_id) return;
    try {
      setLoading(true);
      const res = await get(
        `/api/admin/user-wallet-history?user_id=${user_id}&page=${currentPage}&page_size=${pageSize}`
      );
      const result = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setRecords(result);
      setTotalRecords(count);
    } catch (error) {
      toast.error('Error fetching wallet history');
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
      <h1 className="mb-2 font-semibold">Wallet History</h1>
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

export default WalletHistory;
