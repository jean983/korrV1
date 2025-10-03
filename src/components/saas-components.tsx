import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownRight, 
  Users, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Status indicators for different states
export function StatusIndicator({ status, text }: { status: 'success' | 'warning' | 'error' | 'pending'; text: string }) {
  const config = {
    success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
    warning: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
    error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    pending: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' }
  };

  const { icon: Icon, color, bg } = config[status];

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${bg}`}>
      <Icon className={`w-3 h-3 ${color}`} />
      <span className={`text-xs font-medium ${color}`}>{text}</span>
    </div>
  );
}

// Metric card with trend indicator
export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down'; 
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1">
          {trend === 'up' ? (
            <ArrowUpRight className="h-3 w-3 text-success mr-1" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-destructive mr-1" />
          )}
          <span className={`text-xs ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            {change}
          </span>
          <span className="text-xs text-muted-foreground ml-1">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

// User list component for team management
export function UserList({ users }: { users: Array<{ name: string; email: string; role: string; status: string; avatar?: string }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Members</CardTitle>
        <CardDescription>Manage your team and their permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{user.role}</Badge>
                <StatusIndicator 
                  status={user.status as 'success' | 'warning' | 'error' | 'pending'} 
                  text={user.status} 
                />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Usage analytics component
export function UsageAnalytics() {
  const usageData = [
    { feature: 'Dashboard Views', usage: 89, limit: 100 },
    { feature: 'API Calls', usage: 1250, limit: 2000 },
    { feature: 'Storage', usage: 65, limit: 100 },
    { feature: 'Team Members', usage: 8, limit: 15 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage Analytics</CardTitle>
        <CardDescription>Current usage across your plan limits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {usageData.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.feature}</span>
                <span className="text-muted-foreground">
                  {item.usage} / {item.limit}
                </span>
              </div>
              <Progress value={(item.usage / item.limit) * 100} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Activity timeline component
export function ActivityTimeline({ activities }: { activities: Array<{ title: string; description: string; time: string; status: string }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions and updates in your workspace</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <StatusIndicator 
                  status={activity.status as 'success' | 'warning' | 'error' | 'pending'} 
                  text="" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Quick stats overview
export function QuickStats() {
  const stats = [
    { label: 'Total Revenue', value: '$124,563', change: '+12.5%', trend: 'up' as const },
    { label: 'Active Users', value: '2,847', change: '+8.2%', trend: 'up' as const },
    { label: 'Conversion Rate', value: '3.24%', change: '-0.3%', trend: 'down' as const },
    { label: 'Avg. Session', value: '4m 32s', change: '+1.2%', trend: 'up' as const }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <MetricCard
          key={index}
          title={stat.label}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={index === 0 ? DollarSign : index === 1 ? Users : index === 2 ? TrendingUp : Clock}
        />
      ))}
    </div>
  );
}

// Data table component for SaaS interfaces
export function DataTable({ data, columns }: { data: any[]; columns: Array<{ key: string; label: string; render?: (value: any, row: any) => React.ReactNode }> }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 text-left text-sm font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} className="border-b last:border-b-0 hover:bg-muted/30">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}