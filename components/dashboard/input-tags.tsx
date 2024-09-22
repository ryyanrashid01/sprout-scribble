"use client";

import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction, forwardRef, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { VariantsWithImagesTags } from "@/lib/infer-types";
import { Button } from "@/components/ui/button";

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  variant?: VariantsWithImagesTags;
  handleCopy: () => void;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ onChange, value, handleCopy, ...props }, ref) => {
    const [pendingDataPoint, setPendingDataPoint] = useState("");
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    function addPendingDataPoint() {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    }

    const handleDivClick = () => {
      inputRef.current?.focus();
    };

    return (
      <div>
        <div
          className={cn(
            "w-full rounded-lg border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            focused
              ? "ring-offset-2 outline-none ring-ring ring-2"
              : "ring-offset-0 outline-none ring-ring ring-0"
          )}
          onClick={handleDivClick}
        >
          <motion.div className="rounded-md min-h-[2.5rem] p-2 flex gap-2 flex-wrap items-center">
            <AnimatePresence>
              {value.map((tag) => (
                <motion.div
                  animate={{ scale: 1 }}
                  initial={{ scale: 0 }}
                  exit={{ scale: 0 }}
                  key={tag}
                >
                  <Badge variant={"secondary"}>
                    {tag}
                    <button
                      className="w-3 ml-1"
                      type="button"
                      onClick={() => onChange(value.filter((i) => i !== tag))}
                    >
                      <XIcon className="w-3" />
                    </button>
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex">
              <Input
                ref={(el) => {
                  inputRef.current = el;
                  if (typeof ref === "function") ref(el);
                  else if (ref) ref.current = el;
                }}
                className="focus-visible:border-transparent border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                placeholder="Add tags"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPendingDataPoint();
                  }
                  if (
                    e.key === "Backspace" &&
                    !pendingDataPoint &&
                    value.length > 0
                  ) {
                    e.preventDefault();
                    const newValue = [...value];
                    newValue.pop();
                    onChange(newValue);
                  }
                }}
                value={pendingDataPoint}
                onFocus={() => setFocused(true)}
                onBlurCapture={() => setFocused(false)}
                onChange={(e) => setPendingDataPoint(e.target.value)}
                {...props}
              />
            </div>
          </motion.div>
        </div>
        {props.variant && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant={"link"}
              className="text-sm scale-90"
              onClick={() => handleCopy()}
            >
              Use tags from the most recently added variant
            </Button>
          </div>
        )}
      </div>
    );
  }
);

InputTags.displayName = "InputTags";
