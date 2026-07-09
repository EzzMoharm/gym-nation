"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, Edit2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  full_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const supabase = createClient();

  // Form states
  const [label, setLabel] = useState("Home");
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("US");
  const [phone, setPhone] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err: any) {
      toast.error("Failed to load addresses: " + err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setLabel("Home");
    setFullName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("US");
    setPhone("");
    setIsDefault(false);
    setIsEditing(null);
    setShowForm(false);
  };

  const handleEdit = (address: Address) => {
    setIsEditing(address.id);
    setLabel(address.label);
    setFullName(address.full_name);
    setAddressLine1(address.address_line_1);
    setAddressLine2(address.address_line_2 || "");
    setCity(address.city);
    setState(address.state);
    setPostalCode(address.postal_code);
    setCountry(address.country);
    setPhone(address.phone || "");
    setIsDefault(address.is_default);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const addressData = {
        label,
        full_name: fullName,
        address_line_1: addressLine1,
        address_line_2: addressLine2 || null,
        city,
        state,
        postal_code: postalCode,
        country,
        phone: phone || null,
        is_default: isDefault,
        user_id: user.id,
      };

      if (isDefault) {
        // Unset other default addresses
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (isEditing) {
        const { error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", isEditing)
          .eq("user_id", user.id);
        if (error) throw error;
        toast.success("Address updated successfully");
      } else {
        // If this is the first address, make it default automatically
        if (addresses.length === 0) {
          addressData.is_default = true;
        }
        const { error } = await supabase
          .from("addresses")
          .insert(addressData);
        if (error) throw error;
        toast.success("Address added successfully");
      }

      resetForm();
      await loadAddresses();
    } catch (err: any) {
      toast.error("Error saving address: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("addresses")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Address deleted successfully");
      await loadAddresses();
    } catch (err: any) {
      toast.error("Failed to delete address: " + err.message);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Unset other default addresses
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      // Set selected address as default
      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;
      toast.success("Default address updated");
      await loadAddresses();
    } catch (err: any) {
      toast.error("Failed to update default address: " + err.message);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Addresses</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your shipping and billing addresses.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="rounded-xl h-11 gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add New Address
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-brand/20">
          <CardHeader>
            <CardTitle>{isEditing ? "Edit Address" : "Add New Address"}</CardTitle>
            <CardDescription>
              Provide address details for shipping and delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="label">Address Label (e.g. Home, Work)</Label>
                  <Input
                    id="label"
                    required
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="addressLine1">Address Line 1</Label>
                  <Input
                    id="addressLine1"
                    required
                    placeholder="Street address, P.O. box, company name"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                  <Input
                    id="addressLine2"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province / Region</Label>
                  <Input
                    id="state"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal / ZIP Code</Label>
                  <Input
                    id="postalCode"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="For delivery updates"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="sm:col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={isDefault}
                    onChange={(e) => setIsDefault(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand cursor-pointer"
                  />
                  <Label htmlFor="isDefault" className="cursor-pointer select-none">
                    Set as default address
                  </Label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <Button type="submit" disabled={isSubmitting} className="rounded-xl h-11">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditing ? "Update Address" : "Save Address"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl h-11">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 p-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-lg font-medium mb-2">No saved addresses</p>
          <p className="text-muted-foreground mb-6">
            Add a shipping address to speed up your checkout process.
          </p>
          <Button onClick={() => setShowForm(true)} className="rounded-xl">
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={`relative overflow-hidden transition-all duration-200 ${address.is_default ? "border-brand shadow-sm bg-brand/[0.02]" : "hover:border-border-hover"}`}>
              <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg font-semibold">{address.label}</CardTitle>
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                        <Check className="h-3 w-3" />
                        Default
                      </span>
                    )}
                  </div>
                  <CardDescription className="font-medium text-foreground mt-1">
                    {address.full_name}
                  </CardDescription>
                </div>
                <div className="flex gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(address)}
                    className="h-8 w-8 rounded-lg hover:bg-muted"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(address.id)}
                    className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{address.address_line_1}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>{address.city}, {address.state} {address.postal_code}</p>
                  <p>{address.country}</p>
                  {address.phone && <p className="mt-2 text-foreground">Phone: {address.phone}</p>}
                </div>
                
                {!address.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full rounded-xl text-xs h-9"
                  >
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
