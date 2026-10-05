export default function VerificationHistory({
  history = [],
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-5">
        Verification History
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left p-3">
              Date
            </th>

            <th>Status</th>

            <th>Method</th>

          </tr>

        </thead>

        <tbody>

          {history.map((item) => (

            <tr
              key={item._id}
              className="border-b"
            >

              <td className="p-3">
                {item.date}
              </td>

              <td>{item.status}</td>

              <td>{item.method}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}