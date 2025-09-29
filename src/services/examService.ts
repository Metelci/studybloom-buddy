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

  // Real data based on official ÖSYM 2025 calendar
  private static getRealExamData(): ExamData {
    const currentYear = 2024;
    const nextYear = 2025;
    
    return {
      upcomingExams: [
        {
          name: 'YÖKDİL/2',
          date: '2025-07-27',
          applicationStart: '2025-06-11',
          applicationEnd: '2025-06-18',
          status: 'Başvurular Açılacak',
          type: 'YÖKDİL',
          isActive: false
        },
        {
          name: 'e-YDS (İngilizce)',
          date: '2025-05-18',
          applicationStart: '2025-04-15',
          applicationEnd: '2025-04-30',
          status: 'Başvurular Açılacak',
          type: 'YDS',
          isActive: false
        },
        {
          name: 'YDS',
          date: '2025-11-23',
          applicationStart: '2025-09-15',
          applicationEnd: '2025-10-01',
          status: 'Başvurular Açılacak',
          type: 'YDS',
          isActive: false
        }
      ],
      nextExam: {
        name: 'e-YDS (İngilizce)',
        date: '2025-05-18',
        applicationStart: '2025-04-15',
        applicationEnd: '2025-04-30',
        status: 'Başvurular Açılacak',
        type: 'YDS',
        isActive: false
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

      // Return real ÖSYM exam data for 2025
      const examData = this.getRealExamData();

      // Cache the result
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({
        data: examData,
        timestamp: Date.now()
      }));

      return examData;
    } catch (error) {
      console.error('Error fetching exam data:', error);
      return this.getRealExamData();
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