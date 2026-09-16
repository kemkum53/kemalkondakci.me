"use client";

import { useEffect, useRef, useState } from "react";

type WithId = { id: string };

export type DragRowProps = {
  draggable: boolean;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent) => void;
  "data-dragging": boolean;
};

/**
 * Tablo satırları için bağımlılıksız sürükle-bırak sıralama.
 * Sürüklerken listeyi canlı yeniden dizer; bırakınca yeni id sırasını commit eder.
 * enabled false ise (ör. arama filtresi açık) sürükleme kapanır.
 */
export function useRowDragSort<T extends WithId>(
  items: T[],
  enabled: boolean,
  onCommit: (ids: string[]) => void
) {
  const [order, setOrder] = useState<T[]>(items);
  const dragId = useRef<string | null>(null);
  const movedDuringDrag = useRef(false);

  // Dışarıdan gelen liste değişince (kaydet, revalidate) yerel sırayı tazele,
  // ama aktif bir sürükleme varken üzerine yazma.
  useEffect(() => {
    if (dragId.current === null) {
      setOrder(items);
    }
  }, [items]);

  function move(fromId: string, toId: string) {
    if (fromId === toId) return;
    setOrder((prev) => {
      const from = prev.findIndex((x) => x.id === fromId);
      const to = prev.findIndex((x) => x.id === toId);
      if (from === -1 || to === -1) return prev;
      const next = [...prev];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });
    movedDuringDrag.current = true;
  }

  function rowProps(id: string): DragRowProps {
    return {
      draggable: enabled,
      "data-dragging": dragId.current === id,
      onDragStart: (e) => {
        dragId.current = id;
        movedDuringDrag.current = false;
        e.dataTransfer.effectAllowed = "move";
        // Firefox sürüklemeyi başlatmak için veri ister.
        e.dataTransfer.setData("text/plain", id);
      },
      onDragEnter: (e) => {
        e.preventDefault();
        if (dragId.current) move(dragId.current, id);
      },
      onDragOver: (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      },
      onDrop: (e) => e.preventDefault(),
      onDragEnd: () => {
        const changed = movedDuringDrag.current;
        dragId.current = null;
        movedDuringDrag.current = false;
        if (changed) {
          setOrder((current) => {
            onCommit(current.map((x) => x.id));
            return current;
          });
        }
      },
    };
  }

  return { order, rowProps, dragging: dragId.current !== null };
}
