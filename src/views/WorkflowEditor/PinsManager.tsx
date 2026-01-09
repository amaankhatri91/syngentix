import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Add, EditIcon } from "@/assets/app-icons";
import DeleteIcon from "@/assets/app-icons/DeleteIcon";
import CancelIcon from "@/assets/app-icons/CancelIcon";
import { HiCheck } from "react-icons/hi2";
import useTheme from "@/utils/hooks/useTheme";
import { useSocketConnection } from "@/utils/hooks/useSocketConnection";
import { NodePin } from "./type";
import { createPinPayload } from "@/utils/common";

interface PinsManagerProps {
  pins: NodePin[];
  onPinsChange: (pins: NodePin[]) => void;
  title: string;
  pinType: "input" | "output" | "nextPin";
  allowAdd?: boolean;
  defaultPinName?: string;
  workflowId?: string;
  nodeId?: string;
}

const PinsManager: React.FC<PinsManagerProps> = ({
  pins,
  onPinsChange,
  title,
  pinType,
  allowAdd = true,
  defaultPinName = "Pin",
  workflowId,
  nodeId,
}) => {
  const { isDark } = useTheme();
  const { emit } = useSocketConnection();
  const [localPins, setLocalPins] = useState<NodePin[]>(pins);
  
  // State for add form
  const [isAdding, setIsAdding] = useState(false);
  const [newPinName, setNewPinName] = useState("");
  
  // State for editing
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // Update local state when pins prop changes
  useEffect(() => {
    setLocalPins(pins);
  }, [pins]);

  const handleAddPin = () => {
    if (newPinName.trim() && workflowId && nodeId) {
      const newPin: NodePin = {
        id: `${pinType}-${Date.now()}`,
        name: newPinName.trim(),
        type: "any",
        required: false,
        custom: true,
      };
      const updatedPins = [...localPins, newPin];
      setLocalPins(updatedPins);
      onPinsChange(updatedPins);
      // Emit pin:add event
      const payload = createPinPayload({
        pin: newPin,
        workflowId,
        nodeId,
        pinType,
      });
      console.log("Pin add payload:", payload);
      emit("pin:add", payload);
      setIsAdding(false);
      setNewPinName("");
    }
  };

  const handleSaveEdit = (index: number) => {
    if (editingName.trim()) {
      const updatedPins = [...localPins];
      const updatedPin = {
        ...updatedPins[index],
        name: editingName.trim(),
      };
      updatedPins[index] = updatedPin;
      setLocalPins(updatedPins);
      onPinsChange(updatedPins);
      setEditingIndex(null);
      setEditingName("");
    }
  };

  const handleDeletePin = (index: number) => {
    const pinToDelete = localPins[index];
    const updatedPins = localPins.filter((_, i) => i !== index);
    setLocalPins(updatedPins);
    onPinsChange(updatedPins);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewPinName("");
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingName("");
  };

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-base font-medium ${
            isDark ? "text-white" : "text-[#162230]"
          }`}
        >
          {title}
        </h3>
        {allowAdd && !isAdding && (
          <Button
            type="button"
            onClick={() => {
              setIsAdding(true);
              setNewPinName("");
            }}
            icon={<Add size={18} />}
            className="!px-3 !py-1.5 !rounded-md !text-white !bg-gradient-to-r from-[#9133ea] to-[#2962eb] text-sm font-medium"
          >
            Add {defaultPinName}
          </Button>
        )}
      </div>

      {isAdding && allowAdd && (
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            value={newPinName}
            onChange={(e) => setNewPinName(e.target.value)}
            placeholder="Enter pin name"
            className={`flex-1 px-3 py-2 text-sm rounded-md border focus:outline-none ${
              isDark
                ? "bg-[#0F141D] border-[#2B3643] text-white placeholder-gray-500"
                : "bg-white border-[#E3E6EB] shadow-sm text-[#162230] placeholder-gray-400"
            }`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddPin();
              } else if (e.key === "Escape") {
                handleCancelAdd();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddPin}
            className={`w-[26px] h-[26px] rounded-md flex items-center justify-center transition-colors ${
              newPinName.trim()
                ? isDark
                  ? "bg-[#0C1116] border border-[#394757]"
                  : "bg-white border border-gray-200"
                : isDark
                ? "bg-[#2B3643] cursor-not-allowed"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!newPinName.trim()}
          >
            <HiCheck
              className={
                newPinName.trim()
                  ? isDark
                    ? "text-white"
                    : "text-[#162230]"
                  : isDark
                  ? "text-gray-500"
                  : "text-gray-400"
              }
              size={16}
            />
          </button>
          <button
            type="button"
            onClick={handleCancelAdd}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors`}
          >
            <CancelIcon theme={isDark ? "dark" : "light"} size={28} />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {localPins.map((pin, index) => {
          const isEditing = editingIndex === index;
          return (
            <div
              key={pin.id || index}
              className={`flex items-center gap-3 ${isEditing ? "" : "cursor-not-allowed"}`}
            >
              <div
                className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-md border ${
                  isDark
                    ? "bg-[#0F141D] border-[#2B3643]"
                    : "bg-white border-[#E3E6EB] shadow-sm"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className={`flex-1 text-sm font-medium bg-transparent border-0 outline-none ${
                          isDark ? "text-white" : "text-[#162230]"
                        }`}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveEdit(index);
                          } else if (e.key === "Escape") {
                            handleCancelEdit();
                          }
                        }}
                      />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-white" : "text-[#162230]"
                        }`}
                      >
                        {pin.name}
                      </span>
                    )}
                    {!pin.custom && !isEditing && (
                      <span
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Default
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {pin.custom && (
                <div
                  className={`flex items-stretch gap-0 border rounded-md overflow-hidden ${
                    isDark
                      ? "bg-[#0F141D] border-[#2B3643]"
                      : "bg-white border-[#E3E6EB] shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isEditing) {
                        handleSaveEdit(index);
                      } else {
                        setEditingIndex(index);
                        setEditingName(pin.name);
                      }
                    }}
                    disabled={isEditing && !editingName.trim()}
                    className={`p-2 transition-colors flex items-center ${
                      isEditing && !editingName.trim()
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-opacity-10"
                    }`}
                    title={isEditing ? "Save" : "Edit"}
                  >
                    {isEditing ? (
                      <div
                        className={`w-[12px] h-[12px] rounded-md flex items-center justify-center transition-colors`}
                      >
                        <HiCheck
                          className={
                            editingName.trim()
                              ? isDark
                                ? "text-white"
                                : "text-[#162230]"
                              : isDark
                              ? "text-gray-500"
                              : "text-gray-400"
                          }
                          size={16}
                        />
                      </div>
                    ) : (
                      <EditIcon height={18} theme={isDark ? "dark" : "light"} />
                    )}
                  </button>
                  {!isEditing && (
                    <>
                      <div className="flex items-center">
                        <div
                          className={`border h-5 ${
                            isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"
                          }`}
                        ></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeletePin(index)}
                        className="p-1.5 hover:bg-opacity-10 transition-colors flex items-center"
                        title="Delete"
                      >
                        <DeleteIcon height={18} color={"#F54960"} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {localPins.length === 0 && (
          <p
            className={`text-sm text-center py-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No {title.toLowerCase()}
          </p>
        )}
      </div>
    </div>
  );
};

export default PinsManager;

