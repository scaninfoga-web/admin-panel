'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { post } from '@/lib/api';
import { CustomForm } from '@/components/custom/custom-form';
import { CustomInput } from '@/components/custom/custom-input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const transactionSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be a positive number',
    }),
  comment: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface Props {
  txnType: string,
  user_id: number,
  handleModalState: () => void
}

export const  WalletUpdateForm: React.FC<Props> = ({txnType, user_id, handleModalState}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: '',
      comment: '',
    },
  });

  const onSubmit = async (data: TransactionFormValues) => {
    const payload = {...data, user_id, txn_type: txnType}
    try {
      setLoading(true);
    const url = '/api/admin/wallet-update'
      await post(url, payload)

      toast.success('Transaction submitted successfully!', { duration: 800 });
      form.reset();
    } catch (error) {
      toast.error('Failed to submit transaction.');
    } finally {
      handleModalState()
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">

        <CustomInput
          name="amount"
          label="Amount"
          type="text"
          placeholder="Enter amount"
        />

        <CustomInput
          name="comment"
          label="Comment"
          type="text"
          placeholder="Optional comment"
        />

        <Button
          type="submit"
          className="w-full bg-emerald-500 text-black hover:bg-emerald-400"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Transaction'}
        </Button>
      </CustomForm>
    </div>
  );
}
