// Path: app/blog/[id]/page.tsx

"use client";

import { useParams } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  btnRed,
  card,
  CtaBand,
  display,
  PageHero,
  Spinner,
  StateBox,
} from "@/components/ui/prime";
import {
  MEDIA_BASE_URL,
  fetchBlogPost,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type BlogPost,
} from "@/lib/api";

export default function BlogPostPage() {
  const id = useParams<{ id: string }>()?.id;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);
      try {
        const { data } = await fetchBlogPost(id, { signal });
        setPost(data);
        setIsLoading(false);
      } catch (err) {
        if (isAbortError(err)) return;
        const e = err as ApiError;
        setLoadError(
          e.status === 404
            ? "This post doesn’t exist or was removed."
            : e.message || "We couldn’t load this post.",
        );
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const imageSrc = post ? resolveMediaUrl(post.image, MEDIA_BASE_URL) : "";
  const videoSrc = post ? resolveMediaUrl(post.video, MEDIA_BASE_URL) : "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero
          back={{ href: "/blog", label: "Back to blog" }}
          tagline={
            post
              ? new Date(post.created_at).toLocaleDateString("en-PH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : undefined
          }
          title={post?.title ?? "Blog"}
        />

        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {isLoading ? (
            <StateBox>
              <Spinner />
              <p className="mt-4 text-sm text-white/60">Loading post...</p>
            </StateBox>
          ) : loadError || !post ? (
            <StateBox>
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                Couldn&apos;t load this post
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
          ) : (
            <article className="space-y-10">
              {videoSrc ? (
                <div className={`overflow-hidden ${card}`}>
                  <video
                    src={videoSrc}
                    poster={imageSrc || undefined}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full"
                  />
                </div>
              ) : imageSrc ? (
                <div className={`overflow-hidden ${card}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt={post.title}
                    className="w-full object-cover"
                  />
                </div>
              ) : null}
              <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-white/80 sm:text-lg">
                {post.description}
              </p>
            </article>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
