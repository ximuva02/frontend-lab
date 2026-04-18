import { useEffect, useState } from "../runtime.js";

export function useEditorStore(editorStore) {
  const [snapshot, setSnapshot] = useState(editorStore.getSnapshot());

  useEffect(() => editorStore.subscribe(setSnapshot), [editorStore]);

  return snapshot;
}
