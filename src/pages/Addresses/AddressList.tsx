import { useState, useEffect } from 'react';
import { addressApi } from '../../api';
import { Button, Input, Loading, Alert } from '../../components';
import type { Address, CreateAddressRequest } from '../../types';
import styles from './AddressList.module.css';

export function AddressList() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateAddressRequest>({
    line1: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await addressApi.getAll();
      if (response.success && response.data) {
        setAddresses(response.data);
      }
    } catch {
      setError('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ line1: '', city: '', state: '', pincode: '', country: '' });
    setErrors({});
    setEditingId(null);
    setIsEditing(false);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      line1: address.line1,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
    });
    setEditingId(address.id);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const newErrors: Record<string, string> = {};
    if (!formData.line1.trim()) newErrors.line1 = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingId) {
        await addressApi.update({ ...formData, id: editingId });
        setSuccess('Address updated successfully');
      } else {
        await addressApi.create(formData);
        setSuccess('Address added successfully');
      }
      resetForm();
      loadAddresses();
    } catch {
      setError(editingId ? 'Failed to update address' : 'Failed to add address');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      await addressApi.delete(id);
      setSuccess('Address deleted successfully');
      loadAddresses();
    } catch {
      setError('Failed to delete address');
    }
  };

  if (isLoading) return <Loading text="Loading addresses..." />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Addresses</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className={styles.layout}>
        <div className={styles.addresses}>
          {addresses.length === 0 ? (
            <p className={styles.empty}>No addresses saved</p>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className={styles.addressCard}>
                <div className={styles.addressContent}>
                  <p className={styles.addressLine}>{address.line1}</p>
                  <p className={styles.addressLine}>
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className={styles.addressLine}>{address.country}</p>
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(address)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(address.id)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>
            {isEditing ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Address Line"
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              error={errors.line1}
              placeholder="123 Main Street"
            />
            <div className={styles.row}>
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={errors.city}
                placeholder="New York"
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                error={errors.state}
                placeholder="NY"
              />
            </div>
            <div className={styles.row}>
              <Input
                label="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                error={errors.pincode}
                placeholder="10001"
              />
              <Input
                label="Country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                error={errors.country}
                placeholder="USA"
              />
            </div>
            <div className={styles.formActions}>
              {isEditing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
              <Button type="submit">{isEditing ? 'Update' : 'Add'} Address</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
