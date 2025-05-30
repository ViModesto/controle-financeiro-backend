import app from "./index";

const PORT = process.env.PORT || 4000;
process.env.JWT_SECRET;

app.listen(PORT,() => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


// // server.ts (ou index.ts principal do backend)
// import express, { Application, Request, Response, NextFunction } from 'express';
// import cors from 'cors';
// import reportsRoutes from './Routes/reports';

// const app: Application = express();
// const PORT: number = parseInt(process.env.PORT || '3001', 10);

// // Middlewares
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true }));

// // Log middleware para desenvolvimento
// if (process.env.NODE_ENV !== 'production') {
//   app.use((req: Request, res: Response, next: NextFunction) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
//   });
// }

// // Rotas
// app.use('/api/reports', reportsRoutes);

// // Rota de teste/health check
// app.get('/', (req: Request, res: Response): void => {
//     res.json({ 
//       message: 'API de Relatórios funcionando!',
//       timestamp: new Date().toISOString(),
//       environment: process.env.NODE_ENV || 'development'
//     });
// });

// // Rota para verificar status da API
// app.get('/api/health', (req: Request, res: Response): void => {
//     res.json({
//       status: 'OK',
//       uptime: process.uptime(),
//       timestamp: new Date().toISOString()
//     });
// });

// // Middleware para rotas não encontradas
// app.use('*', (req: Request, res: Response): void => {
//     res.status(404).json({
//       success: false,
//       error: `Rota ${req.originalUrl} não encontrada`
//     });
// });

// // Middleware de tratamento de erros
// app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
//     console.error('Erro capturado:', err.stack);
    
//     res.status(500).json({
//       success: false,
//       error: process.env.NODE_ENV === 'production' 
//         ? 'Erro interno do servidor' 
//         : err.message
//     });
// });

// // Tratamento de promise rejections não capturadas
// process.on('unhandledRejection', (reason: unknown) => {
//     console.error('Unhandled Rejection:', reason);
//     process.exit(1);
// });

// // Tratamento de exceções não capturadas
// process.on('uncaughtException', (error: Error) => {
//     console.error('Uncaught Exception:', error);
//     process.exit(1);
// });

// // Iniciar servidor
// const server = app.listen(PORT, (): void => {
//     console.log(`🚀 Servidor rodando na porta ${PORT}`);
//     console.log(`📊 API de Relatórios disponível em http://localhost:${PORT}`);
//     console.log(`🏥 Health check disponível em http://localhost:${PORT}/api/health`);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//     console.log('SIGTERM recebido, fechando servidor...');
//     server.close(() => {
//         console.log('Servidor fechado com sucesso');
//         process.exit(0);
//     });
// });

// export default app;