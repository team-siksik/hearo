import React from "react";
import { motion } from "framer-motion";
import { ReactComponent as CrossIcon } from "@/assets/Icon/CrossIcon.svg";
import { ReactComponent as EditIcon } from "@/assets/Icon/EditIcon.svg";

interface PropsType {
  type?: string;
  onClick?: (e: React.MouseEvent) => void;
}
export default function FloatingButton({ type, onClick }: PropsType) {
  return (
    <>
      {type === "close" ? (
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
      ) : type === "memo" ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-28 right-10 h-12 w-12 rounded-full bg-blue-main shadow-sm hover:shadow-md"
          onClick={onClick}
        >
          <EditIcon
            style={{
              margin: "auto",
            }}
          />
        </motion.button>
      ) : type === "memoInRecord" ? (
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-24 right-10 h-12 w-12 rounded-full bg-blue-main shadow-sm hover:shadow-md"
          onClick={onClick}
        >
          <EditIcon
            style={{
              margin: "auto",
            }}
          />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-14 right-10 h-12 w-12 rounded-full bg-blue-main shadow-sm hover:shadow-md"
          onClick={onClick}
        >
          <EditIcon
            style={{
              margin: "auto",
            }}
          />
        </motion.button>
      )}
    </>
  );
}
