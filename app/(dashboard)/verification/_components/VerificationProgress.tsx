export default function VerificationProgress({ stepsCompleted }: { stepsCompleted: number }) {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-neutral-700">Progress</span>
        <span className="text-sm font-bold text-primary-700">{stepsCompleted} / 3 steps</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-gradient rounded-full transition-all duration-500"
          style={{ width: `${(stepsCompleted / 3) * 100}%` }}
        />
      </div>
    </div>
  );
}
