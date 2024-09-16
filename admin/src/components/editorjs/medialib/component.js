import React from "react";
import { prefixFileUrlWithBackendUrl, useLibrary } from "@strapi/helper-plugin";

const change = ({ api, files, blockIndex, setIsOpen }) => {
  let insertedBlocksCount = 0;
  files.forEach((file) => {
    if (!file.mime.includes("image")) {
      return;
    }
    const newBlockData = {
      file: {
        url: file.url.replace(window.location.origin, ""),
        mime: file.mime,
        height: file.height,
        width: file.width,
        size: file.size,
        alt: file.alt,
        formats: file.formats,
      },
      caption: file.caption,
      withBorder: false,
      withBackground: false,
      stretched: false,
    };

    api?.blocks?.insert(
      "image",
      newBlockData,
      {},
      blockIndex + insertedBlocksCount,
      true
    );
    insertedBlocksCount++;
  });

  setIsOpen(false);
};

const MediaLibComponent = ({ isOpen, setIsOpen, blockIndex, api }) => {
  const { components } = useLibrary();

  const MediaLibraryDialog = components["media-library"];

  const handleSelectAssets = (files) => {
    change({
      api,
      files: files.map((f) => ({
        alt: f.alternativeText || f.name,
        url: prefixFileUrlWithBackendUrl(f.url),
        width: f.width,
        height: f.height,
        size: f.size,
        mime: f.mime,
        formats: f.formats,
      })),
      blockIndex,
      setIsOpen,
    });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <MediaLibraryDialog
      allowedTypes={["images"]}
      onClose={() => setIsOpen(false)}
      // onInputMediaChange={handleInputChange}
      onSelectAssets={handleSelectAssets}
    />
  );
};

export default MediaLibComponent;
