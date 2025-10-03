import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MessageCircle, Database, FileText, ChevronRight } from 'lucide-react';

interface DataSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  onAskQuestion: (question: string) => void;
}

// Mock data for different source types
const getSampleData = (sourceName: string) => {
  if (sourceName.includes('Highway 401')) {
    return {
      type: 'Soil Testing Data',
      records: [
        { depth: '0-2m', soilType: 'Sandy Silt', moisture: '12%', density: '1.85 g/cm³', cohesion: '15 kPa' },
        { depth: '2-4m', soilType: 'Clay', moisture: '18%', density: '1.92 g/cm³', cohesion: '45 kPa' },
        { depth: '4-6m', soilType: 'Silty Clay', moisture: '22%', density: '1.88 g/cm³', cohesion: '35 kPa' },
        { depth: '6-8m', soilType: 'Sandy Clay', moisture: '16%', density: '1.95 g/cm³', cohesion: '28 kPa' },
        { depth: '8-10m', soilType: 'Dense Sand', moisture: '8%', density: '2.05 g/cm³', cohesion: 'N/A' },
      ],
      recommendedQuestions: [
        'What is the bearing capacity at 4 meters depth?',
        'Analyze the soil composition for foundation design',
        'What are the settlement predictions for this soil profile?',
        'Compare this data with similar highway projects'
      ]
    };
  } else if (sourceName.includes('Residential')) {
    return {
      type: 'Site Investigation Report',
      records: [
        { location: 'BH-1', elevation: '125.5m', groundwater: '3.2m', bedrock: '12m', classification: 'Good' },
        { location: 'BH-2', elevation: '124.8m', groundwater: '3.5m', bedrock: '11.5m', classification: 'Good' },
        { location: 'BH-3', elevation: '126.1m', groundwater: '2.8m', bedrock: '13m', classification: 'Fair' },
        { location: 'BH-4', elevation: '125.0m', groundwater: '3.0m', bedrock: '12.5m', classification: 'Good' },
      ],
      recommendedQuestions: [
        'What foundation type is recommended for this site?',
        'How does groundwater level affect construction?',
        'What are the excavation challenges at this site?',
        'Analyze the bedrock depth variation across boreholes'
      ]
    };
  } else {
    return {
      type: 'Project Documentation',
      records: [
        { parameter: 'Project Area', value: '15,000 m²', unit: 'Area', status: 'Confirmed' },
        { parameter: 'Max Depth', value: '20 m', unit: 'Length', status: 'Confirmed' },
        { parameter: 'Soil Samples', value: '45', unit: 'Count', status: 'Complete' },
        { parameter: 'Test Pits', value: '12', unit: 'Count', status: 'Complete' },
      ],
      recommendedQuestions: [
        'Summarize the key findings from this project',
        'What are the main geotechnical concerns?',
        'Compare this with industry standards',
        'What additional testing is recommended?'
      ]
    };
  }
};

export function DataSourceDialog({
  open,
  onOpenChange,
  sourceName,
  onAskQuestion
}: DataSourceDialogProps) {
  const data = getSampleData(sourceName);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleAskQuestion = (question: string) => {
    setSelectedQuestion(question);
    onAskQuestion(question);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            {sourceName}
          </DialogTitle>
          <DialogDescription>
            Explore data and ask questions about this source
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="data">
              <FileText className="w-4 h-4 mr-2" />
              Data View
            </TabsTrigger>
            <TabsTrigger value="questions">
              <MessageCircle className="w-4 h-4 mr-2" />
              Suggested Questions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{data.type}</span>
                  <Badge variant="outline">{data.records.length} records</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(data.records[0]).map((key) => (
                          <TableHead key={key} className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.records.map((record, idx) => (
                        <TableRow key={idx}>
                          {Object.values(record).map((value, vidx) => (
                            <TableCell key={vidx}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  This data is now available as context for your questions
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-4">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click any question below to ask it in the chat with this data as context
              </p>
              
              {data.recommendedQuestions.map((question, idx) => (
                <Card
                  key={idx}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => handleAskQuestion(question)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                        <p className="text-sm">{question}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm">
                💡 <span className="font-medium">Tip:</span> These questions are generated based on the data type and content. 
                You can also ask your own questions about this data source.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
