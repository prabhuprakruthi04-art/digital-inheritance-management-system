import { UploadCloud } from "lucide-react";

export default function FileUpload({
  file,
  onFileChange,
}) {
  return (
    <div>
      <label className="block mb-2 font-medium text-gray-700">
        Upload File
      </label>

      <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50">

        <UploadCloud size={40} className="text-indigo-600" />

        <p className="mt-3 text-gray-600">
          Click to upload a file
        </p>

        <input
          type="file"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files[0])}
        />
      </label>

      {file && (
        <div className="mt-3 bg-green-100 text-green-700 rounded-lg p-3">
          Selected File: <strong>{file.name}</strong>
        </div>
      )}
    </div>
  );
}