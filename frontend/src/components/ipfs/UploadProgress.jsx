export default function UploadProgress({ progress }) {
  return (
    <div className="mt-5">
      <div className="flex justify-between mb-2 text-sm">
        <span className="text-gray-600">Uploading document...</span>
        <span className="font-medium">{progress}%</span>
      </div>

      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}