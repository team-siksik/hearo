import React, { useState } from "react";
import {
  RecordpageSideBar,

} from "@/components";
import { RecordsItem } from "@/components";
import axios from "axios";

interface RecordsItemProps {
  id: number;
  title: string;
  date: string;
  description: string;
}

function TotalRecordsPage() {
  const [openRemoveRecordModal, setOpenRemoveRecordModal] =
    useState<boolean>(false);
  // const [idToDelete, setIdToDelete] = useState<number>(0);
  // const [noRecords, setNoRecords] = useState<boolean>(false);
  const [records, setRecords] = useState<RecordsItemProps[]>([
    {
      id: 1,
      title: "Meeting with team members",
      date: "2022-05-01",
      description: "Discuss project progress and next steps",
    },
    {
      id: 2,
      title: "Interview with new candidate",
      date: "2022-04-28",
      description: "Interview for front-end developer position",
    },
    {
      id: 3,
      title: "Presentation for investors",
      date: "2022-04-25",
      description: "Present the new product roadmap to investors",
    },
    {
      id: 4,
      title: "Client meeting",
      date: "2022-04-22",
      description: "Discuss client requirements and project timeline",
    },
    {
      id: 5,
      title: "Training session for employees",
      date: "2022-04-20",
      description: "Training session for new project management software",
    },
    {
      id: 6,
      title: "Team building activity",
      date: "2022-04-15",
      description: "Outdoor activity for team members",
    },
    {
      id: 7,
      title: "Brainstorming session",
      date: "2022-04-10",
      description: "Brainstorm ideas for new product features",
    },
    {
      id: 8,
      title: "Customer support call",
      date: "2022-04-05",
      description: "Help a customer resolve a technical issue",
    },
    {
      id: 9,
      title: "Marketing campaign planning",
      date: "2022-04-01",
      description: "Plan the next marketing campaign",
    },
    {
      id: 10,
      title: "Sales meeting",
      date: "2022-03-28",
      description: "Discuss sales strategy and revenue goals",
    },
  ]);

  const handleChangeTitle = (id: number, newTitle: string) => {
    const newRecords = records.map(record => {
      if (record.id === id) {
        return {
          ...record,
          title: newTitle
        }
      }
      return record;
    });
    setRecords(newRecords);
  };

  const handleRemoveRecord = (idToDelete:number) => {
    const updatedRecords = records.filter((record) => record.id !== idToDelete);
    setRecords(updatedRecords);
    setOpenRemoveRecordModal(false);
  };


  // const getRecords = async () => {
  //   const response = await axios.get('v1/record/??', {
  //     headers : { Authorization: `Bearer ${authToken}`}, 
  // }), 
  // let data : 

  // const records = data.map()

  // const showRecords = () => {
  //   if (noRecords) 
  //     return ('no record') 
  //   else 
  //     return( 
  //       {records}
  //     )
  //   }  


  return (
    <div>
      <RecordpageSideBar/>
      <div className="absolute right-0 mt-20 w-[82%] overflow-auto" style={{ paddingTop: "16px" }}>
        <div className="fixed right-0 top-20 bottom-0 overflow-y-scroll" style={{ width: "calc(82% - 1rem)" }}>
          <div className="space-y-4">
            {records.map((record) => (
              <RecordsItem
                key={record.id}
                recordId={record.id}
                title={record.title}
                date={record.date}
                description={record.description}
                onRemove={() => handleRemoveRecord(record.id)}
                onChangeTitle={(newTitle) => handleChangeTitle(record.id, newTitle)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )  
}

export default TotalRecordsPage;