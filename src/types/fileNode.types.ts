export type FileNodeData = {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNodeData[];
  data?: string;
};

export type NodeProps = {
  node: {
    data: FileNodeData;
    isLeaf: boolean;
  };
  style: React.CSSProperties;
  dragHandle?: React.Ref<HTMLDivElement>;
};