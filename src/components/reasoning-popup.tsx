import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Brain, FileText, CheckCircle } from 'lucide-react';
import { ReasoningStep } from '../lib/mock-data';

interface ReasoningPopupProps {
  reasoning: ReasoningStep[];
  messageContent: string;
  trigger?: React.ReactNode;
}

export function ReasoningPopup({ reasoning, messageContent, trigger }: ReasoningPopupProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          <div className="inline-block cursor-pointer">{trigger}</div>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs">
            <Brain className="w-3 h-3 mr-1" />
            View Reasoning
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>AI Reasoning Process</span>
          </DialogTitle>
          <DialogDescription>
            Step-by-step analysis of how this response was formulated
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {reasoning.map((step, idx) => (
              <div key={idx} className="relative pl-12 pb-4 ml-4 border-l-2 border-muted last:border-l-0">
                {/* Step indicator */}
                <div className="absolute left-0 -translate-x-1/2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs text-primary-foreground">{step.step}</span>
                </div>
                
                {/* Step content */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <p className="text-sm">{step.description}</p>
                  </div>
                  
                  {/* Sources for this step */}
                  {step.sources && step.sources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 ml-6">
                      {step.sources.map((source, sourceIdx) => (
                        <Badge
                          key={sourceIdx}
                          variant="outline"
                          className="text-xs h-6 bg-muted/50"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          {source}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
