interface PhotosTabProps {
  allPhotos: string[];
  imgIdx: number;
  onSelectImage: (index: number) => void;
}

export default function PhotosTab({ allPhotos, imgIdx, onSelectImage }: PhotosTabProps) {
  return (
    <div className="bg-white rounded-2xl border border-vivaah-border shadow-card p-5">
      <h2 className="text-sm font-bold text-neutral-900 mb-3">Photos</h2>
      {allPhotos.length === 0 ? (
        <div className="text-center py-10 text-neutral-400">
          <div className="text-4xl mb-2">📷</div>
          <p className="text-sm">No photos added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allPhotos.map((src, i) => (
            <div
              key={i}
              onClick={() => onSelectImage(i)}
              className={`aspect-square rounded-xl overflow-hidden cursor-pointer ring-2 transition-all ${
                i === imgIdx ? 'ring-primary-700' : 'ring-transparent hover:ring-primary-700/40'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
