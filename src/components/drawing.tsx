import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const Drawing = ({roomId}: {roomId:string}) => {
  return (
      <Tldraw 
          inferDarkMode
          defaultName="Editor"
          className="z-0" 
          persistenceKey={`${roomId}`}
      />
  )
}

export default Drawing;