import React, { useState, useEffect } from "react";
import useTheme from "@/utils/hooks/useTheme";

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showReadMore?: boolean;
  readMoreText?: string;
  readLessText?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 100,
  className = "",
  showReadMore = true,
  readMoreText = "Read more",
  readLessText = "Read less",
  as: Component = "p",
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  useEffect(() => {
    if (text && text.length > maxLength) {
      setNeedsTruncation(true);
    } else {
      setNeedsTruncation(false);
    }
  }, [text, maxLength]);

  const displayText = isExpanded || !needsTruncation 
    ? text 
    : `${text.slice(0, maxLength)}...`;

  if (!text || text === "-") {
    return <span className={className}>-</span>;
  }

  return (
    <div className="flex flex-col">
      <Component className={className}>
        {displayText}
      </Component>
      {showReadMore && needsTruncation && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-xs mt-1 self-start hover:underline transition-colors ${
            isDark ? "text-[#BDC9F5]" : "text-[#646567]"
          }`}
          aria-label={isExpanded ? readLessText : readMoreText}
        >
          {isExpanded ? readLessText : readMoreText}
        </button>
      )}
    </div>
  );
};

export default TruncatedText;

