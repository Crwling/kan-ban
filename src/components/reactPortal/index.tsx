import { useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

export interface IReactPortalProps {
  children: React.ReactNode;
  wrapperId: string;
}


const ReactPortal: React.FC<IReactPortalProps> = ({ children, wrapperId }) => {
    const [wrapperElement, setWrapperElement] = useState<HTMLElement | null>(null);

    function createWrapperAndAppendToBody(wrapperId: string) {
      const wrapperElement = document.createElement('div');
      wrapperElement.setAttribute("id", wrapperId);
      document.body.appendChild(wrapperElement);
      return wrapperElement;
    }
  
    useLayoutEffect(() => {
      let element: HTMLElement | null = document.getElementById(wrapperId);
      let systemCreated = false;
      // if element is not found with wrapperId or wrapperId is not provided,
      // create and append to body
      //------------------и че там будет за ID если его нет???
      if (!element) {
        systemCreated = true;
        element = createWrapperAndAppendToBody(wrapperId);
      }
      setWrapperElement(element);

      return () => {
        //delete the programatically created element
        if (systemCreated && element?.parentNode) {
            element.parentNode.removeChild(element);
        }
      }
    }, [wrapperId]);
  
    // wrapperElement state will be null on the very first render.
    if (wrapperElement === null) return null;
  
    return createPortal(children, wrapperElement);
  }

export default ReactPortal
