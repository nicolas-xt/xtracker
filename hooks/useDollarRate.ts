import { useEffect, useState } from 'react';

// Exemplo de endpoint BBC: https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json
const BBC_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json';

export function useDollarRate() {
  const [rate, setRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(BBC_URL)
      .then(res => {
        if (!res.ok) throw new Error('Erro ao buscar cotação do dólar');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].valor) {
          setRate(Number(data[0].valor.replace(',', '.')));
        } else {
          setError('Cotação não encontrada');
        }
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { rate, isLoading, error };
}
