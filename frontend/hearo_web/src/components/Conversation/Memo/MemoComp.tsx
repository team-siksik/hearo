import React from "react";
import { MemoList } from "@/components";
import { motion, AnimatePresence } from "framer-motion";

interface PropsType {
  openMemoPage: boolean;
}
function MemoComp({ openMemoPage }: PropsType) {
  console.log(openMemoPage);
  return (
    // <AnimatePresence>
    //   {openMemoPage && (
    //     <motion.div
    //       initial={{ width: "0%", right: "0" }}
    //       animate={{ width: "30%", right: "30%" }}
    //       exit={{ width: "0%", right: "0" }}
    //     >
    //     </motion.div>
    //   )}
    // </AnimatePresence>
    <MemoList />
  );
}

export default MemoComp;
