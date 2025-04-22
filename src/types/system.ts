export interface AlertState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  type: "success" | "error" | "warning" | "info";
}

export interface ConfirmModalState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  onConfirm: () => void;
}
