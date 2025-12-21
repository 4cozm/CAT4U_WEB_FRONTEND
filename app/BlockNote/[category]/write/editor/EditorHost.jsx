"use client";
import dynamic from "next/dynamic";
import React, { forwardRef } from "react";

// 에디터 본체를 클라이언트에서만 로드
const EditorInner = dynamic(() => import("../../../EditorInner"), { ssr: false });

const EditorHost = forwardRef(function EditorHost(props, ref) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <EditorInner ref={ref} {...props} />;
});

export default EditorHost;
