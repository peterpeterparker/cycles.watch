export const emitAddCanister = () => emit<void>({message: 'openAddCanister'});

export const emitOpenWhatsII = () => emit<void>({message: 'openWhatsII'});

export const emit = <T>({message, detail}: {message: string; detail?: T | undefined}) => {
  const $event: CustomEvent<T> = new CustomEvent<T>(message, {detail, bubbles: true});
  document.dispatchEvent($event);
};
