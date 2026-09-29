import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Party } from "../../types/inventory";

const partySchema = z.object({
  code: z
    .string()
    .transform((v) => v.trim())
    .pipe(
      z
        .string()
        .min(2, "Party code must be at least 2 characters")
        .regex(/^[A-Za-z0-9_\-]+$/, "Party code must contain only letters, numbers, hyphens, or underscores")
    ),
  name: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(2, "Party name must be at least 2 characters")),
  type: z.enum(["SUPPLIER", "CUSTOMER", "DYEING_MILL", "JOB_WORKER", "INTERNAL"]),
  contactPerson: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === "") return true;
        const trimmed = val.trim();
        if (!/^[+]?[\d\s\-()]+$/.test(trimmed)) return false;
        const digitCount = trimmed.replace(/\D/g, "").length;
        return digitCount >= 7 && digitCount <= 12;
      },
      { message: "Phone number must have 7–12 digits" }
    ),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
});

export type PartyFormValues = z.infer<typeof partySchema>;

interface PartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PartyFormValues) => Promise<void>;
  editingParty?: Party | null;
  isLoading: boolean;
}

export default function PartyModal({
  isOpen,
  onClose,
  onSubmit,
  editingParty,
  isLoading,
}: PartyModalProps) {
  const isEditing = Boolean(editingParty);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      code: "",
      name: "",
      type: "SUPPLIER",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      if (editingParty) {
        reset({
          code: editingParty.code,
          name: editingParty.name,
          type: editingParty.type as "SUPPLIER" | "CUSTOMER" | "DYEING_MILL" | "JOB_WORKER" | "INTERNAL",
          contactPerson: editingParty.contactPerson || "",
          email: editingParty.email || "",
          phone: editingParty.phone || "",
          address: editingParty.address || "",
          gstNumber: editingParty.gstNumber || "",
        });
      } else {
        reset({
          code: "",
          name: "",
          type: "SUPPLIER",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          gstNumber: "",
        });
      }
    }
  }, [editingParty, isOpen, reset]);

  const handleFormSubmit = async (values: PartyFormValues) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
      reset();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; errors?: string[] } } };
      const errors = axiosErr?.response?.data?.errors;
      const message = axiosErr?.response?.data?.message;
      if (errors && errors.length > 0) {
        setSubmitError(errors.join(". "));
      } else if (message) {
        setSubmitError(message);
      } else {
        setSubmitError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    setSubmitError(null);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 border border-orange-200 shrink-0">
              <Building2 className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
                {isEditing ? "Edit Commercial Partner" : "Add Commercial Partner"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {isEditing
                  ? `Update master records for ${editingParty?.name}`
                  : "Register a new spinning mill, dyeing house, customer, or job worker in Party Master."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {submitError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
            <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Party Code */}
            <div>
              <Label htmlFor="party-code" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Party Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="party-code"
                placeholder="e.g. VARDHMAN, TRIDENT"
                {...register("code")}
                disabled={isEditing}
                className="h-10 text-xs font-mono uppercase bg-slate-50/60 focus:bg-white font-medium"
              />
              {errors.code && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.code.message}</p>
              )}
            </div>

            {/* Party Type */}
            <div>
              <Label htmlFor="party-type" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Partner Type <span className="text-red-500">*</span>
              </Label>
              <select
                id="party-type"
                {...register("type")}
                className="w-full text-xs h-10 px-3 rounded-lg border border-slate-300 bg-slate-50/60 hover:bg-slate-50 focus:bg-white text-slate-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm"
              >
                <option value="SUPPLIER">Spinning Mill / Supplier</option>
                <option value="CUSTOMER">Customer / Export Buyer</option>
                <option value="DYEING_MILL">Dyeing & Processing Unit</option>
                <option value="JOB_WORKER">Job Worker / Subcontractor</option>
                <option value="INTERNAL">Internal Unit / Mill Stage</option>
              </select>
              {errors.type && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>

          {/* Party Name */}
          <div>
            <Label htmlFor="party-name" className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Company / Legal Entity Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="party-name"
              placeholder="e.g. Vardhman Textiles Ltd"
              {...register("name")}
              className="h-10 text-xs bg-slate-50/60 focus:bg-white font-medium"
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Person */}
            <div>
              <Label htmlFor="contact-person" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Contact Person
              </Label>
              <Input
                id="contact-person"
                placeholder="e.g. Rajesh Sharma"
                {...register("contactPerson")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="party-phone" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Phone / Mobile Number
              </Label>
              <Input
                id="party-phone"
                placeholder="e.g. +91 98123 45678"
                {...register("phone")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white font-mono"
              />
              {errors.phone && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <Label htmlFor="party-email" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Email Address
              </Label>
              <Input
                id="party-email"
                type="email"
                placeholder="e.g. sales@vardhman.com"
                {...register("email")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white"
              />
              {errors.email && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* GST Number */}
            <div>
              <Label htmlFor="party-gst" className="text-xs font-semibold text-slate-700 mb-1.5 block">
                GST / Tax Registration No
              </Label>
              <Input
                id="party-gst"
                placeholder="e.g. 03AABCV1234F1Z5"
                {...register("gstNumber")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white font-mono uppercase"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="party-address" className="text-xs font-semibold text-slate-700 mb-1.5 block">
              Office / Mill Address
            </Label>
            <Input
              id="party-address"
              placeholder="e.g. Chandigarh Road, Ludhiana, Punjab - 141010"
              {...register("address")}
              className="h-10 text-xs bg-slate-50/60 focus:bg-white"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button variant="outline" type="button" onClick={handleCancel} disabled={isLoading} className="h-10 px-5 text-xs font-semibold">
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading} className="h-10 px-5 text-xs font-semibold gap-1.5 shadow-sm">
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{isEditing ? "Save Changes" : "Register Partner"}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

