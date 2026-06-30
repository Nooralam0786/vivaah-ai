export default function SectionTitle({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) {
  return (
    <h3 className="flex items-center gap-2 font-bold text-neutral-900 mb-4">
      <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-700">
        <Icon className="w-4 h-4" />
      </span>
      {title}
    </h3>
  );
}
