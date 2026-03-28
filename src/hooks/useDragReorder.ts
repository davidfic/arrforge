import { useState, useRef, useCallback } from 'react';

interface DragState {
  dragIndex: number | null;
  overIndex: number | null;
}

export function useDragReorder<T>(items: T[], onReorder: (items: T[]) => void) {
  const [drag, setDrag] = useState<DragState>({ dragIndex: null, overIndex: null });
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const handleDragStart = useCallback((index: number) => (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    setDrag({ dragIndex: index, overIndex: null });
    draggingRef.current = true;
  }, []);

  const handleDragOver = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDrag((prev) => ({ ...prev, overIndex: index }));
  }, []);

  const handleDrop = useCallback((index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(fromIndex) || fromIndex === index) {
      setDrag({ dragIndex: null, overIndex: null });
      return;
    }
    const reordered = [...items];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(index, 0, moved);
    onReorder(reordered);
    setDrag({ dragIndex: null, overIndex: null });
    draggingRef.current = false;
  }, [items, onReorder]);

  const handleDragEnd = useCallback(() => {
    setDrag({ dragIndex: null, overIndex: null });
    draggingRef.current = false;
  }, []);

  const getDragProps = useCallback((index: number) => ({
    draggable: true,
    onDragStart: handleDragStart(index),
    onDragOver: handleDragOver(index),
    onDrop: handleDrop(index),
    onDragEnd: handleDragEnd,
  }), [handleDragStart, handleDragOver, handleDrop, handleDragEnd]);

  return { drag, getDragProps, containerRef };
}
