import { readFileSync } from 'fs';
import https from 'https';
import { AddressInfo } from 'net';
import { logger } from '../core/utils/logger/logger';
import 'dotenv/config'
import { Server } from 'socket.io'
import { Routes } from './routes/routes';
import { UserController } from './controllers/user.controller';

class ServerInit {
  private readonly PORT = process.env.PORT ?? 3000;

  initialize() {
    const ssl = this.getCertificates()
    const routes = new Routes({
      controllers: [UserController]
    })
    const server = https.createServer(ssl, routes.handler.bind(routes));
    const io = this.socket(server);
    routes.setSocketInstance(io);

    const start = () => {
      const { address, port } = server.address() as AddressInfo;
      logger.info({ address, port })
      logger.info(`Server running at https://${address}:${port}`)
    }

    server.listen(this.PORT, start);
  }

  private socket(server: https.Server): Server {
    const io = new Server(server, {
      cors: {
        origin: '*',
        credentials: false
      }
    });

    io.on('connection', (socket) => logger.info(`someone connectd: ${socket.id}`))

    return io;
  }

  private getCertificates() {
    return {
      key: readFileSync(`${__dirname}/certificates/key.pem`),
      cert: readFileSync(`${__dirname}/certificates/cert.pem`),
    };
  }
}

(new ServerInit()).initialize()