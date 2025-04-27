import { RxCross1 } from "react-icons/rx";
import { RxShare2 } from "react-icons/rx";
import { Dispatch, SetStateAction, useState } from "react";
import { IoLogoWhatsapp } from "react-icons/io5";

const SharePanel = ({share, setshare, roomId} : {share: boolean, setshare: Dispatch<SetStateAction<boolean>>, roomId: string}) => {

  const roomUrl = `https://code-mate-ten.vercel.app/room/${roomId}`;

  const WhatsAppInvite = encodeURIComponent(`🚀 Join me on Code-Mate – a collaborative coding space!\n\nI’ve created a room for us to code together, solve problems, and share ideas in real time.\n\n🔗 Room Link: ${roomUrl}\n\n🧾 Room Code: ${roomId}\n\nHop in and let's build something awesome together 💻🔥`);

  const [copiedCode, setcopiedCode] = useState(false);
  const [copiedURL, setcopiedURL] = useState(false);

  return (
    <div className="relative border p-10 rounded-xl border-gray-700 bg-zinc-900 shadow-gray-600 shadow-sm flex flex-col justify-center place-items-center place-content-center gap-16">
      
        <RxCross1 title="Close" className="text-2xl absolute top-2 right-3 cursor-pointer hover:scale-110" onClick={()=>{
            setshare(!share);
        }}/>

        <div className="Tagline flex gap-2 place-items-center">
          <RxShare2 className="text-3xl"/>
          <p className="text-lg font-medium">Share Room Code or URL with Others</p>
        </div>
        
        <div className="Invite-Options flex flex-col gap-10">

          <div className="flex gap-10">
            <button 
                type="button" title={`${copiedCode ? "Copied To Clipboard": "Copy Room Code"}`}
                className={`${copiedCode ? "bg-green-500":"bg-indigo-500"} text-gray-100 text-lg rounded-xl p-3 active:scale-105 transition-all font-medium`} onClick={()=>{
                  navigator.clipboard.writeText(`${roomId}`);
                  setcopiedCode(true); setcopiedURL(false);
                }}
            >
              {copiedCode ? "Copied Room Code" : "Copy Room Code"}
            </button>

            <button 
                type="button" title={`${copiedURL ? "Copied To Clipboard": "Copy Room URL"}`}
                className={`${copiedURL ? "bg-green-500":"bg-indigo-500"} text-lg  text-gray-100 rounded-xl p-3 active:scale-105 transition-all font-medium`} onClick={()=>{

                  navigator.clipboard.writeText(roomUrl);
                  setcopiedURL(true); setcopiedCode(false);

                }}
            >
              {copiedURL ? "Copied Room URL" : "Copy Room URL"}
            </button>
          </div>
          
          <p className="text-center font-medium text-xl">or</p>

          <a
            title="Invite Others Using WhatsApp"
            href={`https://api.whatsapp.com/send?text=${WhatsAppInvite}`}
            target="_blank"
            rel="noopener noreferrer"
            className="Invite-Button flex gap-8 place-items-center justify-center bg-indigo-500 p-2 rounded-xl"
          >
            <IoLogoWhatsapp className="bg-green-500 text-4xl p-1 
          rounded-xl text-white"/>
            <p className="font-medium text-xl text-gray-200">Invite Via WhatsApp</p>
          </a>

        </div>
        
    </div>
  )
}

export default SharePanel;