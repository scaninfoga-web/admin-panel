"use client"
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { CustomTable } from "@/components/custom/custom-table";
import Pagination from "@/components/custom/pagination";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { Users as UsersIcon, Download, RefreshCw } from "lucide-react";
import { SimpleSearchFilters, type FilterState } from "@/components/custom/simple-search-filter";
import { get, post } from "@/lib/api";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface User {
  id: number;
  email: string;
  user_type: string;
  is_active: boolean;
  date_joined: string;
  session_last_login: string;
  wallet_balance: string;
  total_spent: string;
  profile_first_name?: string;
  profile_last_name?: string;
}

const Users: React.FC = () => {
  const [tableData, setTableData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [statusBtnLoading, setStatusBtnLoading] = useState(false)

    const state = useSelector((state: RootState) => state)

    const toggleInactiveStatus = async (id: number) => {
      setStatusBtnLoading(true)
      try {
        await post("/api/admin/toggle-active-status", {id})
        toast.success("Active status toggled")
        setTableData(prev =>
      prev.map(row =>
        row.id === id ? { ...row, is_active: !row.is_active } : row
      )
    );
      }
      catch(error){
        toast.error("Error changing active status")
      }
      finally{
        setStatusBtnLoading(false)
      }
    }

  const columns = [
    {
      title: "ID",
      dataIndex: "id" as keyof User,
    },
    {
      title: "Email",
      dataIndex: "email" as keyof User,
    },
    {
      title: "Name",
      dataIndex: "profile_first_name" as keyof User,
      render: (_: any, record: User) => {
        const firstName = record.profile_first_name || '';
        const lastName = record.profile_last_name || '';
        return firstName || lastName ? `${firstName} ${lastName}`.trim() : '-';
      },
    },
    {
      title: "User Type",
      dataIndex: "user_type" as keyof User,
      render: (val: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          val === 'CORPORATE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          val === 'DEVELOPER' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        }`}>
          {val}
        </span>
      ),
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined" as keyof User,
      render: (val: string) => formatDate(val),
    },
    {
      title: "Last Login",
      dataIndex: "session_last_login" as keyof User,
      render: (val: string) => val ? formatDate(val) : 'Never',
    },
    {
      title: "Wallet Balance",
      dataIndex: "wallet_balance" as keyof User,
      render: (val: string) => `${parseFloat(val || '0').toFixed(2)}`,
    },
    {
      title: "Total Spent",
      dataIndex: "total_spent" as keyof User,
      render: (val: string) => `$${parseFloat(val || '0').toFixed(2)}`,
    },
    {
      title: "Active status",
      dataIndex: "is_active" as keyof User,
      render: (val: boolean) => val ? "Active" : "Inactive"
    },
    {
      title: "Action",
      dataIndex: "action" as keyof User,
      render: (_: string, record: User) => (
        <div className="flex gap-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`/users/${record.id}`, '_blank')}
          >
          View Details
        </Button>
        <Button
          variant={record.is_active ? "destructive" : "default"}
          size="sm"
          loading={statusBtnLoading}
          onClick={() => toggleInactiveStatus(record.id)}
          >
          Set as {record.is_active ? "Inactive" : "Active"}
        </Button>
          </div>
      ),
    },
  ];

  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    params.append('page_size', pageSize.toString());
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    return params.toString();
  }, [currentPage, pageSize, filters]);

  const populateData = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = buildQueryParams();
      const res = await get(`/api/auth/getAllUsers?${queryParams}`);
      const users = res?.responseData?.result || [];

      const count = res?.responseData?.paginationDetails?.count || 0;
      setTableData(users);
      setTotalRecords(count);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  useEffect(() => {
    populateData();
  }, [populateData]);

  const handlePageSizeChange = (size: number) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    populateData();
  };

  const handleClearFilters = () => {
    setFilters({ ordering: 'email' });
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    populateData();
    toast.success("Data refreshed successfully");
  };

  const handleExport = () => {
    toast.info("Export functionality coming soon");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <UsersIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage and filter users</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search Filters */}
      <SimpleSearchFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{totalRecords}</span> users found
            </div>
            {Object.values(filters).some(v => v && v !== 'email') && (
              <div className="text-sm text-muted-foreground">
                Filters active
              </div>
            )}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <CustomTable 
          columns={columns} 
          dataSource={tableData} 
          loading={loading}
          scroll={{ x: true }}
        />
        
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[5, 10, 20, 50, 100]}
          />
        </div>
      </Card>
    </div>
  );
};

export default Users;