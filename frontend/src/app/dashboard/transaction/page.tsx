"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TransactionCard from "@/ui/TransactionCard";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import formatRupiah from "@/utils/formatRupiah";
import {
  deleteTransaction,
  fetchTotalExpenseStat,
  fetchTransaction,
} from "@/services/transaction";
import { Transaction } from "@/interfaces/IDashboard";
import Modal from "@/ui/Modal";
import { ModalProps } from "@/interfaces/IModal";

export default function TransactionPage() {
  const [search, setSearch] = useState<string>("");
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [stats, setStats] = useState<Record<string, number>>({
    total_expense: 0,
    count: 0,
  });
  const [modal, setModal] = useState<ModalProps | null>(null);

  const loadTransaction = async () => {
    try {
      const res = await fetchTransaction(page, limit, search);

      setTransaction(res.data);
      setTotalPage(res.pagination.total_page);
    } catch (error) {
      if (error instanceof Error) {
        console.error({ message: error.message, type: "danger" });
      } else {
        console.error({ message: "Terjadi Kesalahan", type: "danger" });
      }
    }
  };

  const loadStats = async () => {
    try {
      const res = await fetchTotalExpenseStat();

      setStats(res.data);
    } catch (error) {
      if (error instanceof Error) {
        console.error({ message: error.message, type: "danger" });
      } else {
        console.error({ message: "Terjadi Kesalahan", type: "danger" });
      }
    }
  };

  useEffect(() => {
    loadTransaction();
    loadStats();
  }, [page, search, limit]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    setModal({
      type: "warning",
      message: "Apakah anda yakin ingin menghapus transaksi ini?",
      onOk: async () => {
        try {
          await deleteTransaction(id);

          setModal({
            type: "success",
            message: "Transaksi berhasil dihapus",
            onOk: () => setModal(null),
          });

          const res = await fetchTransaction(page, limit, search);
          setTransaction(res.data);
        } catch (error) {
          console.error(error);

          setModal({
            type: "danger",
            message: "Gagal menghapus transaksi",
            onOk: () => setModal(null),
          });
        }
      },
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TransactionCard
          title="Total Pengeluaran Hari Ini"
          value={stats.total_expense}
        />
        <TransactionCard
          title="Jumlah Transaksi Hari Ini"
          value={stats.count}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:max-w-xs">
          <FaSearch className="absolute top-2.5 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            onChange={handleSearch}
            value={search}
            className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
          />
        </div>

        <Link
          href="/dashboard/transaction/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-indigo-700 w-full sm:w-fit"
        >
          <FaPlus /> Buat Transaksi
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="min-w-[600px]">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="p-3">No</th>
                <th>Nama</th>
                <th>Waktu</th>
                <th>Jumlah</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {transaction.length > 0 ? (
                transaction.map((tx, idx) => {
                  const tanggal = new Date(tx.date).toLocaleDateString("id-ID");

                  return (
                    <>
                      <tr className="border-t text-gray-700">
                        <td className="p-4">{(page - 1) * limit + idx + 1}</td>
                        <td>
                          <div className="font-semibold">
                            {tx.category.name}
                          </div>
                          <div className="text-xs text-gray-500">{tx.note}</div>
                        </td>
                        <td>{tanggal}</td>
                        <td
                          className={`font-medium ${
                            tx.type === "expense"
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {tx.type === "expense" ? "-" : "+"}
                          {formatRupiah(tx.amount)}
                        </td>
                        <td>
                          <div className="flex items-center gap-4">
                            <Link
                              href={`/dashboard/transaction/edit/${tx.id}`}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              onClick={() => handleDelete(tx.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-gray-400 py-6">
                    Tidak ada transaksi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal
          type={modal.type}
          message={modal.message}
          onOk={modal.onOk}
          onCancel={modal.onCancel}
        />
      )}
    </div>
  );
}
