import { default as React, useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import MediaAdapter from "./medialib/adapter";
import MediaComponent from "./medialib/component";
import plugins from "./plugins";
import { uid } from "uid";

const Editor = ({ onChange, name, value }) => {
  const ref = useRef(null);
  const id = useRef(uid());
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const blockIndex = useRef(-1);

  useEffect(() => {
    if (!ref?.current) {
      initEditor();
    }
    return () => {
      ref?.current?.destroy();
      ref.current = null;
    };
  }, []);

  const customImageTool = {
    mediaLib: {
      class: MediaAdapter,
      config: {
        setIsMediaOpen,
      },
    },
  };

  const initEditor = () => {
    const editor = new EditorJS({
      holder: id.current,
      logLevel: "ERROR",
      data: value && JSON.parse(value).blocks.length && JSON.parse(value),
      onReady: () => {
        ref.current = editor;
        document.querySelector("[data-item-name='image']")?.remove();
      },
      async onChange(api, event) {
        if (
          Array.isArray(event) &&
          event.find((e) => e.detail.target.name === "mediaLib")
        ) {
          setIsMediaOpen(true);
        }
        const content = await api?.saver?.save();
        blockIndex.current = api.blocks.getCurrentBlockIndex();
        if (typeof content === "object") {
          onChange({ target: { name, value: JSON.stringify(content) } });
        }
      },
      autofocus: true,
      tools: {
        ...plugins,
        ...customImageTool,
      },
    });
  };

  return (
    <>
      <div
        id={id.current}
        style={{
          border: `1px solid rgb(227, 233, 243)`,
          borderRadius: `4px`,
          marginTop: `4px`,
        }}
      />
      <MediaComponent
        isOpen={isMediaOpen}
        setIsOpen={setIsMediaOpen}
        blockIndex={blockIndex.current}
        api={ref.current}
      />
    </>
  );
};

export default Editor;
