import Avatar from 'react-avatar';
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { FaTasks } from "react-icons/fa";

function Navbar() {
    const { userName } = useContext(SocketContext);

    return (
        <div className="navbar bg-base-100 border-b-2 h-[55px]">
            <div className="navbar-start">
                <div className="dropdown">
                <label htmlFor="my-drawer" title='List of Problems'>
                    <div role="button" className="btn btn-ghost btn-circle">
                        <FaTasks className='text-gray-300 text-2xl'/>
                    </div>
                </label>
                </div>
            </div>

            <div className="navbar-center flex gap-2">
                <img src={'/logo.png'} width={'50px'} alt='Logo'/>
                <a className="text-2xl font-bold">Code-Mate</a>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                    <div className="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span className="badge badge-sm indicator-item">8</span>
                    </div>
                </div>
                <div tabIndex={0} className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow">
                </div>
                </div>
                <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <Avatar name={userName} round='5px' size="35" />
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    <li>
                    <a className="justify-between">
                        Profile
                        <span className="badge">New</span>
                    </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a>Logout</a></li>
                </ul>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
