import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Pickaxe, ChevronRight, ExternalLink } from 'lucide-react';
import { DigDeeperData } from '../lib/mock-data';

interface DigDeeperContentProps {
  data: DigDeeperData;
  onAskQuestion: (question: string) => void;
  onSourceClick?: (sourceName: string) => void;
}

export function DigDeeperContent({ data, onAskQuestion, onSourceClick }: DigDeeperContentProps) {
  // Limit preview to first 3 items per table
  const MAX_PREVIEW_ITEMS = 3;
  
  return (
    <div className="mt-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm">
        <Pickaxe className="w-4 h-4 text-primary" />
        <span className="font-medium">Dig Deeper: {data.sourceName}</span>
        <Badge variant="outline" className="ml-auto">Data Preview</Badge>
      </div>

      {/* View Full Source Button - Prominent */}
      {onSourceClick && (
        <Button
          variant="default"
          size="sm"
          className="w-full gap-2"
          onClick={() => onSourceClick(data.sourceName)}
        >
          <ExternalLink className="w-4 h-4" />
          View Full Source Data
        </Button>
      )}

      <Separator />

      {/* Data Tables - Preview Only */}
      <div className="space-y-3">
        {data.tables.map((table, idx) => {
          const previewData = table.data.slice(0, MAX_PREVIEW_ITEMS);
          const hasMore = table.data.length > MAX_PREVIEW_ITEMS;
          
          return (
            <Card key={idx} className="p-3 bg-muted/50 border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">{table.title}</h4>
                {hasMore && (
                  <Badge variant="secondary" className="text-xs">
                    +{table.data.length - MAX_PREVIEW_ITEMS} more
                  </Badge>
                )}
              </div>
              <div className="space-y-1.5">
                {previewData.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recommended Questions */}
      {data.recommendedQuestions.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <p className="text-sm font-medium">Recommended Questions</p>
            <div className="space-y-2">
              {data.recommendedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-between text-left h-auto py-2 px-3"
                  onClick={() => onAskQuestion(question)}
                >
                  <span className="text-sm">{question}</span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 ml-2" />
                </Button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
