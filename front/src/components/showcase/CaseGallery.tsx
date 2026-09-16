"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { GalleryImage } from "@/lib/projects";
import { SHOWCASE_COMMON } from "@/lib/showcase";
import type { Lang } from "@/lib/translations";
import styles from "@/app/showcase/showcase.module.css";

type Props = {
  images: GalleryImage[];
  lang: Lang;
  projectName: string;
  /** Alan vurgu rengi; portal body altına taşındığı için değişken tekrar veriliyor. */
  accent: string;
};

function captionOf(image: GalleryImage, lang: Lang): string {
  return lang === "tr" ? image.captionTr : image.captionEn;
}

export default function CaseGallery({ images, lang, projectName, accent }: Props) {
  const copy = SHOWCASE_COMMON[lang];
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        const next = current + delta;
        return next < 0 || next >= images.length ? current : next;
      });
    },
    [images.length]
  );

  // Esc kapatır, ok tuşları görseller arasında gezer. Zemine tıklamak kapatmaz.
  useEffect(() => {
    if (openIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight") {
        step(1);
      } else if (e.key === "ArrowLeft") {
        step(-1);
      }
    };

    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [openIndex, close, step]);

  if (images.length === 0) return null;

  const active = openIndex === null ? null : images[openIndex];

  return (
    <>
      <p className={styles.metaLabel}>{copy.gallery}</p>
      <div className={styles.gallery}>
        {images.map((image, i) => {
          const caption = captionOf(image, lang);
          return (
            <button
              key={`${image.url}-${i}`}
              type="button"
              className={styles.thumbButton}
              onClick={(e) => {
                openerRef.current = e.currentTarget;
                setOpenIndex(i);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt={caption || `${projectName} ${i + 1}`}
                loading="lazy"
                className={styles.thumb}
              />
              {caption && <span className={styles.thumbCaption}>{caption}</span>}
            </button>
          );
        })}
      </div>

      {active &&
        createPortal(
          // Sayfadaki transform'lar position:fixed'i kırdığı için body'ye taşınıyor.
          <div
            className={`ktn-scope ${styles.lightbox}`}
            style={{ ["--accent" as string]: accent }}
            role="dialog"
            aria-modal="true"
            aria-label={captionOf(active, lang) || projectName}
          >
            <div className={styles.lightboxBar}>
              <span className={styles.lightboxCount}>
                {(openIndex ?? 0) + 1} / {images.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                className={styles.iconButton}
                onClick={close}
              >
                {copy.close} ✕
              </button>
            </div>

            <figure className={styles.lightboxFigure}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.url}
                alt={captionOf(active, lang) || projectName}
                className={styles.lightboxImage}
              />
            </figure>

            <div>
              {captionOf(active, lang) && (
                <p className={styles.lightboxCaption}>{captionOf(active, lang)}</p>
              )}
              {images.length > 1 && (
                <div className={styles.lightboxNav}>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => step(-1)}
                    disabled={openIndex === 0}
                    aria-label={copy.previous}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    onClick={() => step(1)}
                    disabled={openIndex === images.length - 1}
                    aria-label={copy.next}
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
