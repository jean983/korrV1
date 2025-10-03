import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { FileText, Image, Database, FileSpreadsheet, File } from 'lucide-react';

interface FileUploadConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileSize: number;
  projectName: string;
  onConfirm: () => void;
}

export function FileUploadConfirmation({
  open,
  onOpenChange,
  fileName,
  fileSize,
  projectName,
  onConfirm
}: FileUploadConfirmationProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['pdf', 'doc', 'docx'].includes(ext || '')) return 'report';
    if (['dwg', 'dxf', 'dgn'].includes(ext || '')) return 'drawing';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return 'photo';
    if (['csv', 'xlsx', 'ags'].includes(ext || '')) return 'data';
    return 'document';
  };

  const getFileIcon = (filename: string) => {
    const type = getFileType(filename);
    switch (type) {
      case 'report':
        return FileText;
      case 'drawing':
        return FileSpreadsheet;
      case 'photo':
        return Image;
      case 'data':
        return Database;
      default:
        return File;
    }
  };

  const Icon = getFileIcon(fileName);
  const fileType = getFileType(fileName);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add File to Project?</AlertDialogTitle>
          <AlertDialogDescription>
            This file will be stored in the project folder and can be referenced in conversations.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 p-4 border rounded-lg bg-muted/30">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{fileName}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">{fileType}</Badge>
                <span className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Project:</strong> {projectName}
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Add to Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}