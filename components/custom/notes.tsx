'use client'

import { MapPin, NotebookIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { Modal } from './modal';
import NoteForm from './note-form';
import { get } from '@/lib/api';
import { toast } from 'sonner';
import { Loader } from './custom-loader';

interface PropsUtil {
//   data: WalletInformationProps | undefined;
//   loading: boolean;
  user_id: number;
}
export const Notes: React.FC<PropsUtil> = ({user_id}) => {
//   const [creditModalOpen, setCreditModalOpen] = useState(false)
//   const [debitModalOpen, setDebitModalOpen] = useState(false)

const [note, setNote] = useState("")
const [loading, setLoading] = useState(false)

const [modalOpen, setModalOpen] = useState(false)

//   if(loading || !data){
//     return <Loader />
//   }


const populateData = async () => {
    try{
      setLoading(true)
        const data = await get(`/api/admin/user-note?user_id=${user_id}`)
        setNote(data.responseData.note || "")
    }
    catch(error){
        toast.error("Failed to load the user note")
        console.error("Fetch note failed: ", error)
    }
    finally{
      setLoading(false)
    }
}

useEffect(() => {
    populateData();
}, [])

const handleModalState = () => {
  setModalOpen(false);
  populateData();
}

 if(loading){
    return (
      <Card>
    <Loader />
      </Card>
    )
  }

  return (
    <>
    <Card className="card-bg border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-500">
          <NotebookIcon className="h-5 w-5 text-emerald-500" />
          Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {
            note && (
                <div className="border p-2 mb-2">
                    {
                        note.substring(0, 50) + "..."
                    }
                </div>
            )
        }
        <div className="flex justify-center">
        <Button onClick={() => setModalOpen(true)}> Add / View Note </Button>
        </div>
          {/* <div className="flex items-center justify-between">
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
          </div> */}
      </CardContent>
    </Card>

    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      title="Note"
      showFooter={false}
    >
      <NoteForm handleModalState={handleModalState} note={note} user_id={user_id} />
    </Modal>

    {/* <Modal
      open={debitModalOpen}
      onClose={() => setDebitModalOpen(false)}
      title="Wallet Debit"
      showFooter={false}
    >
      <WalletUpdateForm txnType="debit" user_id={user_id} />
    </Modal> */}
    </>
  );
};
