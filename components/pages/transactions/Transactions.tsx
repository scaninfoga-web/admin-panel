import Title from "@/components/custom/custom-title"
import PendingTransaction from "./PendingTransactions";
import SuccessfulTransaction from "./SuccessfulTransactions";
import FailedTransaction from "./FailedTransactions";
import CustomTabs from "@/components/custom/custom-tab";

const tabs = [
    {
      value: 'pending',
      label: 'Pending Transactions',
      component: <PendingTransaction />,
    },
    {
      value: 'success',
      label: 'Successful Transactions',
      component: <SuccessfulTransaction />,
    },
    {
      value: 'failed',
      label: 'Failed Transactions',
      component: <FailedTransaction />,
    },
  ];

const Transaction: React.FC = () => {
    return (
        <>
            <Title title="User Transactions"  />
            <CustomTabs tabs={tabs} />
        </>
    )
}

export default Transaction;