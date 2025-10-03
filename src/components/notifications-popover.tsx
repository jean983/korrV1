import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  X,
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle
} from 'lucide-react';
import { useNotifications } from '../lib/notification-context';
import { formatDistanceToNow } from 'date-fns';

export function NotificationsPopover() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification,
    clearAllNotifications 
  } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative h-9 w-9"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {unreadCount} unread
              </p>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-8 text-xs"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearAllNotifications}
                className="h-8 text-xs text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </div>
        <Separator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <Bell className="w-12 h-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground text-center">
              No notifications yet
            </p>
            <p className="text-xs text-muted-foreground/70 text-center mt-1">
              You'll see updates and changes here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent/5 transition-colors relative group ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </p>
                        {notification.action && (
                          <p className="text-xs text-primary">
                            {notification.action}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  );
}