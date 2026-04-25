export const sanitizeNameInput = (name) => {
    return name.replace(/[^\p{L}\s'.-]/gu, '');
};

export const getTimeFromToday = (yearsOffset = 0) => {
  const d = new Date();
  const yyyy = d.getFullYear() + yearsOffset;
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getAge = (dateOfBirth) => {
  return Math.floor((new Date() - new Date(dateOfBirth)) / (1000 * 60 * 60 * 24 * 365.25));
}

export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('es-ar', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}