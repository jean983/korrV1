import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, FileText, Mic, Paperclip, Pickaxe, Eye } from 'lucide-react';
import { ChatMessage as ChatMessageType, Asset, ReasoningStep } from '../lib/mock-data';
import { ReasoningPopup } from './reasoning-popup';
import { ContextSettings } from './context-settings';
import { FileUploadConfirmation } from './file-upload-confirmation';
import { DigDeeperContent } from './dig-deeper-content';
import { SourcePreviewDialog } from './source-preview-dialog';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  context: string;
  assets: Asset[];
  projectName: string;
  onFileUpload?: (file: File) => void;
  onContextChange?: (newContext: string) => void;
  onDigDeeper?: (sourceName: string) => void;
}

export function ChatInterface({ messages, onSendMessage, context, assets, projectName, onFileUpload, onContextChange, onDigDeeper }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>(
    assets.slice(0, 3).map(a => a.id) // Default: select first 3 assets
  );
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showFileConfirmation, setShowFileConfirmation] = useState(false);
  const [sourcePreview, setSourcePreview] = useState<{ open: boolean; source: string }>({
    open: false,
    source: ''
  });

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollViewportRef.current) {
      const viewport = scrollViewportRef.current;
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAssetToggle = (assetId: string) => {
    setSelectedAssets(prev =>
      prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
    
    // Trigger context change notification
    const selectedAssetNames = assets
      .filter(a => selectedAssets.includes(a.id) || a.id === assetId)
      .map(a => a.name)
      .join(', ');
    
    if (onContextChange) {
      onContextChange(`Context updated to: ${selectedAssetNames || 'All data'}`);
    }
  };

  const handleDigDeeper = (sourceName: string) => {
    // Call the parent's dig deeper handler if available
    if (onDigDeeper) {
      onDigDeeper(sourceName);
    } else {
      // Fallback: Send the question to trigger dig deeper response
      onSendMessage(`Dig deeper into ${sourceName}`);
    }
  };

  const handleSourceClick = (sourceName: string) => {
    // Find the asset that matches this source name
    const matchingAsset = assets.find(a => a.name === sourceName);
    setSourcePreview({ open: true, source: sourceName, asset: matchingAsset });
  };

  // Generate default reasoning for messages without explicit reasoning
  const getDefaultReasoning = (message: ChatMessageType): ReasoningStep[] => {
    if (message.reasoning && message.reasoning.length > 0) {
      return message.reasoning;
    }
    
    // Generate simple default reasoning
    return [
      {
        step: 1,
        description: 'Analyzed your question and identified relevant data sources',
        sources: message.sources || []
      },
      {
        step: 2,
        description: 'Retrieved and processed information from project database',
        sources: message.sources || []
      },
      {
        step: 3,
        description: 'Applied geotechnical engineering principles and standards',
        sources: ['Eurocode 7', 'Industry best practices']
      },
      {
        step: 4,
        description: 'Formulated response with relevant calculations and recommendations',
        sources: []
      }
    ];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingFile(file);
      setShowFileConfirmation(true);
    }
  };

  const handleFileConfirm = () => {
    if (pendingFile && onFileUpload) {
      onFileUpload(pendingFile);
      // Add a system message about the file upload
      onSendMessage(`[File uploaded: ${pendingFile.name}] Can you analyze this file?`);
    }
    setPendingFile(null);
    setShowFileConfirmation(false);
  };

  const suggestedQuestions = [
    'Analyze soil bearing capacity for this site',
    'What are the groundwater conditions?',
    'Generate a foundation design recommendation',
    'Check compliance with Eurocode 7'
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Messages - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-3 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {message.role === 'assistant' ? (
                      <div className="w-full h-full bg-primary flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                    ) : (
                      <AvatarFallback>SJ</AvatarFallback>
                    )}
                  </Avatar>

                  {/* Message Content */}
                  <div className="flex flex-col space-y-2">
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      
                      {/* Dig Deeper Content - Inline */}
                      {message.digDeeper && (
                        <DigDeeperContent 
                          data={message.digDeeper}
                          onAskQuestion={onSendMessage}
                          onSourceClick={handleSourceClick}
                        />
                      )}
                    </div>

                    {/* Sources and Actions */}
                    {message.role === 'assistant' && (
                      <div className="flex flex-wrap gap-2 items-center">
                        {/* Source badges - clickable */}
                        {message.sources && message.sources.length > 0 && (
                          <>
                            {message.sources.map((source, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-muted transition-colors"
                                onClick={() => handleSourceClick(source)}
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                {source}
                              </Badge>
                            ))}
                          </>
                        )}
                        
                        {/* Action buttons - more prominent */}
                        <div className="flex gap-2 ml-auto">
                          {/* View Reasoning button - always shown for assistant messages */}
                          <ReasoningPopup 
                            reasoning={getDefaultReasoning(message)}
                            messageContent={message.content}
                            trigger={
                              <Button
                                variant="secondary"
                                size="sm"
                                className="h-7 text-xs gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                View Reasoning
                              </Button>
                            }
                          />
                          
                          {/* Dig Deeper button - shown when sources are available and not already digging deeper */}
                          {message.sources && message.sources.length > 0 && !message.digDeeper && (
                            <Button
                              variant="default"
                              size="sm"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => handleDigDeeper(message.sources![0])}
                            >
                              <Pickaxe className="w-3.5 h-3.5" />
                              Dig Deeper
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Suggested Questions - Fixed (only shown when few messages) */}
      {messages.length <= 1 && (
        <div className="p-4 border-t flex-shrink-0 bg-background">
          <p className="text-sm text-muted-foreground mb-2">Suggested questions:</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestedQuestions.map((question, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs h-auto py-2 text-left justify-start"
                onClick={() => setInput(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Fixed at Bottom */}
      <CardContent className="p-4 border-t flex-shrink-0 bg-muted/30">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Input Label */}
          <div className="flex items-center space-x-2">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="text-xs">SJ</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">Your Message</span>
          </div>

          {/* Main Input Area */}
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about soil conditions, foundation design, compliance, or any geotechnical question..."
              className="min-h-[80px] resize-none pr-24 bg-background"
              rows={3}
            />
            
            {/* Send button overlay */}
            <div className="absolute bottom-2 right-2 flex items-center space-x-2">
              <Button 
                type="submit" 
                size="sm"
                disabled={!input.trim()}
                className="h-8"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ContextSettings
                assets={assets}
                selectedAssets={selectedAssets}
                onAssetToggle={handleAssetToggle}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="h-8 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-3 h-3 mr-1" />
                Attach File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                className="h-8 text-xs"
                disabled
              >
                <Mic className="w-3 h-3 mr-1" />
                Voice
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-muted border rounded text-xs">Shift+Enter</kbd> for new line
            </p>
          </div>
        </form>
      </CardContent>

      {/* File Upload Confirmation Dialog */}
      {pendingFile && (
        <FileUploadConfirmation
          open={showFileConfirmation}
          onOpenChange={setShowFileConfirmation}
          fileName={pendingFile.name}
          fileSize={pendingFile.size}
          projectName={projectName}
          onConfirm={handleFileConfirm}
        />
      )}

      {/* Source Preview Dialog */}
      <SourcePreviewDialog
        open={sourcePreview.open}
        onOpenChange={(open) => setSourcePreview({ ...sourcePreview, open })}
        sourceName={sourcePreview.source}
        asset={sourcePreview.asset}
      />
    </div>
  );
}
