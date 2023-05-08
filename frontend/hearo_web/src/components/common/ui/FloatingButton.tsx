import React from "react";
import { motion } from "framer-motion";
import { ReactComponent as CrossIcon } from "@/assets/Icon/CrossIcon.svg";

interface PropsType {
  onClick?: () => void;
}
export default function FloatingButton({ onClick }: PropsType) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-14 right-10 h-12 w-12 rounded-full bg-red-main shadow-sm hover:shadow-md"
      onClick={onClick}
    >
      <CrossIcon
        style={{
          margin: "auto",
        }}
      />
    </motion.button>
  );
}
