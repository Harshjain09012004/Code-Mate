type Judge0Response = {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null; // in seconds
  memory: number | null; // in kilobytes
  status: {
    id: number;
    description: string;
  };
  language_id: number;
};

export default Judge0Response;