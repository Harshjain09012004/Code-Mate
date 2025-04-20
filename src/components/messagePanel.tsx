import { useContext, useState, Dispatch, SetStateAction } from "react";
import { VscSend } from "react-icons/vsc";
import Avatar from 'react-avatar';
import { SocketContext } from "../context/SocketContext";

const MessagePanel = ({roomId, messages, setmessages}: 
  {roomId: string, messages: {userName: string, userMessage: string}[], setmessages: Dispatch<SetStateAction<{userName: string, userMessage: string}[]>>}) => {
  
  const {socket, userName} = useContext(SocketContext);
  const [userMessage, setuserMessage] = useState('');

  const sendMessage = ()=>{
    if(userMessage){
      const newMessages = [...messages, {userName, userMessage}];
      setmessages(newMessages); 

      socket.emit("new-message", {chat: userMessage, roomId: roomId, userName: userName});
      setuserMessage('');
    }
  }

  socket.on("new-message", ({chat, userName}: {chat: string, userName: string})=>{
    const newMessage = [...messages, {userName, userMessage: chat}];
    setmessages(newMessage);
  })

  return (
    <div className="border p-4 mb-3 rounded-xl w-[340px] border-gray-700 bg-zinc-950 shadow-gray-600 shadow-sm flex flex-col justify-between place-content-center gap-10 transition-all">

      <div className="All-Messages flex flex-col w- gap-4 [scrollbar-width:thin] overflow-y-auto text-gray-300">
        {messages.map(({userMessage, userName: name})=>(
          <div className="flex gap-2 place-items-start"> 
            <Avatar name={name} round='5px' size="32" />

            <div className={`w-[75%] box-border px-2 p-1 shadow-gray-800 shadow-sm break-words border border-gray-700 rounded-lg ${name === userName ? ' bg-blue-900':'bg-slate-800'}`}>{userMessage}</div>
          </div>
        ))}
      </div>

      <div className="Send-Messages flex gap-3 place-items-center justify-evenly">
        <input title="Type Message" id="input-message" type="text" className=" rounded-xl w-[85%] bg-gray-800 text-gray-300 border-gray-500 border py-2 px-1 text-base outline-none" placeholder="Type Your Message..." value={userMessage}
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