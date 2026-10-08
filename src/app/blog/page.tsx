// Path: app/blog/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  btnLine,
  btnRed,
  card,
  CtaBand,
  display,
  focus,
  PageHero,
  Spinner,
  StateBox,
} from "@/components/ui/prime";
import {
  MEDIA_BASE_URL,
  fetchBlogPosts,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the blog right now. Please refresh the page and try again.";

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function Media({ post, className }: { post: BlogPost; className: string }) {
  const img = resolveMediaUrl(post.image, MEDIA_BASE_URL);
  const vid = resolveMediaUrl(post.video, MEDIA_BASE_URL);
  return (
    <div className={`relative overflow-hidden bg-[#1E1E1E] ${className}`}>
      {img ? (
        <Image
          src={img}
          alt={post.title}
          width={1200}
          height={675}
          unoptimized
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : vid ? (
        <video
          src={`${vid}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-white/40">
          No media
        </div>
      )}
      {post.video && (
        <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-black/60 text-white">
          <Play size={16} className="ml-0.5 fill-white" />
        </span>
      )}
    </div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data } = await fetchBlogPosts({ signal });
      setPosts(data ?? []);
      setIsLoading(false);
    } catch (err) {
      if (isAbortError(err)) return;
      setLoadError((err as ApiError).message || DEFAULT_LOAD_ERROR);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero tagline="CAR TRADING" title="News from the lot">
          New arrivals, happy deliveries, and what&apos;s happening at
          Auto-Prime Car Trading.
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {isLoading ? (
            <StateBox>
              <Spinner />
              <p className="mt-6 text-white/60">Loading posts...</p>
            </StateBox>
          ) : loadError ? (
            <StateBox>
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                Couldn&apos;t load posts
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => load()}
                className={`${btnRed} mt-6`}
              >
                <RotateCcw size={15} />
                Try again
              </button>
            </StateBox>
          ) : !featured ? (
            <StateBox>
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                No posts yet
              </p>
              <p className="mt-2 text-sm text-white/50">
                Check back soon for new arrivals and updates.
              </p>
            </StateBox>
          ) : (
            <>
              <Link
                href={`/blog/${featured.id}`}
                className={`group grid overflow-hidden ${card} lg:grid-cols-[1.3fr_1fr] ${focus}`}
              >
                <Media
                  post={featured}
                  className="aspect-video lg:aspect-auto lg:min-h-[380px]"
                />
                <div className="flex flex-col justify-center p-6 sm:p-10">
                  <p className="text-sm text-[#E31B23]">
                    Latest story, {formatDate(featured.created_at)}
                  </p>
                  <h2
                    className={`${display} mt-4 line-clamp-3 text-2xl font-light uppercase leading-snug tracking-[0.1em] transition-colors group-hover:text-[#E31B23] sm:text-3xl`}
                  >
                    {featured.title}
                  </h2>
                  <p className="mt-5 line-clamp-4 text-base leading-7 text-white/60">
                    {featured.description}
                  </p>
                  <span className="mt-6 text-sm tracking-[0.12em] text-white underline decoration-[#E31B23] decoration-1 underline-offset-8">
                    Read the story
                  </span>
                </div>
              </Link>

              {rest.length > 0 && (
                <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className={`group flex h-full flex-col overflow-hidden ${card} transition-colors hover:border-[#E31B23] ${focus}`}
                    >
                      <Media post={post} className="aspect-video" />
                      <div className="flex flex-1 flex-col p-5 sm:p-6">
                        <p className="text-sm text-white/50">
                          {formatDate(post.created_at)}
                        </p>
                        <h3
                          className={`${display} mt-2 line-clamp-2 text-lg font-light uppercase leading-snug tracking-[0.1em]`}
                        >
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/60">
                          {post.description}
                        </p>
                        <span className="mt-auto pt-6 text-sm tracking-[0.12em] text-[#E31B23]">
                          Read more
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
