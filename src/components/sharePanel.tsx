import { RxCross1 } from "react-icons/rx";
import { RxShare2 } from "react-icons/rx";
import { Dispatch, SetStateAction, useState } from "react";

const SharePanel = ({share, setshare, roomId} : {share: boolean, setshare: Dispatch<SetStateAction<boolean>>, roomId: string}) => {

  const [copiedCode, setcopiedCode] = useState(false);
  const [copiedURL, setcopiedURL] = useState(false);

  return (
    <div className="relative border p-10 rounded-xl border-gray-700 bg-zinc-900 shadow-gray-600 shadow-sm flex flex-col justify-center place-items-center place-content-center gap-16">
        <RxCross1 title="Close" className="text-2xl absolute top-2 right-3 cursor-pointer hover:scale-110" onClick={()=>{
            setshare(!share);
        }}/>

        <div className="flex gap-2 place-items-center">
          <RxShare2 className="text-3xl"/>
          <p className="text-lg font-medium">Share Room Code or URL with Others</p>
        </div>
        
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
                    navigator.clipboard.writeText(`https://code-mate-ten.vercel.app/room/${roomId}`);
                    setcopiedURL(true); setcopiedCode(false);
                  }}
              >
                {copiedURL ? "Copied Room URL" : "Copy Room URL"}
              </button>
        </div>
    </div>
  )
}

export default SharePanel;