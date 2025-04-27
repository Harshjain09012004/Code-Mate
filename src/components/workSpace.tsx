import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Tree } from 'react-arborist';
import JSZip from 'jszip';
import { CircularProgress } from '@mui/material';
import { HiOutlineFolderPlus } from "react-icons/hi2";
import { PiFilePlus } from "react-icons/pi";
import { HiOutlineFolderArrowDown } from "react-icons/hi2";
import { AiOutlineDelete } from "react-icons/ai";
import { RxFileText } from "react-icons/rx";
import { SlFolder } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";

import { FileNodeData, NodeProps } from "../types/fileNode.types";
import { findFileNodeByid } from "../utility/files.utility";
import { SocketContext } from "../context/SocketContext";

const WorkSpace = (
  { currentFileId, treeData, settreeData, setLeftWidth,
    setcurrentFileId, setcurrentFileObject, setCode, id
  } 
  :
  {
    currentFileId: string, treeData: FileNodeData[], 
    settreeData: Dispatch<SetStateAction<FileNodeData[]>>, 
    setcurrentFileId: Dispatch<SetStateAction<string>>,
    setLeftWidth: Dispatch<SetStateAction<number>>,
    setcurrentFileObject: Dispatch<SetStateAction<FileNodeData|undefined>>,
    setCode: Dispatch<SetStateAction<string>>,
    id: string|undefined
  }
) => {

  const [addingFile, setaddingFile] = useState(false);
  const [fileName, setfileName] = useState('');
  const [addingFolder, setaddingFolder] = useState(false);
  const [downloading, setdownloading] = useState(false);
  const [adding, setadding] = useState(false);
  const {socket} = useContext(SocketContext);

  useEffect(()=>{
    socket.on("update-tree", ({tree}: {tree: FileNodeData[]})=>{
      settreeData(tree);
    })
  }, []);

  function Node({ node, style, dragHandle } : NodeProps) {
    return (
      <div className={`cursor-pointer active:scale-95 transition-all ${currentFileId===node.data.id ? 'text-green-400' : 'text-gray-300'} hover:text-gray-600`} style={style} ref={dragHandle}
      onClick={()=>{
        setcurrentFileId(node.data.id);
        setcurrentFileObject(node.data);
        setCode(node.data.data ? node.data.data : "");
      }}
      key={node.data.id}
      >

        {node.isLeaf ? <RxFileText className="inline mr-2"/> : <SlFolder className="inline mr-2"/>}
        {node.data.name}

      </div>
    );
  }

  function addHandler(){
    const clonedTree = structuredClone(treeData); //Deep Clone

    const targetFolder = findFileNodeByid(currentFileId.split('/'), 0, clonedTree[0]);

    if(targetFolder?.type === "file") return;

    if(addingFolder){
      targetFolder?.children?.push({
        id: targetFolder.id + `/${fileName.split('.')[0]}`,
        name: `${fileName.split('.')[0]}`,
        type: "folder",
        children: [],
      })
    }
    else{
      targetFolder?.children?.push({
        id: targetFolder.id + `/${fileName}`,
        name: `${fileName}`,
        type: "file",
        data: "",
      })
    }

    socket.emit("file-updates", {treeData: clonedTree, id});

    setaddingFile(false); 
    setaddingFolder(false);

    settreeData(clonedTree);
    setfileName('');
  }

  function addFilesToZip(zip: JSZip, node: FileNodeData){
    if(node.type === "file"){
      zip.file(node.name, node.data || "");
    } 

    else if(node.type === "folder" && node.children){
      const folder = zip.folder(node.name);

      node.children.forEach((child) => {
        addFilesToZip(folder!, child); 
      });
    }
  }

  async function downloadZip(rootNodes: FileNodeData[]) {
    const zip = new JSZip();

    addFilesToZip(zip, rootNodes[0]);

    const content = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);

    link.download = 'code-mate.zip';
    link.click();
  }

  async function handleDownload(){
    setdownloading(true);
    await downloadZip(treeData);
    setdownloading(false);
  }

  return (
    <div className="h-full overflow-hidden relative">

      <div className="File-Management-Features flex place-items-center justify-around text-3xl bg-gray-900 p-2 border-b border-gray-800">

        <PiFilePlus title="Add File" className='cursor-pointer active:scale-110 transition-all' onClick={()=>{
          setaddingFile(true); setadding(true); setLeftWidth(20);
        }}/>

        <HiOutlineFolderPlus title="Add Folder" className='cursor-pointer active:scale-110 transition-all' onClick={()=>{
          setaddingFolder(true); setadding(true); setLeftWidth(20);
        }}/>

        {downloading ? 
          (
            <CircularProgress size={'30px'}/>
          )
          : 
          (
            <HiOutlineFolderArrowDown title="Download as Zip" className='cursor-pointer active:scale-110 transition-all' onClick={handleDownload}/>
          )
        }

        <AiOutlineDelete title="Delete" className='cursor-pointer active:scale-110 transition-all' onClick={()=>{
          
        }}/>

      </div>

      <div className="m-5 mt-5">
        <Tree 
        data={treeData}
        width={600}
        height={1000}
        disableDrag
        disableDrop
        indent={24}
        rowHeight={30}
        >
          {Node}
        </Tree>
      </div>

      {adding && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 bg-slate-900 p-5 rounded-md border border-blue-900 ">

          <div className="flex justify-end">
            <RxCross1 className="text-xl cursor-pointer hover:scale-110 transition-all text-end" 
            onClick={()=>{
              setfileName('');
              setadding(false);
            }}/>
          </div>
          
          <div className="flex flex-col gap-10">

            <p className="font-medium text-2xl text-center">{addingFile ? 'File Details' : 'Folder Details'}</p>

            <div className="Input-Section flex flex-col gap-8">

              <input title="Enter Details" id="input-details" type="text" className=" rounded-xl bg-gray-800 text-gray-300 border-gray-500 border py-2 px-1 text-base outline-none" placeholder={`Enter Your ${addingFile ? 'File' : 'Folder'} Name`} value={fileName}
              onChange={(e)=>{
                setfileName(e.target.value);
              }}  
              />

              <button 
                  type="button"
                  onClick={()=>{
                    if(fileName){
                      addHandler();
                      setadding(false);
                    }
                  }}
                  className="bg-indigo-500 font-medium rounded-xl py-2 px-1 active:scale-105 transition-all"
              >
                  Save Details
              </button>

            </div>

          </div>

        </div>
      )}
  
    </div>
  )
}

export default WorkSpace;