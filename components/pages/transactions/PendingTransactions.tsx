'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { get, post } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CustomTable, type Column } from '@/components/custom/custom-table';
import Pagination from '@/components/custom/pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PendingTransactionProps {
  txn_id: string;
  amount: string;
  status: string;
  created_at: string;
  comment: string | null;
  payment_group: string | null;
  bank_reference: string | null;
  credited_amount: string;
  user_first_name: string | null;
  user_last_name: string | null;
}

const PendingTransaction: React.FC = () => {
  const [records, setRecords] = useState<PendingTransactionProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const approveTxn = async (record: PendingTransactionProps) => {
    try{
        await post('/api/payments/updateTxnToSuccess', {txn_id: record.txn_id, amount: record.amount})
        toast.success("Transaction approval successful")
        populateData();
    }
    catch(error){
        toast.error("Error approving transaction")
    }
  }
  const rejectTxn = async (record: PendingTransactionProps) => {
    try{
            await post('/api/payments/updateTxnToFailed', {txn_id: record.txn_id, amount: record.amount})
            toast.success("Transaction rejected successfully")
            populateData();
        }
        catch(error){
            toast.error("Error rejecting transaction")
        }
  }

  const columns = [
    {
      title: 'Txn ID',
      dataIndex: 'txn_id',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (val: string) => val.toUpperCase(),
    },
    {
      title: 'Credited Amount',
      dataIndex: 'credited_amount',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'Payment Group',
      dataIndex: 'payment_group',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'Bank Reference',
      dataIndex: 'bank_reference',
      render: (val: string | null) => val || '-',
    },
    {
      title: 'User',
      dataIndex: 'user_first_name',
      render: (_: any, record: PendingTransactionProps) =>
        `${record.user_first_name || ''} ${record.user_last_name || ''}`.trim() || '-',
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_ : any, record: PendingTransactionProps) => (
        <div className="flex gap-x-2">
            <Button onClick = {() => approveTxn(record)}> Approve </Button>
            <Button variant="destructive" onClick = {() => rejectTxn(record)}> Reject </Button>
        </div>
      )
    },
  ] as Column<PendingTransactionProps>[];

  const populateData = async () => {
    try {
      setLoading(true);
      const res = await get(
        `/api/admin/pending-txns?page=${currentPage}&page_size=${pageSize}`
      );
      const result = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setRecords(result);
      setTotalRecords(count);
    } catch (error) {
      toast.error('Error fetching pending transactions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    populateData();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  return (
    <Card className="p-4">
      <h1 className="mb-2 font-semibold">Pending Transactions</h1>
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

export default PendingTransaction;

