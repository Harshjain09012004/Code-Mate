import { useContext, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const UserName = () => {
  const [name, setname] = useState("");
  const {socket, userName, setuserName} = useContext(SocketContext);

  const handleSave = ()=>{
    if(name){
      setuserName(name); 

      socket.emit("myId");

      socket.on("Id", ({id}: {id: string})=>{

          socket.emit("map-id-name", {clientId: id, userName: name});
          setname('');
      })
    }
  }

  return (
    <div className="border p-10 rounded-xl border-gray-700 bg-zinc-900 shadow-gray-600 shadow-sm flex flex-col gap-12">

        <p className="text-2xl font-semibold">Create Your Identity</p>

        <div className="flex flex-col gap-10">

          <input title="Enter Your Name" id="input-message" type="text" className=" rounded-xl bg-gray-800 text-gray-300  border-gray-500 border p-3" placeholder="Enter Your Name Here" value={name} onChange={(e)=>{
            setname(e.target.value);
          }}/>

          <button 
              type="button" title={`${userName ? "Saved": "Save Name"}`}
              className={`${userName ? "bg-green-500":"bg-indigo-500"} text-gray-100 text-lg rounded-xl p-3 active:scale-105 transition-all font-medium`} onClick={handleSave}
          >
              {userName ? "Saved Name" : "Save Your Name"}
          </button>

        </div>
    </div>
  )
}

export default UserName;