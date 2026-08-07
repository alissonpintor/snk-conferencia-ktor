import type { Notification, Action, Alert } from "$lib/types/notification";


class NotificationState {
    notifications: Notification[] = $state([]);

    addNotification(notification: Notification) {
        const note = $state(notification);
        const timer = note.timer ? note.timer : 5;
        this.notifications.push(note);

        setTimeout(() => {
            const index = this.notifications.indexOf(note);
            if (index !== -1) {
                this.notifications.splice(index, 1);
            }
        }, timer * 1000);
    }
}

class AlertState {
    showAlert = $state(false);
    title = $state('');
    message = $state('');
    action = $state<Action | null>(null);
    showCloseButton = $state<boolean>(false);

    setAlert(title: string, message: string, action: Action | null = null, showCloseButton: boolean = false) {
        this.title = title;
        this.message = message;
        this.showAlert = true;
        this.action = action;
        this.showCloseButton = showCloseButton;
    }

    clearAlert() {
        this.showAlert = false;
        this.title = '';
        this.message = '';
        this.action = null;
        this.showCloseButton = false;
    }
}

class ModalState {
    showAlert = $state(false);
    title = $state('');
    message = $state('');

    setAlert(title: string, message: string) {
        this.title = title;
        this.message = message;
        this.showAlert = true;
    }

    clearAlert() {
        this.showAlert = false;
        this.title = '';
        this.message = '';
    }
}

export const notificationState = new NotificationState();
export const alertState = new AlertState();
export const modalState = new ModalState();