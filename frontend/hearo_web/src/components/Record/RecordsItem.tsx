import React, {useState} from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { NewspaperIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

interface RecordsItemProps {
  id : number;
  title: string;
  date: string;
  description: string;
  onDelete: () => void;
}

function RecordsItem({ id, title, date, description, onDelete}:RecordsItemProps) {
  return (
        <div className="mx-10 mt-4 p-4 rounded-2xl font-semibold text-black hover:cursor-pointer hover:bg-blue-50 transition-all duration-300 ease-out shadow-lg">
          <div className="flex flex-row items-stretch justify-between">
            <div className="flex items-center">
                <div className="self-center mr-4 font-semibold text-blue-main rounded-full bg-blue-100 w-12 h-12 flex justify-center items-center">
                  <div className="w-6 h-6">
                    <NewspaperIcon />
                  </div>
                </div>
                <div>
                  <div className="font-bold mb-2">{title}</div>
                  <div className="my-2 text-blue-main">{description}</div>
                  <div className="text-sm">{date}</div>
                </div>
            </div>
            <div className="self-center mr-4 font-semibold text-red-main rounded-full bg-red-50 w-12 h-12 hover:bg-red-300 hover:shadow-sm transition-all duration-200 ease-out flex justify-center items-center">
              <div className="w-6 h-6">
                <TrashIcon />
              </div>
            </div>
          </div>
        </div>
  );
}
export default RecordsItem;

