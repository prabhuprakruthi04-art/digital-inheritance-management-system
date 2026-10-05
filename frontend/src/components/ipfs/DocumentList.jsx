import FileCard from "./FileCard";

export default function DocumentList({
  documents,
  loading,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading documents...
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="py-10 text-center border rounded-xl bg-gray-50">
        <p className="text-gray-500">
          No documents uploaded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {documents.map((document) => (
        <FileCard
          key={document._id}
          document={document}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}