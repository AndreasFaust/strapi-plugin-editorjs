import PluginId from "../../pluginId";
import axios from "axios";
import { auth } from "@strapi/helper-plugin";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import Delimiter from "@editorjs/delimiter";
import Image from "@editorjs/image";
import Table from "@editorjs/table";

const plugins = {
  image: {
    class: Image,
    config: {
      field: "files.image",
      additionalRequestData: {
        data: JSON.stringify({}),
      },
      additionalRequestHeaders: {
        Authorization: `Bearer ${auth.getToken()}`,
      },
      endpoints: {
        byUrl: `/api/${PluginId}/image/byUrl`,
      },
      uploader: {
        async uploadByFile(file) {
          const formData = new FormData();
          formData.append("data", JSON.stringify({}));
          formData.append("files.image", file);
          const { data } = await axios.post(
            `/api/${PluginId}/image/byFile`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${auth.getToken()}`,
              },
            }
          );
          return data;
        },
      },
    },
  },
  table: Table,
  list: {
    class: List,
    inlineToolbar: true,
  },
  header: {
    class: Header,
    inlineToolbar: true,
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Quote",
      captionPlaceholder: "Quote`s author",
    },
  },
  marker: {
    class: Marker,
    inlineToolbar: true,
  },
  delimiter: Delimiter,
};

export default plugins;
