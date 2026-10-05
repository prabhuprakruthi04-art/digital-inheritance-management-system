import {
  ShieldCheck,
  FilePlus,
  UserPlus,
  HeartPulse,
} from "lucide-react";

const activities = [
  {
    title: "New Asset Added",
    desc: "Crypto Wallet added successfully",
    icon: <FilePlus size={18} />,
  },
  {
    title: "Nominee Added",
    desc: "Rahul assigned as nominee",
    icon: <UserPlus size={18} />,
  },
  {
    title: "Heartbeat Verified",
    desc: "Alive verification completed",
    icon: <HeartPulse size={18} />,
  },
  {
    title: "Encryption Complete",
    desc: "Files encrypted successfully",
    icon: <ShieldCheck size={18} />,
  },
];

export default function ActivityTimeline() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-xl font-semibold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((item, index) => (

          <div
            key={index}
            className="flex gap-4 items-start"
          >

            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
              {item.icon}
            </div>

            <div>

              <h3 className="font-semibold">
                {item.title}
              </h3>

              <p className="text-gray-500 text-sm">
                {item.desc}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}