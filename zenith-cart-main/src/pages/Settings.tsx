import { useState } from 'react';
import { User, Shield, MapPin, Users, Save, Eye, EyeOff, Plus, Trash2, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '@/hooks/useAddresses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

type Tab = 'profile' | 'security' | 'addresses' | 'roles';

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'addresses', label: 'Addresses', icon: <MapPin className="h-4 w-4" /> },
  { id: 'roles', label: 'Role Management', icon: <Users className="h-4 w-4" /> },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('addresses');
  const { user, updateUser } = useAuthStore();

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <nav className="flex md:flex-col gap-1 md:w-52 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileSection user={user} updateUser={updateUser} />}
          {activeTab === 'security' && <SecuritySection />}
          {activeTab === 'addresses' && <AddressesSection />}
          {activeTab === 'roles' && <RolesSection />}
        </div>
      </div>
    </div>
  );
};

const ProfileSection = ({ user, updateUser }: { user: { email?: string; mobileNo?: string } | null; updateUser: (data: { mobileNo?: string }) => void }) => {
  const [form, setForm] = useState({
    email: user?.email || '',
    mobileNo: user?.mobileNo || '',
  });

  const handleSave = () => {
    updateUser(form);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold">Profile Information</h2>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
          {form.email.split('@')[0].slice(0, 2).toUpperCase()}
        </div>
        <button className="text-sm text-accent hover:underline">Change avatar</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input 
            type="email" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled
          />
        </div>
        <div>
          <Label>Mobile Number</Label>
          <Input 
            type="tel" 
            value={form.mobileNo} 
            onChange={(e) => setForm({ ...form, mobileNo: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleSave} className="bg-primary">
        <Save className="h-4 w-4 mr-2" /> Save Changes
      </Button>
    </div>
  );
};

const SecuritySection = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold">Security</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <Label>Current Password</Label>
          <div className="relative">
            <Input 
              type={showCurrent ? 'text' : 'password'} 
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
            />
            <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label>New Password</Label>
          <div className="relative">
            <Input 
              type={showNew ? 'text' : 'password'} 
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label>Confirm New Password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
      </div>
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div>
          <p className="text-sm font-medium">Two-Factor Authentication</p>
          <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
        </div>
        <button className="text-sm text-accent font-medium hover:underline">Enable</button>
      </div>
      <Button className="bg-primary">
        <Save className="h-4 w-4 mr-2" /> Update Password
      </Button>
    </div>
  );
};

const AddressesSection = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<{ id: number; line1: string; city: string; state: string; pincode: string; country: string } | null>(null);
  const [form, setForm] = useState({ line1: '', city: '', state: '', pincode: '', country: '' });

  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const handleSubmit = async () => {
    try {
      if (editingAddress) {
        await updateAddress.mutateAsync({ id: editingAddress.id, ...form });
        toast.success('Address updated successfully');
      } else {
        await createAddress.mutateAsync(form);
        toast.success('Address added successfully');
      }
      setShowDialog(false);
      setEditingAddress(null);
      setForm({ line1: '', city: '', state: '', pincode: '', country: '' });
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to save address');
    }
  };

  const handleEdit = (addr: { id: number; line1: string; city: string; state: string; pincode: string; country: string }) => {
    setEditingAddress(addr);
    setForm({
      line1: addr.line1,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      country: addr.country,
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success('Address deleted successfully');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button 
          size="sm" 
          className="bg-primary"
          onClick={() => { setEditingAddress(null); setForm({ line1: '', city: '', state: '', pincode: '', country: '' }); setShowDialog(true); }}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Address
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : addresses && addresses.length > 0 ? (
        addresses.map((addr) => (
          <div key={addr.id} className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">{addr.line1}</p>
              <p className="text-sm text-muted-foreground mt-1">{addr.city}, {addr.state} {addr.pincode}</p>
              <p className="text-sm text-muted-foreground">{addr.country}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(addr)} className="text-xs text-accent hover:underline">Edit</button>
              <button 
                onClick={() => handleDelete(addr.id)} 
                className="text-xs text-destructive hover:underline"
                disabled={deleteAddress.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No addresses found. Add one to get started.
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? 'Edit Address' : 'Add New Address'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Address Line</Label>
              <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} placeholder="123 Main Street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="New York" />
              </div>
              <div>
                <Label>State</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="NY" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pincode</Label>
                <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} placeholder="10001" />
              </div>
              <div>
                <Label>Country</Label>
                <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="USA" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={createAddress.isPending || updateAddress.isPending}>
              {(createAddress.isPending || updateAddress.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RolesSection = () => {
  const [activeRole, setActiveRole] = useState<'customer' | 'vendor'>('customer');

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5">
      <h2 className="text-lg font-semibold">Role Management</h2>
      <p className="text-sm text-muted-foreground">Switch between your active roles or request new ones.</p>

      <div className="space-y-3">
        {(['customer', 'vendor'] as const).map((role) => (
          <label
            key={role}
            className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
              activeRole === role ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
            }`}
          >
            <input
              type="radio"
              name="role"
              checked={activeRole === role}
              onChange={() => setActiveRole(role)}
              className="accent-primary"
            />
            <div>
              <p className="text-sm font-semibold capitalize">{role}</p>
              <p className="text-xs text-muted-foreground">
                {role === 'customer' ? 'Browse and purchase products' : 'Sell and manage your own products'}
              </p>
            </div>
          </label>
        ))}
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-sm font-medium">Want to become a Vendor?</p>
        <p className="text-xs text-muted-foreground mb-3">Start selling your products on the platform</p>
        <Button className="bg-accent">
          Become a Vendor
        </Button>
      </div>
    </div>
  );
};

export default Settings;
