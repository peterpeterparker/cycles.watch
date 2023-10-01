const notificationSupported = (): boolean => 'Notification' in window;

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
	if (!notificationSupported()) {
		return 'denied';
	}

	return Notification.requestPermission();
};

export const notify = async ({
	title,
	options
}: {
	title: string;
	options?: NotificationOptions;
}) => {
	const permission: NotificationPermission = await requestNotificationPermission();

	if (permission !== 'granted') {
		return;
	}

	try {
		const notification = new Notification(title, options);

		notification.onclick = () => window.focus();
	} catch (err) {
		console.error('Notification cannot be displayed', err);
	}
};
