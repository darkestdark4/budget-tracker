"use client";
import TransactionForm from "@/pages/TransactionForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "@/ui/Modal";
import LoadingSpinnerScreen from "@/ui/LoadingSpinnerScreen";
import { ModalProps } from "@/interfaces/IModal";
import { TransactionFormData } from "@/interfaces/ITransaction";
import { createTransaction } from "@/services/transaction";

export default function CreateTransactionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState<ModalProps | null>(null);

  async function handleSubmit(form: TransactionFormData) {
    setIsSubmitting(true);
    try {
      await createTransaction({
        ...form,
        category_id: form.categoryId,
      });
      setModal({ type: "success", message: "Transaksi berhasil dibuat" });

      router.push("/dashboard/transaction");
    } catch (error) {
      if (error instanceof Error) {
        setModal({ type: "danger", message: error.message });
      } else {
        setModal({ type: "danger", message: "Terjadi kesalahan" });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Buat Transaksi Baru</h1>

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

      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
}
