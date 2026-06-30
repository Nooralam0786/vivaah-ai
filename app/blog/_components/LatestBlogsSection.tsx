import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "./shared";
import { LATEST_BLOGS, type BlogPost } from "./constants";

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-[0_12px_32px_rgba(107,27,61,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-36 sm:h-40 w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p className="text-xs text-neutral-400 mb-1.5">{post.date}</p>
        <h3 className="text-sm font-bold text-neutral-900 mb-3 leading-snug">{post.title}</h3>
        <Link
          href="#"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors"
        >
          Read More
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function LatestBlogsSection() {
  return (
    <section className="pb-16 sm:pb-20">
      <div className="container-safe">
        <div className="flex items-end sm:items-center justify-between mb-8 gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900">Latest Blogs</h2>
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#6B1B3D] hover:text-[#D4AF37] transition-colors whitespace-nowrap"
          >
            View all blogs
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LATEST_BLOGS.map((post) => (
            <BlogCard key={post.title} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
