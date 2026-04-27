const showNotification = (message, type = 'info') => {
  // Remove any existing notifications
  const existing = document.getElementById('notification-container');
  if (existing) {
    existing.remove();
  }

  // Create notification container
  const container = document.createElement('div');
  container.id = 'notification-container';
  container.style.position = 'fixed';
  container.style.top = '20px';
  container.style.right = '20px';
  container.style.zIndex = '1000';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '10px';
  document.body.appendChild(container);

  // Create notification element
  const notification = document.createElement('div');
  notification.style.padding = '12px 20px';
  notification.style.borderRadius = '8px';
  notification.style.color = 'white';
  notification.style.fontWeight = '500';
  notification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  notification.style.display = 'flex';
  notification.style.alignItems = 'center';
  notification.style.gap = '10px';
  notification.style.animation = 'slide-in 0.3s ease-out';

  // Set background color based on type
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981';
      break;
    case 'error':
      notification.style.backgroundColor = '#ef4444';
      break;
    case 'warning':
      notification.style.backgroundColor = '#f59e0b';
      break;
    case 'info':
    default:
      notification.style.backgroundColor = '#3b82f6';
  }

  // Create icon based on type
  const icon = document.createElement('span');
  icon.style.fontSize = '1.2rem';
  switch (type) {
    case 'success':
      icon.textContent = '✓';
      break;
    case 'error':
      icon.textContent = '✕';
      break;
    case 'warning':
      icon.textContent = '⚠';
      break;
    case 'info':
    default:
      icon.textContent = 'ℹ';
  }

  // Create message text
  const text = document.createElement('span');
  text.textContent = message;

  notification.appendChild(icon);
  notification.appendChild(text);
  container.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slide-out 0.3s ease-in';
    setTimeout(() => {
      if (container) {
        container.removeChild(notification);
        // Remove container if empty
        if (container.children.length === 0) {
          container.remove();
        }
      }
    }, 300);
  }, 3000);
};

// Add keyframes for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slide-out {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

export { showNotification };