// "use client"

// import Title from "@/components/custom/custom-title";
// import { get } from "@/lib/api";
// import { useEffect } from "react";
// import { toast } from "sonner";

// const Users : React.FC = () => {

//     const populateData = async () => {
//         try{
//             const data = await get("/api/auth/getAllUsers" );
//             console.log("Data");
//         }
//         catch(error){
//             toast.error("Error fetching users");
//         }
//     }
//     useEffect(() => {
//         populateData();
//     }, [])

//   return (
//     <>
//       <Title title="Users" subTitle="Manage Users" />
//       <div>
//       </div>
//     </>
//   );
// }

// export default Users;


"use client";

import Title from "@/components/custom/custom-title";
import { get } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { formatDate } from "@/lib/utils";
import { CustomTable } from "@/components/custom/custom-table";
import Pagination from "@/components/custom/pagination";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Users: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "User Type",
      dataIndex: "user_type",
    },
    {
      title: "Is Active",
      dataIndex: "is_active",
      render: (val: boolean) => (val ? "Yes" : "No"),
    },
    {
      title: "Date Joined",
      dataIndex: "date_joined",
      render: (val: string) => formatDate(val),
    },
    {
      title: "Last Login",
      dataIndex: "session_last_login",
      render: (val: string) => formatDate(val),
    },
    {
      title: "Wallet Balance",
      dataIndex: "wallet_balance",
    },
    {
      title: "Total Spent",
      dataIndex: "total_spent",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: string, record: any) => (
        <Link href={`/users/${record.id}`} className="text-primary">
          View details
        </Link>
      ),
    },
  ];

  const populateData = async () => {
    try {
      setLoading(true);
      const res = await get(
        `/api/auth/getAllUsers?page=${currentPage}&page_size=${pageSize}`
      );
      const users = res?.responseData?.result || [];
      const count = res?.responseData?.paginationDetails?.count || 0;

      setTableData(users);
      setTotalRecords(count);
    } catch (error) {
      toast.error("Error fetching users");
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
    <>
      <Title title="Users" subTitle="Manage Users" />
      <div className="mt-4">
        <CustomTable columns={columns} dataSource={tableData} loading={loading} />
        <Pagination
          currentPage={currentPage}
          totalRecords={totalRecords}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>
    </>
  );
};

export default Users;
