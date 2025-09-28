import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  Target, 
  BookOpen, 
  PenTool, 
  Brain, 
  Headphones,
  Star,
  ChevronRight,
  Sparkles,
  Check
} from "lucide-react";

interface StudyPlanCreatorProps {
  onClose: () => void;
  onPlanCreated: (plan: any) => void;
}

interface StudyPlan {
  timeframe: 'short' | 'medium' | 'long'; // 1-3 months, 3-6 months, 6+ months
  hoursPerWeek: number;
  level: 'elementary' | 'intermediate' | 'advanced';
  focusAreas: string[];
  examDate?: string;
}

// Raymond Murphy book references - appropriate educational use
const murphyBooks = {
  elementary: {
    title: "Essential Grammar in Use (Red Book)",
    author: "Raymond Murphy",
    description: "Perfect for beginners and elementary level students",
    topics: [
      "Present tenses", "Past tenses", "Present perfect", "Passive voice",
      "Future forms", "Modal verbs", "If sentences", "Reported speech",
      "Questions", "Articles and nouns", "Pronouns", "Adjectives and adverbs"
    ]
  },
  intermediate: {
    title: "English Grammar in Use (Blue Book)", 
    author: "Raymond Murphy",
    description: "The world's best-selling grammar book for intermediate learners",
    topics: [
      "Present and past", "Present perfect and past", "Future", "Modal verbs",
      "If and wish", "Passive", "Reported speech", "Questions and auxiliary verbs",
      "Articles and nouns", "Pronouns and determiners", "Relative clauses", "Adjectives and adverbs"
    ]
  },
  advanced: {
    title: "Advanced Grammar in Use (Green Book)",
    author: "Raymond Murphy", 
    description: "For advanced learners who want to perfect their English",
    topics: [
      "Tenses and time", "Modality", "The passive", "Infinitives and gerunds",
      "Articles", "Relative clauses", "Conditionals", "Emphasis and focus",
      "Cohesion and discourse", "Word order and emphasis", "Prepositions", "Adverbials"
    ]
  }
};

export function StudyPlanCreator({ onClose, onPlanCreated }: StudyPlanCreatorProps) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<StudyPlan>({
    timeframe: 'medium',
    hoursPerWeek: 10,
    level: 'intermediate',
    focusAreas: ['grammar', 'vocabulary']
  });

  const handleTimeframeChange = (value: string) => {
    setPlan(prev => ({ ...prev, timeframe: value as StudyPlan['timeframe'] }));
  };

  const handleLevelChange = (value: string) => {
    setPlan(prev => ({ ...prev, level: value as StudyPlan['level'] }));
  };

  const handleFocusAreaToggle = (area: string) => {
    setPlan(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const generateWeeklySchedule = () => {
    const book = murphyBooks[plan.level];
    const dailyMinutes = Math.round((plan.hoursPerWeek * 60) / 7);
    
    // Create a balanced weekly schedule
    const schedule = [];
    const grammarTopics = book.topics.slice(0, 4); // First 4 topics for this week
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    days.forEach((day, index) => {
      const sessions = [];
      let remainingMinutes = dailyMinutes;
      
      // Grammar session (using Murphy book)
      if (plan.focusAreas.includes('grammar') && remainingMinutes >= 15) {
        const topic = grammarTopics[index % grammarTopics.length];
        sessions.push({
          type: 'grammar',
          title: `Grammar: ${topic}`,
          source: `${book.title} - ${book.author}`,
          duration: Math.min(30, remainingMinutes),
          skill: 'grammar'
        });
        remainingMinutes -= Math.min(30, remainingMinutes);
      }
      
      // Vocabulary session
      if (plan.focusAreas.includes('vocabulary') && remainingMinutes >= 10) {
        sessions.push({
          type: 'vocabulary',
          title: 'Vocabulary Building',
          source: 'Academic word lists',
          duration: Math.min(20, remainingMinutes),
          skill: 'vocabulary'
        });
        remainingMinutes -= Math.min(20, remainingMinutes);
      }
      
      // Reading session
      if (plan.focusAreas.includes('reading') && remainingMinutes >= 15) {
        sessions.push({
          type: 'reading',
          title: 'Reading Comprehension',
          source: 'Academic articles',
          duration: Math.min(25, remainingMinutes),
          skill: 'reading'
        });
        remainingMinutes -= Math.min(25, remainingMinutes);
      }
      
      // Listening session
      if (plan.focusAreas.includes('listening') && remainingMinutes >= 10) {
        sessions.push({
          type: 'listening',
          title: 'Listening Practice',
          source: 'Academic lectures',
          duration: Math.min(20, remainingMinutes),
          skill: 'listening'
        });
      }
      
      schedule.push({
        day,
        sessions,
        totalMinutes: sessions.reduce((sum, s) => sum + s.duration, 0)
      });
    });
    
    return schedule;
  };

  const handleCreatePlan = () => {
    const schedule = generateWeeklySchedule();
    const createdPlan = {
      ...plan,
      schedule,
      recommendedBook: murphyBooks[plan.level],
      createdAt: new Date().toISOString()
    };
    
    onPlanCreated(createdPlan);
    toast.success("Study plan created successfully!");
    onClose();
  };

  const focusAreaOptions = [
    { id: 'grammar', label: 'Grammar', icon: PenTool, color: 'text-green-500' },
    { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen, color: 'text-blue-500' },
    { id: 'reading', label: 'Reading', icon: Brain, color: 'text-purple-500' },
    { id: 'listening', label: 'Listening', icon: Headphones, color: 'text-orange-500' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Create Study Plan</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-8 h-1 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">How much time can you dedicate?</h3>
                <RadioGroup value={plan.timeframe} onValueChange={handleTimeframeChange}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short" className="text-sm">
                      1-3 months (Intensive preparation)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="text-sm">
                      3-6 months (Balanced approach)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long" className="text-sm">
                      6+ months (Gradual improvement)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Weekly study hours</h3>
                <div className="space-y-3">
                  <Slider
                    value={[plan.hoursPerWeek]}
                    onValueChange={(value) => setPlan(prev => ({ ...prev, hoursPerWeek: value[0] }))}
                    max={35}
                    min={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>3h (Casual)</span>
                    <span className="font-medium">{plan.hoursPerWeek}h/week</span>
                    <span>35h (Intensive)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ~{Math.round(plan.hoursPerWeek / 7 * 10) / 10} hours per day
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">What's your current level?</h3>
                <RadioGroup value={plan.level} onValueChange={handleLevelChange}>
                  <div className="space-y-3">
                    {Object.entries(murphyBooks).map(([level, book]) => (
                      <div key={level} className="flex items-start space-x-2">
                        <RadioGroupItem value={level} id={level} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={level} className="text-sm font-medium cursor-pointer">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            {book.description}
                          </p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {book.title}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
          
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-3">Focus areas (select at least 2)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {focusAreaOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = plan.focusAreas.includes(option.id);
                    
                    return (
                      <div
                        key={option.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-border/80'
                        }`}
                        onClick={() => handleFocusAreaToggle(option.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${option.color}`} />
                          <span className="text-sm">{option.label}</span>
                          {isSelected && <Check className="w-3 h-3 ml-auto text-primary" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {plan.focusAreas.length >= 2 && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Recommended Resource</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {murphyBooks[plan.level].title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {murphyBooks[plan.level].author}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button 
                onClick={() => setStep(step + 1)} 
                className="flex-1"
                disabled={step === 3 && plan.focusAreas.length < 2}
              >
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreatePlan} 
                className="flex-1"
                disabled={plan.focusAreas.length < 2}
              >
                Create Plan <Target className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}