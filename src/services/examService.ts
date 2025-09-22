interface ExamInfo {
  name: string;
  date: string;
  applicationStart?: string;
  applicationEnd?: string;
  status: string;
  type: 'YDS' | 'YÖKDİL' | 'OTHER';
  isActive: boolean;
}

interface ExamData {
  upcomingExams: ExamInfo[];
  nextExam: ExamInfo | null;
  lastUpdated: string;
}

export class ExamService {
  private static readonly CACHE_KEY = 'osym_exam_data';
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  // Mock data based on typical YDS/YÖKDİL schedule - this will be replaced with real data
  private static getMockExamData(): ExamData {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    
    return {
      upcomingExams: [
        {
          name: 'YDS',
          date: `${nextYear}-03-15`,
          applicationStart: `${currentYear}-12-01`,
          applicationEnd: `${currentYear}-12-15`,
          status: 'Başvurular Devam Ediyor',
          type: 'YDS',
          isActive: true
        },
        {
          name: 'YÖKDİL',
          date: `${nextYear}-04-20`,
          applicationStart: `${currentYear}-12-20`,
          applicationEnd: `${nextYear}-01-10`,
          status: 'Başvurular Açılacak',
          type: 'YÖKDİL',
          isActive: false
        },
        {
          name: 'YDS',
          date: `${nextYear}-10-15`,
          applicationStart: `${nextYear}-07-01`,
          applicationEnd: `${nextYear}-07-15`,
          status: 'Başvurular Açılacak',
          type: 'YDS',
          isActive: false
        }
      ],
      nextExam: {
        name: 'YDS',
        date: `${nextYear}-03-15`,
        applicationStart: `${currentYear}-12-01`,
        applicationEnd: `${currentYear}-12-15`,
        status: 'Başvurular Devam Ediyor',
        type: 'YDS',
        isActive: true
      },
      lastUpdated: new Date().toISOString()
    };
  }

  static async getExamData(): Promise<ExamData> {
    try {
      // Check cache first
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < this.CACHE_DURATION) {
          return data;
        }
      }

      // For now, return mock data. In a real implementation, this would fetch from ÖSYM API
      const examData = this.getMockExamData();

      // Cache the result
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: examData,
        timestamp: Date.now()
      }));

      return examData;
    } catch (error) {
      console.error('Error fetching exam data:', error);
      return this.getMockExamData();
    }
  }

  static getDaysUntilExam(examDate: string): number {
    const exam = new Date(examDate);
    const today = new Date();
    const diffTime = exam.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  static formatExamDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static getApplicationStatus(exam: ExamInfo): 'not-started' | 'open' | 'closed' | 'exam-completed' {
    const today = new Date();
    const examDate = new Date(exam.date);
    
    if (today > examDate) {
      return 'exam-completed';
    }
    
    if (exam.applicationStart && exam.applicationEnd) {
      const appStart = new Date(exam.applicationStart);
      const appEnd = new Date(exam.applicationEnd);
      
      if (today < appStart) {
        return 'not-started';
      } else if (today >= appStart && today <= appEnd) {
        return 'open';
      } else {
        return 'closed';
      }
    }
    
    return 'not-started';
  }

  static async refreshExamData(): Promise<ExamData> {
    // Clear cache and fetch fresh data
    localStorage.removeItem(this.CACHE_KEY);
    return this.getExamData();
  }
}

export type { ExamInfo, ExamData };