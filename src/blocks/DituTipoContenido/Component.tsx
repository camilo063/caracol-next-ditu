import {
  DituTipoContenidoBlock,
  type DituTipoContenidoProps,
} from "@/components/marketing/ditu-tipo-contenido";
import type { DituTipoContenidoBlockProps } from "../types";

export function DituTipoContenidoBlockComponent(block: DituTipoContenidoBlockProps) {
  const tabs: DituTipoContenidoProps["tabs"] =
    block.tabs && block.tabs.length > 0
      ? block.tabs.map((t) => ({ label: t.label, description: t.description ?? "" }))
      : undefined;

  return <DituTipoContenidoBlock anchorId={block.anchorId ?? undefined} tabs={tabs} />;
}
