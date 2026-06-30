export default function ChatVisual() {
  return (
    <div className="w-full rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm space-y-1.5">
      <div className="flex justify-start">
        <span className="text-[8px] bg-neutral-100 text-neutral-700 px-2 py-1 rounded-lg rounded-bl-none max-w-[88%] leading-snug">
          Hi! I liked your profile.
        </span>
      </div>
      <div className="flex justify-end">
        <span className="text-[8px] bg-[#6B1B3D] text-white px-2 py-1 rounded-lg rounded-br-none max-w-[88%] leading-snug">
          Thank you! Nice to meet you too.
        </span>
      </div>
    </div>
  );
}
