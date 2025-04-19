export interface AlertState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  type: "success" | "error" | "warning" | "info";
}