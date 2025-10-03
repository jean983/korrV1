import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/login-page';
import { Dashboard } from './components/dashboard';
import { ActivitiesPage } from './components/activities-page';
import { ActivityDetailsPage } from './components/activity-details-page';
import { AccountSettings } from './components/account-settings';
import { Activity } from './lib/mock-data';
import { Toaster } from './components/ui/sonner';
import { NotificationProvider } from './lib/notification-context';

type Page = 'dashboard' | 'activities' | 'activity-details' | 'account-settings';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const handleLogin = () => {
    // Mock authentication - accept any credentials
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setSelectedActivity(null);
  };

  const handleViewActivityDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentPage('activity-details');
  };

  const handleUpdateActivity = (updatedActivity: Activity) => {
    setSelectedActivity(updatedActivity);
    // In a real app, this would update the activity in the database
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'account-settings':
        return (
          <AccountSettings
            onBack={() => setCurrentPage('dashboard')}
            theme={theme}
            onThemeChange={setTheme}
          />
        );
      case 'activity-details':
        if (!selectedActivity) {
          setCurrentPage('activities');
          return null;
        }
        return (
          <ActivityDetailsPage
            activity={selectedActivity}
            onBack={() => setCurrentPage('activities')}
            onUpdateActivity={handleUpdateActivity}
          />
        );
      case 'activities':
        return (
          <ActivitiesPage 
            onLogout={handleLogout}
            theme={theme}
            onThemeChange={setTheme}
            onNavigateToDashboard={() => setCurrentPage('dashboard')}
            onViewActivityDetails={handleViewActivityDetails}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard 
            onLogout={handleLogout} 
            theme={theme}
            onThemeChange={setTheme}
            onNavigateToActivities={() => setCurrentPage('activities')}
            onNavigateToAccountSettings={() => setCurrentPage('account-settings')}
          />
        );
    }
  };

  return (
    <NotificationProvider>
      <div className={theme}>
        {!isAuthenticated ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          renderPage()
        )}
        <Toaster />
      </div>
    </NotificationProvider>
  );
}