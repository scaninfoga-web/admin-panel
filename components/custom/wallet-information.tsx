'use client'

import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import type { WalletInformationProps } from '@/lib/types';
import { Loader } from './custom-loader';
import { formatISOtoDDMMYYYY } from '@/lib/utils';
import { useState } from 'react';
import { Modal } from './modal';
import WalletUpdateForm from './wallet-update-form';


interface PropsUtil {
  data: WalletInformationProps | undefined;
  loading: boolean;
  user_id: number;
}
export const WalletInformation: React.FC<PropsUtil> = ({data, loading, user_id}) => {
  const [creditModalOpen, setCreditModalOpen] = useState(false)
  const [debitModalOpen, setDebitModalOpen] = useState(false)

  if(loading || !data){
    return <Loader />
  }

  return (
    <>
    <Card className="card-bg border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-500">
          <MapPin className="h-5 w-5 text-emerald-500" />
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Balance:</h3>
            <p className="text-gray-300">{data.balance}</p>
          </div>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Last Transaction Date:</h3>
            <p className="text-gray-300">{formatISOtoDDMMYYYY(data.last_successful_transaction?.created_at)}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button onClick={() => setCreditModalOpen(true)}> Credit </Button>
            <Button onClick={() => setDebitModalOpen(true)}> Debit </Button>
          </div>
      </CardContent>
    </Card>

    <Modal
      open={creditModalOpen}
      onClose={() => setCreditModalOpen(false)}
      title="Wallet Credit"
      showFooter={false}
    >
      <WalletUpdateForm txnType="credit" user_id={user_id} />
    </Modal>

    <Modal
      open={debitModalOpen}
      onClose={() => setDebitModalOpen(false)}
      title="Wallet Debit"
      showFooter={false}
    >
      <WalletUpdateForm txnType="debit" user_id={user_id} />
    </Modal>
    </>
  );
};
