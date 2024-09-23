import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <LoaderCircle className="animate-spin w-12 h-12" />
      <p className="mt-4 text-gray-600">Loading, please wait...</p>
    </div>
  );
}
