import { IncomingMessage, ServerResponse } from "http";
import { Routing } from "../routing"
import { MockDefaultController } from "./mocks/default-controller.mock";
import { MockCustomController } from "./mocks/custom-controller.mock";
import { MockEmptyController } from "./mocks/empty-controller.mock";
import { randomUUID } from "crypto";
import { Readable } from "stream";
import { Socket } from "node:net";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { RoutesNotFoundException } from "@exceptions/routes-not-found.exception";

describe('#Routes', () => {
  let routing: Routing;

  beforeEach(() => {
    routing = new Routing()
  })

  const io = {
    to: (id: any) => io,
    emit: (event: any, message: any) => { }
  }

  const params = {
    request: {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'GET',
      url: '/',
      body: jest.fn()
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values<any>(params)
  }

  const id = randomUUID();

  it.each([
    {
      should: 'set store socket io instance',
      input: () => params,
      setup: () => {
        routing.setSocketInstance(io as any)
      },
      expected: () => {
        expect(routing.io).toStrictEqual(io);
      }
    },
    {
      should: 'given an inexistend route it should choosen default route',
      input: () => {
        const input = { ...params }
        input.request.method = 'inexistent';
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404)
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: NotFoundException.name,
          message: `Route [inexistent]: ${params.request.url} not found.`
        }));
      }
    },
    {
      should: 'it set any request with CORS enabled and Content-type application/json',
      input: () => params,
      setup: () => { },
      expected: () => {
        expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
        expect(params.response.setHeader).toHaveBeenCalledWith('Content-type', 'application/json');
      }
    },
    {
      should: 'given method OPTIONS it should choose options route',
      input: () => {
        const input = { ...params }
        input.request.method = 'OPTIONS'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(204);
        expect(params.response.end).toHaveBeenCalled();
      }
    },
    {
      should: `given GET method and '/' route path to be returns body response from MockDefaultController`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: '/' }));
      }
    },
    {
      should: `given POST method and '/custom' route path to be returns body response from MockDefaultController`,
      input: () => {
        const body = JSON.stringify({ id });
        const readableStream = new Readable();
        readableStream.push(body);
        readableStream.push(null);
        const request = new IncomingMessage(new Socket());
        request.push(body)
        request.push(null);
        request.method = 'POST';
        request.url = '/custom';
        const input = {
          ...params,
          request,
          values: () => Object.values<any>(input)
        }
        return input;
      },
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: (err?: any) => {
        expect(params.response.writeHead).toHaveBeenCalledWith(201);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'custom', id }));
      }
    },
    {
      should: `given GET method and '/' route path to be returns body response from MockCustomController`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = '/custom'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: '/' }));
      }
    },
    {
      should: `given POST method and '/custom' route path to be returns body response from MockCustomController`,
      input: () => {
        const input = { ...params }
        input.request.method = 'POST'
        input.request.url = '/custom/custom'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(201);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'custom' }));
      }
    },
    {
      should: `given GET method and '/throw' route path to be returns body response with error messages`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = '/custom/throw'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(500);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: Error.name,
          message: 'Throw route'
        }));
      }
    },
    {
      should: `given GET method and '/inexistent' route path to be returns body response with error messages`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = '/custom/inexistent'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: NotFoundException.name,
          message: `Route [GET]: /custom/inexistent not found.`
        }));
      }
    },
    {
      should: `given empty array of controllers and returns not found route response`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = '/'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: RoutesNotFoundException.name,
          message: `No routes registered.`
        }));
      }
    },
    {
      should: `given empty controllers and returns not found route response`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = '/empty'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: RoutesNotFoundException.name,
          message: `No routes registered.`
        }));
      }
    },
    {
      should: `given undefined method and throw error response`,
      input: () => {
        const input = { ...params }
        input.request.method = undefined as unknown as string
        input.request.url = '/empty'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(500);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: Error.name,
          message: `Method not allowed.`
        }));
      }
    },
    {
      should: `given undefined request url and return not found exception response`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = undefined as unknown as string
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: RoutesNotFoundException.name,
          message: `No routes registered.`
        }));
      }
    },
    {
      should: `given param/:id request url and return success`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = `custom/param/${id}`
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: `param/${id}` }));
      }
    },
  ])('Should $should', async ({ input, expected, setup }) => {
    if (setup) setup();

    if (!input) {
      expected()
      return;
    }

    await routing.handler(...(input().values() as [IncomingMessage, ServerResponse]))
    expected()
  }, 10000)
})