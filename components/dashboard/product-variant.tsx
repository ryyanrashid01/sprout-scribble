"use client";

import { VariantsWithImagesTags } from "@/lib/infer-types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VariantSchema } from "@/types/new-variant-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputTags } from "./input-tags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { addVariant } from "@/server/actions/add-variant";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { deleteVariant } from "@/server/actions/delete-variant";
import { DeleteAlertDialog } from "./delete-alert-dialog";
import { LoaderCircle } from "lucide-react";

export const ProductVariant = ({
  editMode,
  productId,
  variant,
  children,
}: {
  editMode: boolean;
  productId: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) => {
  let loadingToastId: number | string;
  const [open, setOpen] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000",
      editMode: editMode,
      id: undefined,
      productId: productId,
      productType: "",
    },
  });

  const setEdit = () => {
    if (!editMode) {
      form.reset();
      return;
    }
    if (editMode && variant) {
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productId", productId);
      form.setValue("productType", variant.productType);
      form.setValue("color", variant.color);
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      form.setValue(
        "variantImages",
        variant.variantImages.map((image) => ({
          name: image.name,
          size: image.size,
          url: image.url,
        }))
      );
    }
  };

  useEffect(() => {
    setEdit();
  }, [editMode]);

  const { execute, status } = useAction(addVariant, {
    onExecute() {
      loadingToastId = toast.loading("Updating variants");
    },
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success, { id: loadingToastId });
      }
      if (data.data?.error) {
        toast.error(data.data.error, { id: loadingToastId });
      }
      form.reset();
      setOpen(false);
    },
  });

  const deleteVariantAction = useAction(deleteVariant, {
    onExecute() {
      loadingToastId = toast.loading("Removing variant");
    },
    onSuccess(data) {
      if (data.data?.success) {
        toast.success(data.data.success, { id: loadingToastId });
      }
      if (data.data?.error) {
        toast.error(data.data.error, { id: loadingToastId });
      }
      setOpen(false);
    },
  });

  const handleDelete = () => {
    if (variant) deleteVariantAction.execute({ id: variant.id });
    setOpenDeleteAlert(false);
  };

  const handleCopy = () => {
    if (variant) {
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
    }
  };

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    execute(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="max-w-3xl overflow-y-scroll max-h-[680px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              {editMode ? "Edit" : "Add new"} variant
            </DialogTitle>
            <DialogDescription className="text-center">
              Manage your product variants here. You can add tags, images, and
              more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pick a title for your variant"
                        disabled={status === "executing"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input
                        type="color"
                        {...field}
                        disabled={status === "executing"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Tags</FormLabel>
                    <FormControl>
                      <InputTags
                        {...field}
                        onChange={(e) => field.onChange(e)}
                        disabled={status === "executing"}
                        variant={variant}
                        handleCopy={handleCopy}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex justify-center gap-14">
                {editMode && variant && (
                  <Button
                    type="button"
                    className={cn(
                      "flex-1 shrink-0",
                      status === "executing"
                        ? "animate-pulse cursor-not-allowed"
                        : ""
                    )}
                    variant={"destructive"}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenDeleteAlert(true);
                    }}
                    disabled={
                      status === "executing" ||
                      deleteVariantAction.status === "executing"
                    }
                  >
                    {deleteVariantAction.status === "executing" ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      "Delete Variant"
                    )}
                  </Button>
                )}
                <Button
                  type="submit"
                  className={cn(
                    "w-full flex-1",
                    status === "executing"
                      ? "animate-pulse cursor-not-allowed"
                      : ""
                  )}
                  disabled={
                    status === "executing" ||
                    !form.formState.isValid ||
                    !form.formState.isDirty
                  }
                >
                  {status === "executing" ? (
                    <LoaderCircle className="animate-spin" />
                  ) : editMode ? (
                    "Update Variant"
                  ) : (
                    "Add Variant"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <DeleteAlertDialog
        open={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        onDelete={handleDelete}
        item={variant?.productType}
      />
    </>
  );
};
