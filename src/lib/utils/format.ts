export function formatDate(date: string | Date): string {
  if (!date) return '';

  try {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleDateString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
  });
  } catch {
  return '';
  }
}

export function formatDateTime(date: string | Date): string {
  if (!date) return '';

  try {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  return d.toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
  });
  } catch {
  return '';
  }
}

export function calculateAge(birthDate: string | Date): number {
  if (!birthDate) return 0;

  try {
  const today = new Date();
  const birth = new Date(birthDate);

  if (isNaN(birth.getTime())) return 0;

  let age = today.getFullYear() - birth.getFullYear();

  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
  age--;
  }

  return Math.max(0, age);
  } catch {
  return 0;
  }
}

export function formatCPF(cpf: string): string {
  if (!cpf) return '';

  const numbers = cpf.replace(/\D/g, '');

  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatPhone(phone: string): string {
  if (!phone) return '';

  const numbers = phone.replace(/\D/g, '');

  if (numbers.length === 11) {
  return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
  return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return phone;
}

export function applyPhoneMask(value: string): string {

  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 10) {

  return numbers.
  replace(/(\d{2})(\d)/, '($1) $2').
  replace(/(\d{4})(\d)/, '$1-$2');
  } else {

  return numbers.
  replace(/(\d{2})(\d)/, '($1) $2').
  replace(/(\d{5})(\d)/, '$1-$2').
  substring(0, 15);
  }
}

export function createPhoneChangeHandler(
setStateFunction: (value: string) => void)
{
  return (e: {target: {value: string;};}) => {
  const maskedValue = applyPhoneMask(e.target.value);
  setStateFunction(maskedValue);
  };
}

export function formatHeight(height: number): string {
  if (!height || height <= 0) return '';

  return `${height.toFixed(2)}m`;
}

export function formatWeight(weight: number): string {
  if (!weight || weight <= 0) return '';

  return `${weight}kg`;
}