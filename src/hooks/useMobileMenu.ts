import { useState, useEffect, useRef } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  const open = () => setIsOpen(true);

  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
  if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
    close();
  }
  }

  if (isOpen) {
  document.addEventListener('mousedown', handleClickOutside);

  document.body.style.overflow = 'hidden';
  } else {
  document.body.style.overflow = 'unset';
  }

  return () => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.body.style.overflow = 'unset';
  };
  }, [isOpen]);

  useEffect(() => {
  function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close();
  }
  }

  if (isOpen) {
  document.addEventListener('keydown', handleEscape);
  }

  return () => {
  document.removeEventListener('keydown', handleEscape);
  };
  }, [isOpen]);

  return {
  isOpen,
  toggle,
  close,
  open,
  menuRef
  };
}