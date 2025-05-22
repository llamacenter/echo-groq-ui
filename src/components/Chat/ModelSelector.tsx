
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
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
        <label className="text-sm font-medium text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" /> Model
        </label>
        <Select
          value={selectedModel.id}
          onValueChange={handleValueChange}
        >
          <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white/90 focus:ring-offset-slate-900">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            {models.map((model) => (
              <SelectItem 
                key={model.id} 
                value={model.id} 
                className="focus:bg-slate-700 focus:text-white"
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium">{model.name}</span>
                  <span className="text-xs text-slate-400">{model.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SlideIn>
  );
};
