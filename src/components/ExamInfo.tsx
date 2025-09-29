import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExamService, type ExamInfo, type ExamData } from "@/services/examService";
import { 
  ArrowLeft,
  Calendar,
  Clock,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle
} from "lucide-react";

interface ExamInfoProps {
  onBack?: () => void;
}

export function ExamInfo({ onBack }: ExamInfoProps) {
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadExamData();
  }, []);

  const loadExamData = async () => {
    try {
      const data = await ExamService.getExamData();
      setExamData(data);
    } catch (error) {
      console.error('Error loading exam data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await ExamService.refreshExamData();
      setExamData(data);
    } catch (error) {
      console.error('Error refreshing exam data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('devam') || statusLower.includes('başvuru')) {
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    } else if (statusLower.includes('kapandı') || statusLower.includes('bitti')) {
      return <XCircle className="w-4 h-4 text-error" />;
    } else if (statusLower.includes('açılacak')) {
      return <Clock className="w-4 h-4 text-warning" />;
    }
    return <HelpCircle className="w-4 h-4 text-on-surface-variant" />;
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('devam') || statusLower.includes('başvuru')) {
      return "default";
    } else if (statusLower.includes('kapandı') || statusLower.includes('bitti')) {
      return "destructive";
    }
    return "secondary";
  };

  if (isLoading) {
    return (
      <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-on-surface">Sınav Bilgileri</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-surface-variant rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-variant rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-bold text-on-surface">Sınav Bilgileri</h1>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Yenile
        </Button>
      </div>

      {/* Next Exam Card */}
      {examData?.nextExam && (
        <Card className="mb-6 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Bir Sonraki Sınav
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {ExamService.getDaysUntilExam(examData.nextExam.date)}
              </div>
              <div className="text-sm text-on-surface-variant mb-1">
                gün kaldı
              </div>
              <Badge variant="secondary" className="mb-3">
                {examData.nextExam.name}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Sınav Tarihi:</span>
                <span className="text-sm font-medium text-on-surface">
                  {ExamService.formatExamDate(examData.nextExam.date)}
                </span>
              </div>
              
              {examData.nextExam.applicationEnd && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-on-surface-variant">Başvuru Bitiş:</span>
                  <span className="text-sm font-medium text-on-surface">
                    {ExamService.formatExamDate(examData.nextExam.applicationEnd)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(examData.nextExam.status)}
                  <span className="text-sm text-on-surface-variant">Durum:</span>
                </div>
                <Badge variant={getStatusBadgeVariant(examData.nextExam.status)}>
                  {examData.nextExam.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Exams List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-on-surface flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-primary" />
          Tüm Yaklaşan Sınavlar
        </h2>
        
        {examData?.upcomingExams.map((exam, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-on-surface mb-1">{exam.name}</h3>
                  <p className="text-sm text-on-surface-variant">
                    {ExamService.formatExamDate(exam.date)}
                  </p>
                </div>
                <Badge variant={exam.type === 'YDS' ? 'default' : 'secondary'}>
                  {exam.type}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">Kalan Gün:</span>
                  <span className="font-medium text-on-surface">
                    {ExamService.getDaysUntilExam(exam.date)} gün
                  </span>
                </div>
                
                {exam.applicationStart && exam.applicationEnd && (
                  <div className="text-xs text-on-surface-variant">
                    Başvuru: {new Date(exam.applicationStart).toLocaleDateString('tr-TR')} - {new Date(exam.applicationEnd).toLocaleDateString('tr-TR')}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(exam.status)}
                    <Badge variant={getStatusBadgeVariant(exam.status)} className="text-xs">
                      {exam.status}
                    </Badge>
                  </div>
                  {exam.isActive && (
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Başvur
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Footer */}
      <Card className="mt-6 bg-surface-variant/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium text-on-surface mb-1">
                Önemli Bilgi
              </p>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Bu bilgiler ÖSYM'nin resmi web sitesinden alınmaktadır. 
                Güncel tarih ve başvuru koşulları için mutlaka ÖSYM'nin resmi sitesini kontrol edin.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-3 gap-2"
            onClick={() => window.open('https://ais.osym.gov.tr/', '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
            ÖSYM Resmi Sitesi
          </Button>
        </CardContent>
      </Card>

      {examData && (
        <p className="text-xs text-on-surface-variant text-center mt-4">
          Son güncellenme: {new Date(examData.lastUpdated).toLocaleString('tr-TR')}
        </p>
      )}
    </div>
  );
}