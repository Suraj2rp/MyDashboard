export default function StatCard({ title, value }) {
  return (
    <div className="p-4 bg-white shadow rounded-lg text-center">
      <h2 className="text-sm font-semibold text-gray-500">{title}</h2>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
