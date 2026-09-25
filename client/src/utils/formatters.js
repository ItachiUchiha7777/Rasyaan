export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Processing':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    case 'Out for Delivery':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Cancelled':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};
