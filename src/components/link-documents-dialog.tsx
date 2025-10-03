import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { 
  FileText, 
  Upload, 
  Search, 
  Link2,
  X
} from 'lucide-react';
import { ProjectDocument, mockDocuments } from '../lib/mock-data';

interface LinkDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLinkedFiles: string[];
  onSave: (linkedFileIds: string[]) => void;
  projectId: string;
}

export function LinkDocumentsDialog({
  open,
  onOpenChange,
  currentLinkedFiles,
  onSave,
  projectId
}: LinkDocumentsDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>(currentLinkedFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const projectDocuments = mockDocuments.filter(doc => doc.projectId === projectId);
  
  const filteredDocuments = projectDocuments.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggleFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(selectedFiles);
    onOpenChange(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Link or Upload Documents</DialogTitle>
          <DialogDescription>
            Link existing documents or upload new files to this checklist item
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link">
              <Link2 className="w-4 h-4 mr-2" />
              Link Existing
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="w-4 h-4 mr-2" />
              Upload New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 mt-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Document List */}
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-2">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents found</p>
                  </div>
                ) : (
                  filteredDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={selectedFiles.includes(doc.id)}
                        onCheckedChange={() => handleToggleFile(doc.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <Label
                          htmlFor={`doc-${doc.id}`}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="truncate">{doc.name}</span>
                          </div>
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(doc.size)}
                          </p>
                          {doc.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Selected Count */}
            {selectedFiles.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedFiles.length} document(s) selected
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
              <Input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF, Images, Documents (Max 10MB each)
                </p>
              </Label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <ScrollArea className="h-[200px] border rounded-lg">
                <div className="p-4 space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-card"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUploadedFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <p className="text-xs text-muted-foreground">
              Note: In production, files would be uploaded to your storage backend
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Link2 className="w-4 h-4 mr-2" />
            Save Links
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
