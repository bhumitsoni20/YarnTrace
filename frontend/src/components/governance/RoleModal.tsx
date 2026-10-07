import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
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
import { RoleListItem } from "../../types/governance";

const createRoleSchema = z.object({
  name: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(2, "Role name must be at least 2 characters")),
  code: z
    .string()
    .transform((v) => v.trim().toUpperCase())
    .pipe(
      z
        .string()
        .min(2, "Role code must be at least 2 characters")
        .regex(
          /^[A-Z][A-Z0-9_]*$/,
          "Code must start with a letter, use uppercase letters, digits and underscores"
        )
    ),
  description: z.string().optional(),
});

const editRoleSchema = z.object({
  name: z
    .string()
    .transform((v) => v.trim())
    .pipe(z.string().min(2, "Role name must be at least 2 characters")),
  description: z.string().optional(),
});

export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;
export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CreateRoleFormValues | EditRoleFormValues) => Promise<void>;
  editingRole?: RoleListItem | null;
  isLoading: boolean;
}

export default function RoleModal({
  isOpen,
  onClose,
  onSubmit,
  editingRole,
  isLoading,
}: RoleModalProps) {
  const isEditing = Boolean(editingRole);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const schema = isEditing ? editRoleSchema : createRoleSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateRoleFormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSubmitError(null);
      if (editingRole) {
        reset({
          name: editingRole.name,
          code: editingRole.code,
          description: editingRole.description || "",
        });
      } else {
        reset({ name: "", code: "", description: "" });
      }
    }
  }, [editingRole, isOpen, reset]);

  const handleFormSubmit = async (values: CreateRoleFormValues) => {
    setSubmitError(null);
    try {
      if (isEditing) {
        await onSubmit({ name: values.name, description: values.description });
      } else {
        await onSubmit(values);
      }
      reset();
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      const errorsArr = axiosErr?.response?.data?.errors;
      const message = axiosErr?.response?.data?.message;
      if (errorsArr && errorsArr.length > 0) {
        setSubmitError(errorsArr.join(". "));
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
            <div className="p-2.5 rounded-xl bg-brand-100 text-brand-600 border border-brand-200 shrink-0">
              <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 font-heading">
                {isEditing ? "Edit Role" : "Create Custom Role"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {isEditing
                  ? `Update details for "${editingRole?.name}"`
                  : "Define a new role with a unique name and code. Permissions can be assigned after creation."}
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

        <form
          onSubmit={handleSubmit(handleFormSubmit as any)}
          className="space-y-4 pt-1"
        >
          {/* Name */}
          <div>
            <Label
              htmlFor="role-name"
              className="text-xs font-semibold text-slate-700 mb-1.5 block"
            >
              Role Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="role-name"
              placeholder="e.g. Floor Supervisor"
              {...register("name")}
              className="h-10 text-xs bg-slate-50/60 focus:bg-white font-medium"
            />
            {errors.name && (
              <p className="text-[11px] font-medium text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Code (create only) */}
          {!isEditing ? (
            <div>
              <Label
                htmlFor="role-code"
                className="text-xs font-semibold text-slate-700 mb-1.5 block"
              >
                Role Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="role-code"
                placeholder="e.g. FLOOR_SUPERVISOR"
                {...register("code")}
                className="h-10 text-xs bg-slate-50/60 focus:bg-white font-mono uppercase"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Uppercase letters, digits, underscores. Cannot be changed after creation.
              </p>
              {errors.code && (
                <p className="text-[11px] font-medium text-red-500 mt-1">
                  {errors.code.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                Role Code
              </Label>
              <div className="h-10 flex items-center px-3 rounded-lg border border-slate-200 bg-slate-100 text-xs font-mono font-medium text-slate-600">
                {editingRole?.code}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <Label
              htmlFor="role-description"
              className="text-xs font-semibold text-slate-700 mb-1.5 block"
            >
              Description
            </Label>
            <textarea
              id="role-description"
              placeholder="Brief description of this role's purpose..."
              {...register("description")}
              rows={2}
              className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-slate-50/60 focus:bg-white text-slate-800 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-10 px-5 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={isLoading}
              className="h-10 px-5 text-xs font-semibold gap-1.5 shadow-sm"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>
                {isEditing ? "Save Changes" : "Create Role"}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
