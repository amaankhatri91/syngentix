import { useAppSelector } from "@/store";
import { ActionButton } from "./types";

interface ActionButtonsProps {
  actions: ActionButton[];
  row: any;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  row,
  className = "",
}) => {

  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {actions?.map((action, index) => (
        <button
          key={index}
          onClick={() => action.onClick(row)}
          title={action.label}
          aria-label={action.label}
        >
          {action.icon}
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
