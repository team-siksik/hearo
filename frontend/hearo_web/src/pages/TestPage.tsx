import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemoList } from "@/components";

const TestPage = () => {
  const [memoOpen, setMemoOpen] = useState(false);
  function handleClick() {
    setMemoOpen((prev) => !prev);
  }
  return (
    <>
      <button className="mt-20" onClick={handleClick}>
        클릭하면 메모가 pop!
      </button>
      <div className="flex flex-row">
        <motion.div
          initial={{
            height: "10vh",
            width: "100%",
            border: "1px solid black",
          }}
          animate={{
            height: "10vh",
            width: "70%",
            border: "1px solid #E63E43",
          }}
          exit={{
            height: "10vh",
            width: "100%",
            border: "1px solid black",
          }}
        ></motion.div>
        <AnimatePresence>
          {memoOpen && (
            <motion.div
              initial={{ width: "0%", right: "0" }}
              animate={{ width: "30%", right: "30%" }}
              exit={{ width: "0%", right: "0" }}
            >
              <MemoList />
            </motion.div>
          )}
        </AnimatePresence>
        {/* <AnimatePresence>
          {memoOpen && (
            <motion.div
              initial={{
                height: "80vh",
                width: "0%",
                right: "0",
              }}
              animate={{
                height: "80vh",
                width: "30%",
                right: "30%",
                border: "1px solid blue",
              }}
              exit={{
                height: "80vh",
                width: "0%",
              }}
            ></motion.div>
          )}
        </AnimatePresence> */}
      </div>
    </>
  );
};

export default TestPage;
