import { FileNodeData } from "../types/fileNode.types";

export function findFileNodeByid(fileNameSequence:string[], i: number, currFileObject: FileNodeData ): FileNodeData|undefined
{
    if(currFileObject.name !== fileNameSequence[i]) return;
    if(i===(fileNameSequence.length - 1)) return currFileObject;
    if(!currFileObject.children) return;

    for(const childs of currFileObject.children){
        const result: FileNodeData|undefined = findFileNodeByid(fileNameSequence, i+1, childs);
        if(result) return result;
    }
} 