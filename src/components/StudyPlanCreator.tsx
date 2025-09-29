import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronRight, 
  Target, 
  Clock, 
  BookOpen, 
  PenTool, 
  Brain, 
  Headphones,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { toast } from "sonner";

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

// Raymond Murphy book references with detailed units and instructions
const murphyBooks = {
  elementary: {
    title: "Essential Grammar in Use (Red Book)",
    author: "Raymond Murphy",
    description: "Perfect for beginners and elementary level students",
    topics: [
      "Present tenses", "Past tenses", "Present perfect", "Passive voice",
      "Future forms", "Modal verbs", "If sentences", "Reported speech",
      "Questions", "Articles and nouns", "Pronouns", "Adjectives and adverbs"
    ],
    units: {
      "Present tenses": {
        unit: "Units 1-8",
        content: "am/is/are, am/is/are + -ing (present continuous), I do/work/like (present simple)",
        instructions: "Study the form and usage of present tenses. Complete exercises A, B, and C for each unit. Pay special attention to the difference between present simple and continuous.",
        examples: ["I am working now", "I work every day", "She is eating lunch"]
      },
      "Past tenses": {
        unit: "Units 9-14", 
        content: "was/were, worked/got/went (past simple), I was doing (past continuous)",
        instructions: "Learn past tense formations and irregular verbs. Practice with the additional exercises at the back of the book. Focus on time expressions.",
        examples: ["I worked yesterday", "I was working when she called", "They went to London"]
      },
      "Present perfect": {
        unit: "Units 15-20",
        content: "I have done (present perfect), How long have you...? (present perfect questions)",
        instructions: "Understand the connection between past and present. Practice with for/since time expressions. Complete all exercises twice for better retention.",
        examples: ["I have lived here for 5 years", "Have you ever been to Paris?", "She has just arrived"]
      },
      "Modal verbs": {
        unit: "Units 26-31",
        content: "can/could/would you...?, may/might, have to/must, should",
        instructions: "Learn the different meanings and uses of modal verbs. Practice polite requests and giving advice. Use the appendix for additional practice.",
        examples: ["Can you help me?", "You should study more", "I must go now"]
      }
    }
  },
  intermediate: {
    title: "English Grammar in Use (Blue Book)", 
    author: "Raymond Murphy",
    description: "The world's best-selling grammar book for intermediate learners",
    topics: [
      "Present and past", "Present perfect and past", "Future", "Modal verbs",
      "If and wish", "Passive", "Reported speech", "Questions and auxiliary verbs",
      "Articles and nouns", "Pronouns and determiners", "Relative clauses", "Adjectives and adverbs"
    ],
    units: {
      "Present and past": {
        unit: "Units 1-12",
        content: "Present continuous and simple, Past continuous and simple, Present perfect vs past simple",
        instructions: "Focus on the subtle differences between tenses. Use the Study Guide to plan your learning. Complete the Additional Exercises for extra practice.",
        examples: ["I'm living in London (temporary)", "I live in London (permanent)", "I've lived here since 2010"]
      },
      "Present perfect and past": {
        unit: "Units 13-20",
        content: "Present perfect continuous, How long...?, For and since, Present perfect vs past",
        instructions: "Master the present perfect forms and their uses. Pay attention to time markers. Use the Answer Key to check your understanding immediately.",
        examples: ["I've been studying for 3 hours", "How long have you been waiting?", "I finished yesterday vs I've finished"]
      },
      "Future": {
        unit: "Units 21-25",
        content: "will/shall, be going to, Present continuous for future, Present simple for future",
        instructions: "Learn to express future ideas accurately. Practice with the prediction and intention exercises. Review the differences between future forms regularly.",
        examples: ["I'll help you", "I'm going to study tonight", "The train leaves at 6pm"]
      },
      "Modal verbs": {
        unit: "Units 26-38",
        content: "can/could/be able to, must/have to/should, may/might, would",
        instructions: "Study each modal verb section thoroughly. Practice the meaning differences with the exercises. Use real-life situations to practice.",
        examples: ["You must be tired", "She might come later", "I'd like some coffee"]
      },
      "If and wish": {
        unit: "Units 39-42",
        content: "If I do/If I did/If I had done, I wish I knew/I wish I had known",
        instructions: "Master conditional structures step by step. Start with real conditions, then move to hypothetical. Practice with the mixed conditional exercises.",
        examples: ["If it rains, I'll stay home", "If I won the lottery, I'd travel", "I wish I had studied harder"]
      },
      "Passive": {
        unit: "Units 43-45",
        content: "is done/was done, be/been/being done",
        instructions: "Learn passive formation and when to use it. Focus on the exercises about reporting and formal writing. Practice active to passive transformation.",
        examples: ["The house was built in 1990", "Letters are delivered daily", "The work is being done"]
      }
    }
  },
  advanced: {
    title: "Advanced Grammar in Use (Green Book)",
    author: "Raymond Murphy", 
    description: "For advanced learners who want to perfect their English",
    topics: [
      "Tenses and time", "Modality", "The passive", "Infinitives and gerunds",
      "Articles", "Relative clauses", "Conditionals", "Emphasis and focus",
      "Cohesion and discourse", "Word order and emphasis", "Prepositions", "Adverbials"
    ],
    units: {
      "Tenses and time": {
        unit: "Units 1-15",
        content: "Present time, Past time, Present perfect, Future time, Advanced tense usage",
        instructions: "Study advanced time concepts and aspectual differences. Focus on subtle meaning changes. Use the diagnostic test to identify weak areas first.",
        examples: ["I'm always forgetting things", "I'll be having dinner then", "By next year, I'll have graduated"]
      },
      "Modality": {
        unit: "Units 16-30", 
        content: "Probability, Necessity and obligation, Permission and ability, Hypothetical meaning",
        instructions: "Master nuanced modal meanings. Study hedging and academic language use. Practice with authentic texts and formal writing exercises.",
        examples: ["That could well be true", "You needn't have worried", "They're bound to succeed"]
      },
      "The passive": {
        unit: "Units 31-35",
        content: "Advanced passive structures, Passive with modals, Have/get something done",
        instructions: "Learn complex passive constructions. Focus on formal and academic uses. Practice with the reporting and impersonal structures.",
        examples: ["It is said that...", "Having been warned, we...", "I had my car repaired"]
      },
      "Infinitives and gerunds": {
        unit: "Units 36-42",
        content: "Verb + infinitive/gerund, Adjective + infinitive, Perfect infinitives and gerunds",
        instructions: "Master the subtle differences in meaning. Use the appendix verb lists extensively. Practice with academic and formal contexts.",
        examples: ["I regret to inform you", "I regret telling him", "He appears to have left"]
      },
      "Articles": {
        unit: "Units 65-71",
        content: "The and a/an, Articles with geographical names, Articles in academic writing",
        instructions: "Perfect your article usage for academic writing. Study the patterns with proper nouns. Focus on zero article usage rules.",
        examples: ["The University of Oxford", "Life is precious", "In the event of fire"]
      },
      "Conditionals": {
        unit: "Units 43-48",
        content: "Advanced conditional structures, Mixed conditionals, Alternative conditional forms",
        instructions: "Study complex conditional meanings and forms. Practice with inversion and alternative structures. Focus on academic and formal uses.",
        examples: ["Were it not for your help...", "But for the rain, we would have...", "Should you need help..."]
      }
    }
  }
};

const focusAreaOptions = [
  { id: 'grammar', name: 'Grammar', icon: PenTool, description: 'Rules and structures' },
  { id: 'vocabulary', name: 'Vocabulary', icon: BookOpen, description: 'Word building' },
  { id: 'reading', name: 'Reading', icon: Brain, description: 'Comprehension skills' },
  { id: 'listening', name: 'Listening', icon: Headphones, description: 'Audio comprehension' }
];

export function StudyPlanCreator({ onClose, onPlanCreated }: StudyPlanCreatorProps) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState<StudyPlan>({
    timeframe: 'medium',
    hoursPerWeek: 10,
    level: 'intermediate',
    focusAreas: ['grammar', 'vocabulary']
  });

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
  };

  const handleTimeframeChange = (value: string) => {
    setPlan(prev => ({ ...prev, timeframe: value as any }));
  };

  const handleLevelChange = (value: string) => {
    setPlan(prev => ({ ...prev, level: value as any }));
  };

  const handleFocusAreaToggle = (areaId: string) => {
    setPlan(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-background border-outline max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg text-on-surface">Create Study Plan</CardTitle>
              <p className="text-sm text-on-surface-variant">Step {step} of 3</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ✕
            </Button>
          </div>
          
          {/* Progress indicator */}
          <div className="flex gap-1 mt-3">
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
                        onClick={() => handleFocusAreaToggle(option.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-outline-variant hover:border-outline bg-surface-variant/50'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon size={16} className={isSelected ? 'text-primary' : 'text-on-surface-variant'} />
                          <span className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                            {option.name}
                          </span>
                          {isSelected && (
                            <CheckCircle2 size={14} className="text-primary ml-auto" />
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant">{option.description}</p>
                      </div>
                    );
                  })}
                </div>
                {plan.focusAreas.length < 2 && (
                  <p className="text-xs text-warning mt-2">Please select at least 2 focus areas</p>
                )}
              </div>
            </div>
          )}
          
          {/* Navigation buttons */}
          <div className="flex gap-2 pt-4">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
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