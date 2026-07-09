"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera, User, Phone, Calendar, Dumbbell, AlignLeft, Scale, Ruler, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().optional().nullable().or(z.literal("")),
  bio: z.string().max(500, "Bio must be under 500 characters.").optional().nullable().or(z.literal("")),
  gender: z.string().optional().nullable().or(z.literal("")),
  dateOfBirth: z.string().optional().nullable().or(z.literal("")),
  height: z.string().refine((val) => val === "" || !isNaN(Number(val)), "Height must be a valid number").optional().nullable(),
  weight: z.string().refine((val) => val === "" || !isNaN(Number(val)), "Weight must be a valid number").optional().nullable(),
  fitnessGoal: z.string().optional().nullable().or(z.literal("")),
  avatarUrl: z.string().optional().nullable().or(z.literal("")),
});

type ProfileValues = z.infer<typeof profileSchema>;

const selectClassName = "flex h-11 w-full appearance-none rounded-xl border border-input bg-card px-3 py-2 pr-10 text-sm shadow-sm transition-all focus:border-brand focus:ring-1 focus:ring-brand outline-none cursor-pointer bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23708090%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20class%3D%22lucide%20lucide-chevron-down%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[position:right_12px_center] bg-no-repeat dark:bg-card";

// Date arrays
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
const YEARS = Array.from({ length: 100 }, (_, i) => String(new Date().getFullYear() - i));

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const supabase = createClient();

  // Date of birth parts states
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      bio: "",
      gender: "",
      dateOfBirth: "",
      height: "",
      weight: "",
      fitnessGoal: "",
      avatarUrl: "",
    },
  });

  // Manually register Date of Birth field
  useEffect(() => {
    register("dateOfBirth");
  }, [register]);

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        setUserEmail(user.email || "");

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error && error.code !== "PGRST116") throw error;
        
        if (data) {
          setAvatarUrl(data.avatar_url);
          
          // Parse date of birth if it exists
          if (data.date_of_birth) {
            const [y, m, d] = data.date_of_birth.split("-");
            setDobYear(y || "");
            setDobMonth(m || "");
            setDobDay(d || "");
          } else {
            setDobYear("");
            setDobMonth("");
            setDobDay("");
          }

          reset({
            fullName: data.full_name || "",
            phone: data.phone || "",
            bio: data.bio || "",
            gender: data.gender || "",
            dateOfBirth: data.date_of_birth || "",
            height: data.height !== null && data.height !== undefined ? String(data.height) : "",
            weight: data.weight !== null && data.weight !== undefined ? String(data.weight) : "",
            fitnessGoal: data.fitness_goal || "",
            avatarUrl: data.avatar_url || "",
          });
        }
      } catch (err: any) {
        toast.error("Failed to load profile details: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [supabase, reset]);

  const handleDateChange = (type: "day" | "month" | "year", value: string) => {
    let d = dobDay;
    let m = dobMonth;
    let y = dobYear;
    
    if (type === "day") {
      d = value;
      setDobDay(value);
    } else if (type === "month") {
      m = value;
      setDobMonth(value);
    } else if (type === "year") {
      y = value;
      setDobYear(value);
    }

    if (d && m && y) {
      const dateStr = `${y}-${m}-${d}`;
      setValue("dateOfBirth", dateStr, { shouldDirty: true });
    } else {
      setValue("dateOfBirth", "", { shouldDirty: true });
    }
  };

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be under 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Delete old avatar from storage first if it exists
      if (avatarUrl) {
        const match = avatarUrl.match(/avatars\/(.+)$/);
        if (match && match[1]) {
          const oldPath = match[1];
          await supabase.storage.from("avatars").remove([oldPath]);
        }
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      setValue("avatarUrl", publicUrl, { shouldDirty: true });
      toast.success("Profile photo uploaded successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const match = avatarUrl.match(/avatars\/(.+)$/);
      if (match && match[1]) {
        const oldPath = match[1];
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      setAvatarUrl(null);
      setValue("avatarUrl", null, { shouldDirty: true });
      toast.success("Profile photo removed");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove photo");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProfileValues) => {
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          phone: data.phone || null,
          bio: data.bio || null,
          gender: data.gender || null,
          date_of_birth: data.dateOfBirth || null,
          height: data.height ? parseFloat(data.height) : null,
          weight: data.weight ? parseFloat(data.weight) : null,
          fitness_goal: data.fitnessGoal || null,
          avatar_url: avatarUrl || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      reset(data); // reset dirty state
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your profile details, training targets, and preferences.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left Column: Avatar upload */}
        <Card className="md:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
            <CardDescription>
              Upload a high-quality square picture. Max 2MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-2 border-border shadow-inner">
                <AvatarImage src={avatarUrl || ""} alt="Avatar preview" />
                <AvatarFallback className="bg-brand/10 text-brand text-3xl font-bold">
                  {getInitials(userEmail || "U")}
                </AvatarFallback>
              </Avatar>
              
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-xs">
                  <Loader2 className="h-8 w-8 text-brand animate-spin" />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 w-full">
              <div className="relative flex items-center justify-center">
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAvatar}
                  disabled={isUploading || isLoading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  className="w-full rounded-xl gap-2 cursor-pointer"
                  disabled={isUploading || isLoading}
                >
                  <Camera className="h-4 w-4 text-brand" />
                  Change Photo
                </Button>
              </div>

              {avatarUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleRemoveAvatar}
                  className="w-full rounded-xl gap-2 text-destructive hover:bg-destructive/10"
                  disabled={isUploading || isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Photo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Detailed form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Provide your details below to tailor your Gym Nation experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <User className="h-3.5 w-3.5" /> Full Name
                  </Label>
                  <Input
                    id="fullName"
                    placeholder="Marcus Johnson"
                    className="h-11 rounded-xl"
                    {...register("fullName")}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" /> Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="h-11 rounded-xl"
                    {...register("phone")}
                    disabled={isLoading}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Gender
                  </Label>
                  <div className="relative">
                    <select
                      id="gender"
                      className={selectClassName}
                      {...register("gender")}
                      disabled={isLoading}
                    >
                      <option value="" disabled className="dark:bg-card">Select gender</option>
                      <option value="Male" className="dark:bg-card">Male</option>
                      <option value="Female" className="dark:bg-card">Female</option>
                    </select>
                  </div>
                  {errors.gender && (
                    <p className="text-xs text-destructive">{errors.gender.message}</p>
                  )}
                </div>

                {/* Date of Birth (Dropdown date list) */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" /> Date of Birth
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Day Select */}
                    <select
                      value={dobDay}
                      onChange={(e) => handleDateChange("day", e.target.value)}
                      className={selectClassName}
                      disabled={isLoading}
                    >
                      <option value="" disabled className="dark:bg-card">Day</option>
                      {DAYS.map((d) => (
                        <option key={d} value={d} className="dark:bg-card">{d}</option>
                      ))}
                    </select>

                    {/* Month Select */}
                    <select
                      value={dobMonth}
                      onChange={(e) => handleDateChange("month", e.target.value)}
                      className={selectClassName}
                      disabled={isLoading}
                    >
                      <option value="" disabled className="dark:bg-card">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value} className="dark:bg-card">{m.label}</option>
                      ))}
                    </select>

                    {/* Year Select */}
                    <select
                      value={dobYear}
                      onChange={(e) => handleDateChange("year", e.target.value)}
                      className={selectClassName}
                      disabled={isLoading}
                    >
                      <option value="" disabled className="dark:bg-card">Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y} className="dark:bg-card">{y}</option>
                      ))}
                    </select>
                  </div>
                  {errors.dateOfBirth && (
                    <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                {/* Height (no arrows) */}
                <div className="space-y-2">
                  <Label htmlFor="height" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Ruler className="h-3.5 w-3.5" /> Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="180"
                    className="h-11 rounded-xl no-spinner"
                    {...register("height")}
                    disabled={isLoading}
                  />
                  {errors.height && (
                    <p className="text-xs text-destructive">{errors.height.message}</p>
                  )}
                </div>

                {/* Weight (no arrows) */}
                <div className="space-y-2">
                  <Label htmlFor="weight" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Scale className="h-3.5 w-3.5" /> Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="80"
                    className="h-11 rounded-xl no-spinner"
                    {...register("weight")}
                    disabled={isLoading}
                  />
                  {errors.weight && (
                    <p className="text-xs text-destructive">{errors.weight.message}</p>
                  )}
                </div>
              </div>

              {/* Fitness Goal */}
              <div className="space-y-2">
                <Label htmlFor="fitnessGoal" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Dumbbell className="h-3.5 w-3.5" /> Fitness Goal
                </Label>
                <div className="relative">
                  <select
                    id="fitnessGoal"
                    className={selectClassName}
                    {...register("fitnessGoal")}
                    disabled={isLoading}
                  >
                    <option value="" disabled className="dark:bg-card">Select your primary fitness goal</option>
                    <option value="Muscle Building" className="dark:bg-card">Muscle Building (Hypertrophy)</option>
                    <option value="Fat Loss" className="dark:bg-card">Fat Loss / Definition</option>
                    <option value="Strength" className="dark:bg-card">Increase Strength (Powerlifting)</option>
                    <option value="Endurance" className="dark:bg-card">Improve Endurance / Conditioning</option>
                    <option value="General Fitness" className="dark:bg-card">General Health & Fitness</option>
                    <option value="Athletic Performance" className="dark:bg-card">Athletic Performance / Agility</option>
                  </select>
                </div>
                {errors.fitnessGoal && (
                  <p className="text-xs text-destructive">{errors.fitnessGoal.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <AlignLeft className="h-3.5 w-3.5" /> About Me / Bio
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Share a bit about your fitness journey, preferences, or personal targets..."
                  className="rounded-xl min-h-24 resize-none"
                  {...register("bio")}
                  disabled={isLoading}
                />
                {errors.bio && (
                  <p className="text-xs text-destructive">{errors.bio.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={!isDirty || isLoading || isUploading}
                  className="h-11 rounded-xl bg-brand hover:bg-brand-light text-brand-foreground font-semibold px-6 cursor-pointer"
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
