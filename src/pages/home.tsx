import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { IoCopyOutline } from "react-icons/io5";
import { IoCopy } from "react-icons/io5";
import { CircularProgress } from '@mui/material';
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

const JoinRoom: React.FC = () => {
    const [room, setroom] = useState('');
    const [user, setuser] = useState('');
    const navigate = useNavigate();
    const { socket, setuserName} = useContext(SocketContext);
    const [copied, setcopied] = useState(false);
    const [connecting, setconnecting] = useState(false);
    const [connected, setconnected] = useState(false);

    const initRoom = () => {
        console.log("Initialising a req to create a room", socket)
        setconnecting(true); setconnected(false); socket.emit("create-room");
    }

    const join = () => {
      if(room && user){
        setuserName(user);
        navigate(`/room/${room}`);
      }
      else if(!room){
        alert("Enter a roomId or create a new");
      } 
      else alert("Enter Your Name Before Joining");
    }

    socket.on("room-created", ({roomId} : {roomId:string})=>{
        setroom(roomId); setcopied(false);
        setconnecting(false); setconnected(true)
    })

    return (
        <div className="h-full w-full flex justify-center place-items-center place-content-center">
          <div className="border p-10 rounded-xl border-gray-700 bg-zinc-900 shadow-gray-600 shadow-sm flex flex-col justify-center place-items-center place-content-center gap-16">

            <div className="flex flex-col gap-5">
              <div className="flex gap-5 place-items-center">
                <input id="room" type="text" className=" rounded-xl w-64 bg-black text-gray-300  border-gray-500 border p-3" placeholder="Create Room or Enter Code Here" value={room} onChange={(e)=>{
                    setroom(e.target.value);
                }}/>

                {!copied && <IoCopyOutline title="Copy to Clipboard" className="text-2xl cursor-pointer active:scale-110 transition-all" onClick={()=>{
                  navigator.clipboard.writeText(room);
                  if(room) setcopied(true);
                }}/>}
                
                {copied && <IoCopy title="Copied to Clipboard" className="text-2xl cursor-pointer active:scale-110 transition-all"/>}
              </div>
            
              <input id="name" type="text" className=" rounded-xl w-64 bg-black text-gray-300  border-gray-500 border p-3" placeholder="Enter Your Name Ex: Harsh Jain" value={user} onChange={(e)=>{
                    setuser(e.target.value);
              }}/>
            </div>

            {connecting && (
              <div className="flex flex-col gap-5 place-items-center">
                <div className="flex gap-5 place-items-center">
                  <p className="text-xl font-medium">Connecting To Server</p>
                  <CircularProgress className="text-sm"/>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-400">It will take approximately 2 minutes.</p>
                  <p className="text-sm text-gray-400">As server sleeps every 15 minutes of inactivity.</p>
                </div>
              </div>
            )}  

            {connected && (
              <div className="flex gap-3 place-items-center">
                <div className="flex flex-col gap-1 text-center">
                  <p className="text-lg font-medium">Room Created Successfully</p>
                  <p className="text-lg font-medium">➡️ Now Press Join Room</p>
                </div>

                <IoCheckmarkDoneCircleOutline className="text-6xl"/>
              </div>
            )}
            
            <div className="flex gap-10">
              <button 
                  type="button"
                  onClick={join}
                  className="bg-indigo-500 text-lg rounded-xl p-3 px-4 active:scale-105 transition-all"
              >
                  Join Room
              </button>

              <button 
                  type="button"
                  onClick={initRoom}
                  className="bg-indigo-500 text-lg rounded-xl p-3 px-4 active:scale-105 transition-all"
              >
                  Create Room
              </button>
            </div>
          </div>
            
        </div>
    )
}

export default JoinRoom;