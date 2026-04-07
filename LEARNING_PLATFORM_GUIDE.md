# CodeTutor - AI-Powered Learning Platform

## 🎓 Overview

CodeTutor is an advanced AI-powered coding learning platform that combines structured courses with real-time AI assistance. It's designed to help learners master programming from beginner to advanced levels.

## ✨ New Features

### 1. 📚 **Structured Learning Courses**
- **4 Programming Languages**: JavaScript, Python, C, C++
- **3 Difficulty Levels**: Beginner, Intermediate, Advanced
- **Comprehensive Curriculum**: Each course has multiple chapters with lessons, code examples, and practice problems

### 2. 📖 **Interactive Lesson Pages**
Each lesson includes:
- **Lesson Content**: Detailed explanations with formatted text
- **Code Examples**: Runnable code snippets with output
- **Practice Section**: Interactive code editor with run/reset buttons
- **Quick Navigation**: Previous/Next buttons to move between lessons

### 3. 🤖 **AI Assistant Integration**
- **Floating AI Panel**: Ask questions about the lesson or your code
- **Quick Prompts**: Pre-made questions like "Explain This Lesson", "Debug My Code", "I'm Stuck", "Tips & Tricks"
- **Context-Aware Help**: AI understands the current lesson and code
- **Streaming Responses**: Real-time AI responses for better UX

### 4. 💾 **Progress Tracking Dashboard**
- **Learning Stats**: View courses enrolled, progress %, certificates, and learning streak
- **Progress Visualization**: See your progress across all courses
- **Course Cards**: Quick access to enrolled courses with progress bars
- **Dual Dashboard**: Learning tab + Code Helper tab

### 5. 🧪 **Quiz & Practice System**
- **Interactive Quizzes**: After each lesson to test understanding
- **Multiple Choice Questions**: Based on lesson content
- **Score Tracking**: Get instant feedback on your performance
- **Progressive**: Move to next lesson or review based on score

### 6. 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Smooth theme switching
- **Smooth Animations**: Framer Motion animations for engaging experience
- **Tailwind CSS**: Beautiful, modern styling
- **shadcn/ui Components**: High-quality UI components

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AIAssistantPanel.tsx       # AI assistance sidebar
│   ├── CodeEditor.tsx              # Code editor with syntax highlighting
│   ├── CourseSidebar.tsx           # Course navigation sidebar
│   ├── QuizComponent.tsx           # Quiz/assessment component
│   ├── ResponsePanel.tsx           # AI response display
│   └── ui/                         # shadcn/ui components
├── data/
│   └── courses.ts                  # Course and lesson definitions
├── pages/
│   ├── CoursesPage.tsx             # List all courses
│   ├── CourseDetailPage.tsx        # Show course with lessons
│   ├── LessonPage.tsx              # Main lesson learning page
│   ├── Dashboard.tsx               # User dashboard & code helper
│   ├── Home.tsx                    # Homepage with CTAs
│   └── ...
├── types/
│   └── course.ts                   # TypeScript types for courses
└── hooks/
    └── useTheme.ts                 # Dark mode hook
```

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
Create a `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## 📚 How to Use

### For Learners

1. **Browse Courses**: Go to `/courses` to see all available courses
2. **Enroll in a Course**: Click on any course to see lessons
3. **Learn**: Click on a lesson to start learning
4. **Practice**: Write code in the editor and click "Run Code"
5. **Get Help**: Click "AI Assistant" to ask questions
6. **Take Quiz**: Complete the quiz after each lesson
7. **Track Progress**: Visit Dashboard to see your progress

### For Course Content

To add new courses, edit `src/data/courses.ts`:

```typescript
const newCourse: Course = {
  id: "unique-id",
  title: "Course Title",
  description: "Description",
  language: "javascript",
  level: "beginner",
  chapters: 10,
  duration: "4 weeks",
  color: "from-blue-400 to-purple-500",
  enabled: true,
};

const newLesson: Lesson = {
  id: "lesson-id",
  courseId: "unique-id",
  chapter: 1,
  title: "Lesson Title",
  description: "Short description",
  content: "# Markdown formatted content",
  explanation: "Simple explanation",
  codeExamples: [
    {
      title: "Example 1",
      code: "console.log('hello');",
      language: "javascript",
      output: "hello",
    },
  ],
  practiceProblems: [
    {
      id: "problem-1",
      title: "Problem Title",
      description: "Problem description",
      template: "// starter code",
      solution: "// solution",
      difficulty: "beginner",
      language: "javascript",
    },
  ],
};
```

## 🎯 Core Features Explained

### AI Assistant Panel
The AI panel appears when you click "AI Assistant" on lesson pages or use "Ask AI" in practice section.

**Quick Prompts**:
- 📚 Explain This Lesson - Get a simplified explanation of the lesson
- 🐛 Debug My Code - Get help fixing your code
- ❓ I'm Stuck - General help and explanations
- ⚡ Tips & Tricks - Get optimization suggestions

**Features**:
- Real-time streaming responses
- Context-aware (knows your current lesson and code)
- Chat history
- Keyboard shortcut: Ctrl+Enter to send

### Code Editor
Supports:
- **JavaScript**: Run in browser
- **Python**: Via API
- **C/C++**: Via API

Features:
- Syntax highlighting
- Multiple language support
- Run / Reset buttons
- Output display

### Progress Tracking
Stored as mock data (ready for Supabase integration):
- Lesson completion status
- Quiz scores
- Overall course progress
- Achievement tracking

## 🔧 Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - Premium components
- **Framer Motion** - Animations
- **React Router** - Routing
- **CodeMirror** - Code editor

### Backend
- **Supabase** - Database & Auth
- **PostgreSQL** - Data storage
- **Edge Functions** - Serverless code
- **OpenAI API** - AI responses (via Edge Function)

### State Management
- **React Query** - Data fetching & caching
- **React Context** - Theme management
- **localStorage** - Session persistence

## 📋 API Integration Points

### Supabase Setup (Ready for Implementation)

```sql
-- Users table (auto-created by Auth)
-- user_id, email, username, created_at

-- Courses table
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  language TEXT,
  level TEXT,
  chapters INT,
  duration TEXT,
  enabled BOOLEAN,
  created_at TIMESTAMP
);

-- Lessons table
CREATE TABLE lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT REFERENCES courses(id),
  chapter INT,
  title TEXT,
  content TEXT,
  created_at TIMESTAMP
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  lesson_id TEXT REFERENCES lessons(id),
  completed BOOLEAN DEFAULT FALSE,
  score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quizzes table
CREATE TABLE quizzes (
  id TEXT PRIMARY KEY,
  lesson_id TEXT REFERENCES lessons(id),
  questions JSONB,
  created_at TIMESTAMP
);
```

## 🔐 Authentication (Ready for Add)

The app is ready for full authentication:
1. Supabase Auth is already configured
2. Add login/signup pages in `src/pages/Auth/`
3. Protect routes using middleware
4. Store user preferences in `user_profile` table

## 📊 Dashboard Sections

### Learning Tab
- **Stats**: Courses enrolled, overall progress, certificates, streak
- **Your Courses**: List of enrolled courses with progress bars
- **Quick Actions**: Browse more courses, view achievements

### Code Helper Tab
- **Language Selection**: Choose JavaScript, Python, C, C++
- **Code Editor**: Write or paste code
- **Actions**: Explain, Fix, Optimize
- **Response Panel**: View AI assistance

## 🎨 Customization

### Adding New Courses
1. Edit `src/data/courses.ts`
2. Add course to `COURSES` array
3. Add lessons to appropriate `LESSONS` array
4. Deploy

### Changing Colors
- Update course `color` prop for gradients
- Modify Tailwind config for theme

### Adding New Languages
1. Update `Language` type in `src/types/course.ts`
2. Add language support to CodeEditor
3. Update course definitions

## 🚀 Performance

- **Code Splitting**: Ready for dynamic imports
- **Lazy Loading**: Pages use React.lazy()
- **Image Optimization**: All icons from lucide-react
- **CSS**: Optimized Tailwind build (12.28 KB gzip)

Current stats:
- HTML: 0.58 KB (gzip)
- CSS: 12.28 KB (gzip)  
- JS: 414.49 KB (gzip) - Can be reduced with code splitting

## 🔮 Future Enhancements

1. **User Authentication**: Full login/signup
2. **Certificate System**: Generate certificates on course completion
3. **Leaderboards**: Compete with other learners
4. **Projects**: Build real projects as part of courses
5. **Code Execution**: Sandboxed Python/C/C++ execution
6. **Video Lessons**: Embed educational videos
7. **Community**: Discussion forums & peer learning
8. **Analytics**: Learning analytics dashboard
9. **Mobile App**: React Native version
10. **API**: Public API for external integrations

## 📝 Lessons Best Practices

When adding lessons:

1. **Start Simple**: Beginner lessons should explain basics clearly
2. **Progressive**: Each lesson builds on previous knowledge
3. **Code Examples**: Always provide runnable examples
4. **Practice Problems**: Include problems for hands-on learning
5. **Real-World**: Use practical examples
6. **Explain Concepts**: Include theory and explanation
7. **Challenge**: Final lessons should challenge learners

## 🤝 Contributing

To add more courses or lessons:
1. Follow the structure in `src/data/courses.ts`
2. Keep code examples small and focused
3. Ensure practice problems have clear solutions
4. Test the lesson content
5. Submit a PR

## 📄 License

[Add your license here]

## 🎓 Support

For questions or support:
- 📧 Email: support@codetutor.com
- 💬 Discord: [Discord invite link]
- 📖 Documentation: [Docs link]
- 🐛 Issues: [GitHub issues]

---

**Happy Learning! 🚀**
