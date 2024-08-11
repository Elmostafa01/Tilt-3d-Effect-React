import { createContext , useContext, useState, useRef, useEffect, useCallback } from "react";
import { cn } from "./utils/cn";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined>(undefined)

const useMouseEnter = () => {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider")
  }
  return context;
}


export const CardContainer = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {

  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsMouseEnter(true);
    if (!containerRef.current) return;
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEnter(false);
    containerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEnter, setIsMouseEnter]}>
      <div
      style={{perspective: "1000px"}}
       className="flex items-center justify-center py-20"
       >
        <div
          ref={containerRef}
          style={{transformStyle: "preserve-3d"}}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className={cn("relative flex items-center justify-center transition-all duration-200 ease-linear", className)}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>

  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("[transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
};

export const CardItem = ({
  component: Component = "div",
  children,
  className,
  translateZ = 0,
  ...rest
}: {
  component?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  trabslateZ?: number | string;
  [key: string]: unknown;
}) => {

  const ref = useRef<HTMLDivElement>(null);

  const [isMouseEntered] = useMouseEnter();

  const handleAnimations = useCallback(() => {
    if (!ref.current) return;

    if(isMouseEntered) {
      ref.current.style.transform = `translateZ(${translateZ}px)`;
    } else {
      ref.current.style.transform = `translateZ(0px)`;
    }
  }, [isMouseEntered, translateZ]);

  useEffect(() => {
    handleAnimations();
  }, [handleAnimations]);


  return (
    <Component ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Component>
  );
};
