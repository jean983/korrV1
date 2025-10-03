import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Download, FileText, Image, FileIcon, Calendar, User } from 'lucide-react';
import { ProjectDocument } from '../lib/mock-data';

interface FilePreviewDialogProps {
  file: ProjectDocument | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilePreviewDialog({ file, open, onOpenChange }: FilePreviewDialogProps) {
  if (!file) return null;

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf')) return FileText;
    return FileIcon;
  };

  const FileIconComponent = getFileIcon(file.type);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  const getFileTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      'report': 'Report',
      'drawing': 'Drawing',
      'photo': 'Photo',
      'data': 'Data',
      'specification': 'Specification',
      'other': 'Other'
    };
    return typeMap[type] || type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <FileIconComponent className="w-6 h-6 text-primary" />
            <span>{file.name}</span>
          </DialogTitle>
          <DialogDescription>
            Document details and preview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">File Type</p>
              <Badge variant="secondary">{getFileTypeLabel(file.type)}</Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">File Size</p>
              <p className="text-sm">{formatFileSize(file.size)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>Uploaded By</span>
              </p>
              <p className="text-sm">{file.uploadedBy}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Upload Date</span>
              </p>
              <p className="text-sm">
                {new Date(file.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Tags */}
          {file.tags && file.tags.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {file.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Preview Area */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Preview</p>
            <div className="border rounded-lg p-8 bg-muted/30 flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-3">
                <FileIconComponent className="w-16 h-16 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  File preview not available
                </p>
                <p className="text-xs text-muted-foreground">
                  In a production environment, this would display PDF previews,<br />
                  image thumbnails, or other file type previews.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
