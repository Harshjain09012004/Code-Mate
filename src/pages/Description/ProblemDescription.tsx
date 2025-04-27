import { useState, DragEvent, useContext, useEffect, useRef } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import "../../imports/AceBuildImports";
import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';

import { PiCodeBold } from "react-icons/pi";
import { MdOutlineDraw } from "react-icons/md";
import { PiChats } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineShare } from "react-icons/hi2";
import { PiFolderOpen } from "react-icons/pi";
import { GoFileCode } from "react-icons/go";
import { FaTasks } from "react-icons/fa";

import Drawing from '../../components/drawing';
import Navbar from '../../components/Navbar';
import SideBar from '../../components/SideBar';
import { SocketContext } from '../../context/SocketContext';
import { useParams } from 'react-router-dom';
import SharePanel from '../../components/sharePanel';
import MessagePanel from '../../components/messagePanel';
import Participants from '../../components/participants';
import UserName from '../../components/userName';
import Judge0Response from '../../types/judge0Response.types';
import WorkSpace from '../../components/workSpace';

import { FileNodeData } from '../../types/fileNode.types';
import { findFileNodeByid } from '../../utility/files.utility';

type languageSupport = {
    languageName: string,
    value: number
}

type themeStyle = {
    themeName: string,
    value: string
}

function Description() {

    const [testCaseTab, setTestCaseTab] = useState('input');
    const [leftWidth, setLeftWidth] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    
    const [language, setLanguage] = useState('63');
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('monokai');
    const [status, setstatus] = useState('Submit');
    const [input, setinput] = useState('');
    const [output, setoutput] = useState<string|null>('Your Output Will Appear Here');

    const [codingMode, setcodingMode] = useState(true);
    const [share, setshare] = useState(false);
    const [messaging, setmessaging] = useState(false);
    const [participants, setparticipants] = useState(false);
    const [workspace, setworkspace] = useState(false);

    const [messages, setmessages] = useState<{userName:string, userMessage:string}[]>([]);
    const [codeError, setcodeError] = useState(false);
    
    const [title, settitle] = useState('');
    const [description, setdescription] = useState('');

    const [treeData, settreeData] = useState<FileNodeData[]>(
        [
            { id: "src", name: "src", type: "folder",
                children: [
                    { id: "src/index.js", name: "index.js", type: "file" },
                ]
            },
        ]
    );
    const [currentFileId, setcurrentFileId] = useState('src/index.js');
    const [currentFileObject, setcurrentFileObject] = useState<FileNodeData | undefined>(
        Array.isArray(treeData) && treeData[0]?.children ? treeData[0].children[0] : undefined
    );

    const { socket, userName } = useContext(SocketContext);
    const { id } = useParams();

    const treeDataRef = useRef(treeData);
    const currentFileIdRef = useRef(currentFileId);

    useEffect(() => {
        treeDataRef.current = treeData;
        currentFileIdRef.current = currentFileId;
    }, [treeData, currentFileId]);

    useEffect(()=>{
       socket.emit("join-room", {roomId: id, peerId: "43635"});

        if(userName){
            socket.emit("myId");

            socket.on("Id", ({id}: {id: string})=>{
                socket.emit("map-id-name", {clientId: id, userName: userName});
            })
        }

        socket.on("update-code", ({newCode, filePath}: {newCode: string, filePath: string})=>{
            const latestFileId = currentFileIdRef.current;
            if(filePath === latestFileId){
                setCode(newCode); 
            }

            const latestTreeData = treeDataRef.current;
            const target = findFileNodeByid(filePath.split('/'), 0, latestTreeData[0]);
            if(target) target.data = newCode;
        });

        socket.on("execution-updates", ({data}: {data: Judge0Response})=>{
            const {stderr, stdout, status} = data;

            if(stderr){
                setoutput(stderr); setcodeError(true);
            }
            else{
                setcodeError(false);
                setstatus(status.description);
                setoutput(stdout);
            }
        });

    }, [socket, id, userName]);

    async function handleSubmission() {
        try {
            if(code){
                setstatus('Pending'); 

                const response = await axios.post("https://code-mate-ws-service.onrender.com/run", {
                    code,
                    language,
                    input,
                });

                const {status, err} = response.data;

                if(err){
                    setcodeError(true);
                    throw new Error(err);
                }
                else{
                    setcodeError(false);
                    setstatus(status);
                }
            }
        } 
        catch(error){
            console.log("error", error);
            setstatus("Error");
        }
        finally{
            setTestCaseTab("output");

            setTimeout(() => {
                setstatus("Submit");
            }, 30000);
        }
    }

    const startDragging = (e: DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.preventDefault();
    }

    const stopDragging = () => {
        if(isDragging) {
            setIsDragging(false);
        }
    }

    const onDrag = (e: DragEvent<HTMLDivElement>) => {
        if(!isDragging) return;
        
        const newLeftWidth = (e.clientX / window.innerWidth) * 100;
        if(newLeftWidth > 10 && newLeftWidth < 90) {
            setLeftWidth(newLeftWidth);
        }

    }

    const isInputTabActive = (tabName: string) => {
        if(testCaseTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab';
        }
    }

    return (
        <>
            <Navbar />
            <SideBar 
                settitle={settitle}
                setdescription={setdescription}
            />

            <div 
            className='flex gap-2 w-screen h-[calc(100vh-57px)]'
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
            >

                <div className='AdvancedFeaturesPanel flex flex-col gap-16 h-full text-3xl p-5 bg-gray-900 border-r border-gray-700'>
                    <PiFolderOpen title='Work Space' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>{
                        if(!workspace) setLeftWidth(20);
                        else setLeftWidth(50);
                        setworkspace(!workspace);
                    }}/>

                    <PiCodeBold title='Switch to coding' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>setcodingMode(true)}/>

                    <MdOutlineDraw title='Switch to drawing' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>setcodingMode(false)}/>

                    <PiChats title='Messaging' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>{
                        setmessaging(!messaging);
                    }}/>

                    <HiOutlineUsers title='Participants' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>{
                        setparticipants(!participants);
                    }}/>

                    <HiOutlineShare title='Invite Your Friends' className='cursor-pointer active:scale-110 transition-all hover:text-gray-500' onClick={()=>{
                        setshare(!share);
                    }}/>
                </div>

                {messaging && (
                    <MessagePanel roomId={id ? id : ''} messages={messages} setmessages={setmessages}/>
                )}

                {participants && (
                    <Participants roomId={id ? id : ''}/>
                )}

                {share && (
                    <div className='absolute z-10 h-[calc(100vh-64px)] w-full flex place-items-center justify-center backdrop-brightness-50'>
                        <SharePanel share={share} setshare={setshare} roomId={id ? id : ''}/>
                    </div>
                )}

                {!userName && (
                    <div className='absolute z-10 h-[calc(100vh-64px)] w-full flex place-items-center justify-center backdrop-brightness-50'>
                        <UserName/>
                    </div>
                )}

                <div className='leftPanel h-full [scrollbar-width:thin] overflow-auto' style={{ width: `${leftWidth}%`}}>

                    {workspace && (
                        <WorkSpace 
                            treeData={treeData} 
                            settreeData={settreeData}
                            setLeftWidth={setLeftWidth}
                            currentFileId={currentFileId}
                            setcurrentFileId={setcurrentFileId}
                            setcurrentFileObject={setcurrentFileObject}
                            setCode={setCode}
                            id={id}
                        />
                    )}
                    
                    {!workspace && (
                        <>
                            {description ? 
                                (
                                    <div>
                                        <p className='sticky border top-0 right-0 border-gray-600 bg-green-700 text-white text-2xl font-medium p-2 mb-10 text-center'>
                                            Problem Statement
                                        </p>

                                        <p className='font-medium text-2xl p-2 text-white'>{title}</p>

                                        <div className='p-2 text-xl tracking-wide flex leading-9'>   
                                            <div dangerouslySetInnerHTML={{ __html: description }} />
                                        </div>
                                    </div>
                                )
                                :
                                (
                                    <div className='h-full flex flex-col items-center gap-24'>
                                        <div className='m-10 font-medium text-4xl text-center flex flex-col gap-3 tracking-wider'>
                                            <p>Welcome, {userName} 🎉</p>
                                        </div>
                                        

                                        <div className='flex flex-col gap-16 justify-center items-center'>

                                            <div className="flex flex-col gap-2 items-center justify-center text-gray-400 font-medium text-3xl">
                                                <p>Go to your workspace </p>

                                                <div className='flex gap-2 place-items-center text-2xl'>
                                                    → By clicking
                                                    <PiFolderOpen className='text-3xl text-gray-200'/>
                                                    in leftBar
                                                </div>
                                            </div>

                                            <div className='text-3xl text-center'>or</div>

                                            <div className="flex flex-col gap-2 items-center justify-center text-gray-400 font-medium text-3xl">
                                                <p>Select a problem from problem list </p>

                                                <div className='flex gap-2 place-items-center text-2xl'>
                                                    → By clicking 
                                                    <FaTasks className='text-2xl text-gray-200'/>
                                                     in leftBar
                                                </div>
                                            </div>

                                        </div>
                                    </div> 
                                )
                            }
                        </>
                    )}
                    
                </div>

                <div className='divider cursor-col-resize w-[5px] bg-slate-200 h-full m-0' onMouseDown={startDragging}></div>

                <div className='rightPanel h-full overflow-auto flex flex-col' style={{ width: `${100-leftWidth}%`}}>
                    {codingMode && (
                        <div className="flex flex-col editor-console grow-[1] ">
                            <div className='flex gap-4 justify-start items-center px-4 py-2 basis-[5%]'>

                                <div>
                                    <button type="button" className="btn btn-success btn-sm px-5" onClick={handleSubmission}>{status || 'Submit'}</button>
                                </div>
        
                                <div>
                                    <select
                                        className="select select-info w-full select-sm max-w-xs"
                                        value={language}
                                        onChange={(e) =>{
                                            setLanguage(e.target.value);
                                        }}
                                        title='Select Language'
                                    >

                                        {Languages.map((language: languageSupport) => (
                                            <option key={language.value} value={language.value}> {language.languageName} </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <select
                                        className="select select-info w-full select-sm max-w-xs"
                                        value={theme}
                                        onChange={(e) => setTheme(e.target.value)}
                                        title='Select Theme'
                                    >
                                        {Themes.map((theme: themeStyle) => (
                                            <option key={theme.value} value={theme.value}> {theme.themeName} </option>
                                        ))}
                                    </select>
                                </div>

                            </div>

                            <div className='editorContainer grow-[1]'>
                                {currentFileObject?.type === "file" ? (
                                    <AceEditor
                                        mode={language}
                                        theme={theme}
                                        value={code}
                                        onChange={(e: string) => {
                                            currentFileObject.data = e;
                                            setCode(e);
                                            socket.emit("sync-code", { 
                                                code: e, roomId: id, 
                                                filePath: currentFileObject.id
                                            });
                                        }}
                                        name='codeEditor'
                                        className='editor'
                                        style={{ width: '100%' }}
                                        setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        showLineNumbers: true,
                                        fontSize: 16,
                                        }}
                                        height='100%'
                                    />
                                    ) : (
                                    <div className="w-full h-full flex gap-3 items-center justify-center text-gray-400 font-medium text-2xl">
                                        <GoFileCode className='text-white text-3xl'/>
                                        <p>Please select a file to start writing code.</p>
                                    </div>
                                )}
                            </div>

                            <div className="collapse bg-base-200 rounded-none">
                                <input placeholder='Input Data' type="checkbox" className="peer" />
                                <div className="collapse-title font-medium text-center text-lg text-white bg-zinc-850 peer-checked:bg-gray-800 peer-checked:text-gray-300">
                                    Console
                                </div>

                                <div className="collapse-content bg-gray-900 text-primary-content peer-checked:bg-gray-800 peer-checked:text-secondary-content flex flex-col place-items-center">
                                    <div role="tablist" className="tabs tabs-boxed w-3/5 mb-4">
                                        <a onClick={() => setTestCaseTab('input')} role="tab" className={isInputTabActive('input')}>Input</a>
                                        <a onClick={() => setTestCaseTab('output')} role="tab" className={isInputTabActive('output')}>Output</a>
                                    </div>

                                    {(testCaseTab === 'input') ? 
                                        <textarea rows={4} cols={75} 
                                        className='bg-neutral text-gray-300 rounded-md resize-none p-1 outline-none' 
                                        placeholder='Enter Test Case' value={input} 
                                        onChange={(e)=>{
                                            setinput(e.target.value);
                                        }}/> 
                                        : 
                                        <div className={`bg-neutral min-h-28 max-h-40 w-full overflow-y-auto overflow-x-auto ${codeError ? 'text-red-500' : 'text-gray-300'} rounded-md p-2 [scrollbar-width:thin]`}>
                                            <pre>{output}</pre>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {!codingMode && (
                        <Drawing roomId={id ? id : '12345'}/>
                    )}
                </div>
            </div>
        </>
        
    )
}

export default Description;
