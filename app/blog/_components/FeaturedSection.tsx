import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "./shared";
import { CATEGORIES, type Category } from "./constants";

function CategoryPill({ category }: { category: Category }) {
  return (
    <button
      type="button"
      className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-neutral-200 hover:border-[#6B1B3D] hover:bg-[#6B1B3D]/5 transition-colors text-left"
    >
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#6B1B3D]/10 text-[#6B1B3D] flex items-center justify-center group-hover:bg-[#6B1B3D] group-hover:text-white transition-colors">
        {category.icon}
      </span>
      <span className="text-xs sm:text-sm font-semibold text-neutral-700 group-hover:text-[#6B1B3D]">
        {category.label}
      </span>
    </button>
  );
}

export default function FeaturedSection() {
  return (
    <section className="relative z-20 px-4 sm:px-6 -mt-10 sm:-mt-14 md:-mt-16 pb-16 sm:pb-20">
      <div className="mx-auto max-w-6xl bg-white rounded-2xl shadow-xl border border-neutral-100 p-5 sm:p-7 grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6 md:gap-8">
        {/* Featured Post */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-44 h-40 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden">
            <Image src="/Images/sucess story.png" alt="Featured post" fill className="object-cover" />
            <span className="absolute top-2 left-2 bg-[#6B1B3D] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              Featured Post
            </span>
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 leading-snug">
              How AI is Transforming Modern Matchmaking
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed mb-3">
              Discover how artificial intelligence helps you find deeper, more meaningful connections.
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors w-fit"
            >
              Read More
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div className="border-t md:border-t-0 md:border-l border-neutral-100 pt-5 md:pt-0 md:pl-8">
          <h3 className="text-sm font-bold text-neutral-900 mb-3">Categories</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map((c) => (
              <CategoryPill key={c.label} category={c} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
