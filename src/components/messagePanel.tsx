import { useContext, useState, Dispatch, SetStateAction } from "react";
import { VscSend } from "react-icons/vsc";
import { SocketContext } from "../context/SocketContext";

const MessagePanel = ({roomId, messages, setmessages}: 
  {roomId: string, messages: string[], setmessages: Dispatch<SetStateAction<string[]>>}) => {
  
  const {socket} = useContext(SocketContext);
  const [userMessage, setuserMessage] = useState('');

  const sendMessage = ()=>{
    const newMessages = [...messages, userMessage];
    setmessages(newMessages); 

    socket.emit("new-message", {data: userMessage, roomId: roomId});
    setuserMessage('');
  }

  socket.on("new-message", ({data}: {data: string})=>{
    const newMessage = [...messages, data];
    setmessages(newMessage);
  })

  return (
    <div className="border p-4 mb-3 rounded-xl w-80 border-gray-700 bg-zinc-950 shadow-gray-600 shadow-sm flex flex-col justify-between place-content-center gap-10 transition-all">

      <div className="All-Messages flex flex-col gap-4 [scrollbar-width:thin] overflow-y-auto text-gray-300">
        {messages.map((chats)=>(
          <div className="w-[90%] box-border px-2 p-1 shadow-gray-800 shadow-sm break-words border border-gray-700 rounded-lg bg-slate-800">{chats}</div>
        ))}
      </div>

      <div className="Send-Messages flex gap-3 place-items-center justify-evenly">
        <input title="Type Message" id="input-message" type="text" className=" rounded-xl w-[85%] bg-gray-800 text-gray-300  border-gray-500 border py-2 px-1" placeholder="Type Your Message Here...." value={userMessage}
        onChange={(e)=>{
          setuserMessage(e.target.value);
        }}  
        onKeyDown={(e)=>{
          if(e.key === 'Enter'){
            sendMessage();
          }
        }}/>

        <VscSend className="text-2xl active:scale-110 cursor-pointer transition-all" onClick={sendMessage}/>
      </div>
      
    </div>
  )
}

export default MessagePanel;