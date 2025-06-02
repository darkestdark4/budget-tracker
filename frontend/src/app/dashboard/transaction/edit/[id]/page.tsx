"use client";

import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import TransactionForm from "@/pages/TransactionForm";
import { editTransaction, fetchTransactionById } from "@/services/transaction";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import Modal from "@/ui/Modal";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditTransactionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [initialData, setInitialData] = useState<TransactionFormData>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalProps | null>(null);

  const loadTransaction = async () => {
    try {
      const res = await fetchTransactionById(Number(id));
      const tx = res.data;

      setInitialData({
        type: tx.type,
        amount: tx.amount.toString(),
        date: tx.date.slice(0, 10),
        note: tx.note,
        categoryId: tx.category_id,
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({ type: "danger", message: error.message });
      } else {
        setModal({ type: "danger", message: "Terjadi Kesalahan" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransaction();
  }, [id]);

  const handleSubmit = async (form: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      await editTransaction(Number(id), {
        ...form,
      });

      setModal({
        type: "success",
        message: "Transaksi berhasil diubah",
        onOk: () => router.push("/dashboard/transaction"),
      });
    } catch (error) {
      if (error instanceof Error) {
        setModal({
          type: "danger",
          message: error.message,
        });
      } else {
        setModal({
          type: "danger",
          message: "Terjadi Kesalahan",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinnerScreen />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Transaksi</h1>
      {isSubmitting && <LoadingSpinnerScreen />}
      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onOk={() => {
            setModal(null);
            if (modal.type === "success") {
              router.push("/dashboard/transaction");
            }
          }}
        />
      )}

      <TransactionForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
