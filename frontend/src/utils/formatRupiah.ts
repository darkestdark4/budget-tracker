export default function formatRupiah(harga: number | string) {
  return `Rp. ${harga.toLocaleString("id-ID")}`;
}
