interface Props {
  status: string;
}

const statusClasses: Record<string, string> = {
  Normal: 'badge-normal',
  Low: 'badge-low',
  Expired: 'badge-expired',
  Pending: 'badge-pending',
  Approved: 'badge-approved',
  Rejected: 'badge-rejected',
  Diterima: 'badge-delivered',
  Dikirim: 'badge-approved',
  'Tanggap Darurat': 'badge-low',
  Pemulihan: 'badge-normal',
  Tersedia: 'badge-normal',
  Digunakan: 'badge-approved',
  Maintenance: 'badge-low',
};

export const StatusBadge = ({ status }: Props) => (
  <span className={statusClasses[status] || 'badge-pending'}>{status}</span>
);
