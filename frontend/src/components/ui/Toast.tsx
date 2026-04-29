type ToastType = "success" | "error" | "warning";

export default function Toast({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: ToastType;
  onClose: () => void;
}) {
  const styles: Record<ToastType, string> = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };

  return (
    <div className="fixed top-6 right-6 z-50 max-w-md">
      <div className={`border rounded-xl shadow-lg px-4 py-3 ${styles[type]}`}>
        <div className="flex items-start gap-3">
          <p className="text-sm font-medium whitespace-pre-line">{message}</p>
          <button
            type="button"
            className="ml-auto text-xs font-semibold opacity-70 hover:opacity-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
