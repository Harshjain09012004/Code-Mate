import axios from "axios";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';

function SideBar({setdescription, settitle}: {
    setdescription: Dispatch<SetStateAction<string>>,
    settitle: Dispatch<SetStateAction<string>>
}) {
    interface Problem {
        questionId: string;
        title: string;
        titleSlug: string;
        isPaidOnly: boolean;
    }

    const [problems, setproblems] = useState<Problem[]>([]);
    const [loading, setloading] = useState(false);
    const [fetchingProblemDes, setfetchingProblemDes] = useState(false);

    useEffect(()=>{
        axios.post('https://code-mate-ws-service.onrender.com/fetchProblems', {
            limit: 10,
            skip: 0
        }).then(({data})=>{
            setproblems(data.questions);
        })
        .catch((err)=>{
            console.log(err);
        })
    },[]);

    const handleChangePage = async (
        _event: React.ChangeEvent<unknown>,
        newPage: number,
    ) => {
        try{
            setloading(true);
            const {data} = await axios.post('https://code-mate-ws-service.onrender.com/fetchProblems', {
                limit: 10,
                skip: 20*(newPage-1)
            });

            setproblems(data.questions);
            setloading(false);
        }
        catch(err){
            console.log(err);
        }
    };

    const handleProblemDescription = async (titleSlug: string, Id: string)=>{
        setfetchingProblemDes(true);
        const response = await axios.post('https://code-mate-ws-service.onrender.com/fetchProblemDescription',
            {
                titleSlug,
            }
        );

        setdescription(response.data.content);
        settitle(Id + "  " + response.data.title);
        setfetchingProblemDes(false);
    };

    return (
        <div className="drawer z-10">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-side">
                <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <div className="menu p-4 min-h-full bg-base-200 text-base-content text-lg flex flex-col gap-4 border-r">
                    <div className="flex justify-center gap-5 place-items-center">
                        <p className="text-2xl font-bold mb-3">
                            Problem List 
                        </p>

                        {fetchingProblemDes && (
                            <CircularProgress className="text-sm"/>
                        )}
                    </div>
                    
                    
                    {loading && (
                        <div className="h-[72vh] flex justify-center place-items-center">
                            <CircularProgress className="text-sm"/>
                        </div>
                    )}

                    {(!loading && problems) && problems.map((problem) => {
                        const isPaid = problem.isPaidOnly;

                        const baseClasses = "flex gap-2 text-md border border-gray-500 p-1 rounded-xl bg-gray-900 transition-all";
                        const cursorClass = isPaid ? "text-gray-500 cursor-not-allowed" : "cursor-pointer";
                        const hoverClass = isPaid ? "hover:bg-gray-900" : "hover:bg-gray-700 hover:scale-100";

                        return (
                            <div
                            className={`${baseClasses} ${cursorClass} ${hoverClass}`}
                            onClick={() => {
                                if (!isPaid) handleProblemDescription(problem.titleSlug, problem.questionId);
                            }}
                            key={problem.questionId}
                            >
                            <a>{problem.questionId}</a>
                            <a>{problem.title}</a>
                            </div>
                        );
                    })}

                    <div className="flex mt-5 justify-center border rounded-md border-gray-700 p-1 bg-slate-800">
                        <Pagination
                            count={100} 
                            color="primary" 
                            size="large" 
                            sx={{
                                '& .MuiPaginationItem-root': {
                                color: 'white',
                                },
                            }}
                            onChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;