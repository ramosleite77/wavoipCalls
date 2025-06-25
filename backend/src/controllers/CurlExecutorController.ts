import { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';

interface CurlRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
}

class CurlExecutorController {
  async executeCurl(req: Request, res: Response) {
    try {
      const { method, url, headers, body }: CurlRequest = req.body;

      // Validações básicas
      if (!url) {
        return res.status(400).json({ error: 'URL é obrigatória' });
      }

      if (!method) {
        return res.status(400).json({ error: 'Método HTTP é obrigatório' });
      }

      // Configurar axios
      const config: any = {
        method: method.toLowerCase(),
        url,
        headers: {
          ...headers,
          'User-Agent': 'CurlExecutor/1.0'
        },
        timeout: 30000, // 30 segundos
        validateStatus: () => true // Aceitar qualquer status code
      };

      // Adicionar body se existir
      if (body && ['post', 'put', 'patch'].includes(method.toLowerCase())) {
        config.data = body;
      }

      // Executar requisição
      const response: AxiosResponse = await axios(config);

      // Preparar resposta
      const result = {
        status: response.status,
        headers: response.headers,
        data: response.data
      };

      res.json(result);
    } catch (error) {
      console.error('Erro ao executar curl:', error);
      
      if (axios.isAxiosError(error)) {
        res.status(500).json({
          error: 'Erro na requisição HTTP',
          details: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
      } else {
        res.status(500).json({
          error: 'Erro interno do servidor',
          details: error instanceof Error ? error.message : 'Erro desconhecido'
        });
      }
    }
  }
}

export default new CurlExecutorController(); 