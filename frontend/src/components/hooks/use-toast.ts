import { toast as sonnerToast } from "sonner";

type ToastVariant = "success" | "destructive" | "error";

interface ToastProps {
  title: string;
  description?: string;
  variant?: ToastVariant;
}

export const toast = ({ title, description, variant }: ToastProps) => {
  if (variant === "success") {
    return sonnerToast.success(title);
  } else if (variant === "destructive" || variant === "error") {
    return sonnerToast.error(title);
  } else {
    return sonnerToast(title);
  }
};
