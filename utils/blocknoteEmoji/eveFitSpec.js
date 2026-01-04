"use client";

import { createReactBlockSpec } from "@blocknote/react";
import EveFitBlock from "../../components/EveFitBlock.jsx"; // 네 경로에 맞게

export const eveFitSpec = createReactBlockSpec(
  {
    type: "eveFit",
    propSchema: {
      eft: { default: "" },
      fitUrl: { default: "" },
    },
    content: "none",
  },
  {
    render: (props) => <EveFitBlock {...props} />,
  }
);
