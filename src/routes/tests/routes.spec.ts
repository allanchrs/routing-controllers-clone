import { IncomingMessage, ServerResponse } from "http";
import { Routes } from "../routes"
import { MockDefaultController } from "./mocks/default-controller.mock";
import { MockCustomController } from "./mocks/custom-controller.mock";
import { MockEmptyController } from "./mocks/empty-controller.mock";
import { randomUUID } from "crypto";

describe('#Routes', () => {
  let routes: Routes;

  beforeEach(() => {
    routes = new Routes()
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
      body: {}
    },
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
    values: () => Object.values<any>(params)
  }

  it.each([
    {
      should: 'set store socket io instance',
      input: () => params,
      setup: () => {
        routes.setSocketInstance(io as any)
      },
      expected: () => {
        expect(routes.io).toStrictEqual(io);
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
      setup: () => { },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404)
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'NotFoundException',
          message: `Route with url [inexistent] '${params.request.url}' not found`
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
        routes = new Routes({ controllers: [MockDefaultController] })
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
        routes = new Routes({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: '/' }));
      }
    },
    {
      should: `given POST method and '/custom' route path to be returns body response from MockDefaultController`,
      only: true,
      input: () => {
        const input = { ...params }
        input.request.method = 'POST'
        input.request.url = '/custom'
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routes = new Routes({ controllers: [MockDefaultController] })
      },
      expected: (err?: any) => {
        console.log({ err })
        // expect(params.response.writeHead).toHaveBeenCalledWith(201);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'custom' }));
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
        routes = new Routes({ controllers: [MockCustomController] })
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
        routes = new Routes({ controllers: [MockCustomController] })
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
        routes = new Routes({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(500);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'InternalServerError',
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
        routes = new Routes({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'NotFoundException',
          message: `Route with url [GET] '/custom/inexistent' not found`
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
        routes = new Routes({ controllers: [] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'NotFoundException',
          message: `Route with url [GET] '/' not found`
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
        routes = new Routes({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'NotFoundException',
          message: `Route with url [GET] '/empty' not found`
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
        routes = new Routes({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(500);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'InternalServerError',
          message: `method not allowed`
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
        routes = new Routes({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: 'NotFoundException',
          message: `Route with url [GET] 'undefined' not found`
        }));
      }
    },
    {
      should: `given :id/param request url and return success`,
      input: () => {
        const input = { ...params }
        input.request.method = 'GET'
        input.request.url = `custom/param/${randomUUID()}`
        input.values = () => Object.values<any>(input)
        return input
      },
      setup: () => {
        routes = new Routes({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(200);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'param/:id' }));
      }
    },
  ])('Should $should', async ({ input, expected, setup, only }) => {
    if (setup) setup();

    if (!input) {
      expected()
      return;
    }

    await routes.handler(...(input().values() as [IncomingMessage, ServerResponse]))
    expected()
  })
})