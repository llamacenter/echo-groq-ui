
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ModelOption } from '@/types/chat';
import { SlideIn } from '@/components/UI/AnimatedContainer';

interface ModelSelectorProps {
  models: ModelOption[];
  selectedModel: ModelOption;
  onSelect: (model: ModelOption) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelect,
}) => {
  const handleValueChange = (value: string) => {
    const model = models.find(m => m.id === value);
    if (model) {
      onSelect(model);
    }
  };

  return (
    <SlideIn className="w-full max-w-xs">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Model</label>
        <Select
          value={selectedModel.id}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id} className="flex flex-col items-start">
                <span className="font-medium">{model.name}</span>
                <span className="text-xs text-gray-500">{model.description}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SlideIn>
  );
};
