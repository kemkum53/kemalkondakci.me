"use client";

import { useEffect, useRef, useId } from "react";
import { uploadImage } from "@/app/admin/posts/actions";

// TinyMCE script'ini (self-hosted) bir kez yükler.
let scriptPromise: Promise<void> | null = null;
function loadTinyMCE(): Promise<void> {
  if (typeof window !== "undefined" && (window as Window & { tinymce?: unknown }).tinymce) {
    return Promise.resolve();
  }
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "/tinymce/tinymce.min.js";
    s.referrerPolicy = "origin";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("TinyMCE yüklenemedi"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

type EditorProps = {
  value: string;
  onChange: (html: string) => void;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function RichTextEditor({ value, onChange }: EditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const editorRef = useRef<any>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const valueRef = useRef(value);
  valueRef.current = value;

  const id = "tmce-" + useId().replace(/[:]/g, "");

  useEffect(() => {
    let removed = false;

    loadTinyMCE().then(() => {
      const tinymce = (window as any).tinymce;
      if (removed || !tinymce || !ref.current) return;

      tinymce.init({
        target: ref.current,
        license_key: "gpl",
        base_url: "/tinymce",
        suffix: ".min",
        height: 480,
        menubar: false,
        branding: false,
        promotion: false,
        convert_urls: false,
        skin: "oxide-dark",
        content_css: "dark",
        plugins:
          "advlist autolink lists link image table code codesample media wordcount fullscreen preview searchreplace visualblocks charmap",
        toolbar:
          "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent | link image table codesample blockquote | removeformat code fullscreen",
        image_caption: true,
        // Görsel yükleme: dosyayı uploadImage server action'ına (→ backend) gönderir.
        images_upload_handler: (blobInfo: any) => {
          const form = new FormData();
          form.append("file", blobInfo.blob(), blobInfo.filename());
          return uploadImage(form);
        },
        setup: (editor: any) => {
          editorRef.current = editor;
          editor.on("init", () => editor.setContent(valueRef.current || ""));
          editor.on("change keyup undo redo SetContent", () => {
            onChangeRef.current(editor.getContent());
          });
        },
      });
    });

    return () => {
      removed = true;
      if (editorRef.current) {
        editorRef.current.remove();
        editorRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dışarıdan gelen value değişimini editöre yansıt (örn. taslak yükleme).
  useEffect(() => {
    const ed = editorRef.current;
    if (ed && ed.initialized && value !== ed.getContent()) {
      ed.setContent(value || "");
    }
  }, [value]);

  return <textarea ref={ref} id={id} defaultValue={value} style={{ visibility: "hidden" }} />;
}
