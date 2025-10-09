/**
 @param dateString
 @param showTime 
 @returns 
 */

export function formatDate(dateString: string, showTime: boolean = false): string {
  if (!dateString) return "Data inválida";

  const isoDate = dateString.replace(" ", "T");

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Data inválida";

  const dia = String(date.getDate()).padStart(2, "0");
  const mes = String(date.getMonth() + 1).padStart(2, "0");
  const ano = date.getFullYear();

  const dataFormatada = `${dia}/${mes}/${ano}`;

  if (!showTime) return dataFormatada;

  const hora = String(date.getHours()).padStart(2, "0");
  const minutos = String(date.getMinutes()).padStart(2, "0");

  return `${dataFormatada} ${hora}:${minutos}`;
}
