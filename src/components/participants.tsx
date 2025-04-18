import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import Avatar from 'react-avatar';

const Participants = ({roomId}: {roomId: string}) => {
  const { socket } = useContext(SocketContext);
  const [allUsers, setallUsers] = useState<string[]>([]);

  useEffect(()=>{
    socket.emit("get-all-userNames", {roomId});

    socket.on("all-userNames", ({allUserNames}: {allUserNames : string[]})=>{
       setallUsers(allUserNames);
    })
  },[]);

  return (
    <div className="flex flex-col gap-5 border p-4 mb-3 rounded-xl w-64 border-gray-700 bg-zinc-950 shadow-gray-600 shadow-sm overflow-y-auto overflow-x-clip [scrollbar-width:thin] transition-all ">
        <p className="text-center font-medium text-lg border-b border-gray-600 pb-2">Total Participants {allUsers.length}</p>
        {allUsers.map((users, id)=>(
            <div key={id} className="flex gap-3 place-items-center">
                <Avatar name={users} round='5px' size="33" />
                <p >{users}</p>
            </div>
        ))}
    </div>
  )
};

export default Participants;