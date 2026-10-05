import { Lock } from "lucide-react";

export default function EncryptionToggle({
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 bg-gray-50">

      <div className="flex items-center gap-3">

        <Lock className="text-indigo-600" />

        <div>
          <h3 className="font-semibold">
            Encrypt Sensitive Information
          </h3>

          <p className="text-sm text-gray-500">
            Encrypt data before storing on IPFS.
          </p>
        </div>

      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5"
      />
    </div>
  );
}