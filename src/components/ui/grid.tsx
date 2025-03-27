
import React from 'react';
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gap?: number;
  columns?: number;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, children, gap = 4, columns = 12, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          `grid grid-cols-${columns} gap-${gap}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

interface ColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  span?: number;
  start?: number;
}

const Col = React.forwardRef<HTMLDivElement, ColProps>(
  ({ className, children, span = 1, start, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          `col-span-${span}`,
          start && `col-start-${start}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Col.displayName = "Col";

export { Grid, Col };
