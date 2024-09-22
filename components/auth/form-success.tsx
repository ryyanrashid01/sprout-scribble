import { CheckCircle } from "lucide-react";

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="bg-green-400 dark:bg-green-700 flex text-sm items-center gap-2 text-secondary-foreground p-3 my-4 rounded-md">
      <CheckCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
