# StudyBloom - Social Study Companion

StudyBloom is a comprehensive study companion app that combines personal productivity with social motivation. Track your study progress, connect with friends, and achieve your academic goals together.

## ✨ Features

### 📚 Study Management
- **Smart Study Plans**: Create and customize weekly study schedules
- **Task Tracking**: Organize daily, weekly, and monthly study tasks
- **Progress Monitoring**: Track study minutes, completed tasks, and earned points
- **Streak Tracking**: Maintain daily study streaks for motivation

### 👥 Social Learning
- **Friend System**: Connect with study buddies and track each other's progress
- **Leaderboards**: Compete with friends on weekly and monthly rankings
- **Achievements**: Unlock badges for reaching study milestones
- **Privacy Controls**: Manage what progress information you share

### 📱 Cross-Platform
- **Web App**: Full-featured web application
- **Android App**: Native Android experience with offline capabilities
- **Real-time Sync**: Progress syncs across all devices

## 🚀 Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Mobile**: Capacitor for Android deployment
- **Build Tool**: Vite
- **UI Components**: shadcn/ui with Radix UI primitives

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd studybloom
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

### Mobile Development

To run on Android:
```bash
npm run build
npx cap add android
npx cap copy android
npx cap open android
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Home.tsx        # Dashboard component
│   ├── Tasks.tsx       # Task management
│   ├── Social.tsx      # Social features
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication logic
│   ├── useSocialData.tsx # Social data management
│   └── ...
├── pages/              # Page components
│   ├── Auth.tsx        # Login/signup page
│   └── ...
├── integrations/       # External service integrations
│   └── supabase/       # Supabase client and types
└── ...
```

## 🔒 Security & Privacy

- **Row Level Security**: All database operations are secured with Supabase RLS
- **Authentication**: Secure email/password authentication with Supabase Auth
- **Privacy Controls**: Users control what data they share with friends
- **Input Validation**: All user inputs are validated client and server-side

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 🔮 Development

### Lovable Integration

This project is built with [Lovable](https://lovable.dev), enabling AI-powered development:

**URL**: https://lovable.dev/projects/248cc5dc-cf8c-4df3-a968-d2f1a1f99658

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/248cc5dc-cf8c-4df3-a968-d2f1a1f99658) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

**Deploy**

Simply open [Lovable](https://lovable.dev/projects/248cc5dc-cf8c-4df3-a968-d2f1a1f99658) and click on Share → Publish.

**Custom Domain**

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

## 🔮 Roadmap

- [ ] Advanced analytics
- [ ] Integration with learning platforms
- [ ] Pomodoro timer integration
- [ ] Calendar synchronization

---

Built with ❤️ using [Lovable](https://lovable.dev)
