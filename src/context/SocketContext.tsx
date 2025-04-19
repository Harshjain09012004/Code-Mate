import SocketIoClient from "socket.io-client";
import { createContext, useEffect, useReducer, useState } from "react";
// import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as UUIDv4 } from "uuid";
import { PeerReducer } from "../Reducers/peerReducers";
import { addPeerAction } from "../Actions/peerAction";

const WS_Server = "https://code-mate-ws-service.onrender.com";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SocketContext = createContext<any | null>(null);

const socket = SocketIoClient(WS_Server, {
    withCredentials: false,
    transports: ["polling", "websocket"]
});

interface Props {
    children: React.ReactNode
}

export const SocketProvider: React.FC<Props> = ({ children }) => {
    // const navigate = useNavigate();
    const [user, setuser] = useState<Peer>();//Peer user
    const [stream, setstream] = useState<MediaStream>();
    const [peers, dispatch] = useReducer(PeerReducer, {});
    const [userName, setuserName] = useState<string>('');

    const fetchUserFeed = async ()=>{
        const userStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
        setstream(userStream);
    }

    const fetchParticipants = ({roomId, participants}: {roomId: string, participants: string[]})=>{
        console.log("Fetching room and its participants");
        console.log(roomId, participants);
    };

    useEffect(()=>{
        const userId = UUIDv4();
        const newPeer = new Peer(userId, {
            host: 'localhost',
            port: 9000,
            path: '/myapp'
        });
        setuser(newPeer);

        fetchUserFeed();
        
        socket.on("get-users", fetchParticipants);
    },[]);

    useEffect(()=>{
        if(!user || !stream) return;

        socket.on("user-joined", ({peerId})=>{
            //Will make a call to the user with peerId
            //It is executed for every new user entered
            const call = user.call(peerId, stream);
            console.log("Calling the new Peer ", peerId);

            call.on("stream", (remoteStream)=>{
                dispatch(addPeerAction(peerId, remoteStream));
            })
        })

        user.on("call", (call)=>{
            //When the user receives the call
            console.log("Receiving a call");
            call.answer(stream);

            call.on("stream", (remoteStream)=>{
                dispatch(addPeerAction(call.peer, remoteStream));
            })
        });

        socket.emit("ready"); //Current user is ready with stream
    }, [user, stream]);

    return (
        <SocketContext.Provider value={{ socket, user, stream, peers, userName, setuserName}}>
            {children}
        </SocketContext.Provider>
    );
}