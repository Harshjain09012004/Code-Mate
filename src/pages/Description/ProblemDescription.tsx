import { useState, DragEvent, useContext, useEffect } from 'react';
import AceEditor from 'react-ace';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import "../../imports/AceBuildImports";
import DOMPurify from 'dompurify';
import Languages from '../../constants/Languages';
import Themes from '../../constants/Themes';
import { PiCodeBold } from "react-icons/pi";
import { MdOutlineDraw } from "react-icons/md";
// import { IoVideocamOutline } from "react-icons/io5";
import { PiChats } from "react-icons/pi";
import { HiOutlineUsers } from "react-icons/hi2";
import { HiOutlineShare } from "react-icons/hi2";
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

type languageSupport = {
    languageName: string,
    value: number
}

type themeStyle = {
    themeName: string,
    value: string
}

function Description({ descriptionText }: {descriptionText: string}) {

    const sanitizedMarkdown = DOMPurify.sanitize(descriptionText);
    const [activeTab, setActiveTab] = useState('statement');
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
    const [messages, setmessages] = useState<{userName:string, userMessage:string}[]>([]);
    const [codeError, setcodeError] = useState(false);

    const { socket, userName } = useContext(SocketContext);
    const { id } = useParams();

    useEffect(()=>{
       socket.emit("join-room", {roomId: id, peerId: "43635"});

        if(userName){
            socket.emit("myId");

            socket.on("Id", ({id}: {id: string})=>{
                socket.emit("map-id-name", {clientId: id, userName: userName});
            })
        }

        socket.on("update-code", ({newCode}: {newCode: string})=>{
            setCode(newCode);
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

    const isActiveTab = (tabName: string) => {
        if(activeTab === tabName) {
            return 'tab tab-active';
        } else {
            return 'tab'
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
            <SideBar />

            <div 
            className='flex gap-2 w-screen h-[calc(100vh-57px)]'
            onMouseMove={onDrag}
            onMouseUp={stopDragging}
            >

                <div className='AdvancedFeaturesPanel flex flex-col gap-11 h-full text-3xl p-4 bg-gray-800'>
                    <PiCodeBold title='Switch to coding' className='cursor-pointer active:scale-105' onClick={()=>setcodingMode(true)}/>

                    <MdOutlineDraw title='Switch to drawing' className='cursor-pointer active:scale-105' onClick={()=>setcodingMode(false)}/>

                    {/* <IoVideocamOutline title='Start a session' className='cursor-pointer active:scale-105'/> */}

                    <PiChats title='Messaging' className='cursor-pointer active:scale-105' onClick={()=>{
                        setmessaging(!messaging);
                    }}/>

                    <HiOutlineUsers title='Participants' className='cursor-pointer active:scale-105' onClick={()=>{
                        setparticipants(!participants);
                    }}/>

                    <HiOutlineShare title='Invite Your Friends' className='cursor-pointer active:scale-105' onClick={()=>{
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

                    <div role="tablist" className="tabs tabs-boxed w-3/5">
                        <a onClick={() => setActiveTab('statement')} role="tab" className={isActiveTab("statement")}>Problem Statement</a>
                        <a onClick={() => setActiveTab('editorial')} role="tab" className={isActiveTab("editorial")}>Editorial</a>
                        <a onClick={() => setActiveTab('submissions')} role="tab" className={isActiveTab("submissions")}>Submissions</a>
                    </div>

                    <div className='markdownViewer p-[20px] basis-1/2'>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose">
                            {sanitizedMarkdown}
                        </ReactMarkdown>
                    </div>

                </div>

                <div className='divider cursor-col-resize w-[5px] bg-slate-200 h-full' onMouseDown={startDragging}></div>

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
                                <AceEditor
                                    mode={language}
                                    theme={theme}
                                    value={code}
                                    onChange={(e: string) => {
                                        setCode(e);
                                        socket.emit("sync-code", { code , roomId: id});
                                    }}
                                    name='codeEditor'
                                    className='editor'
                                    style={{ width: '100%' }}
                                    setOptions={{
                                        enableBasicAutocompletion: true,
                                        enableLiveAutocompletion: true,
                                        showLineNumbers: true,
                                        fontSize: 16
                                    }}
                                    height='100%'
                                />
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
