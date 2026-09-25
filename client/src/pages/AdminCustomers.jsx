import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { CustomerTable } from '../components/admin/CustomerTable';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await API.get('/admin/customers');
        setCustomers(data || []);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-cream-dark">
        <h2 className="font-serif text-xl font-bold text-forest">Registered Customers ({customers.length})</h2>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-forest border-t-transparent rounded-full mx-auto" />
        </div>
      ) : (
        <CustomerTable customers={customers} />
      )}
    </div>
  );
};
