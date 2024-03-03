import { IncomingMessage, ServerResponse } from "http";
import { Routing } from "../routing"
import { MockDefaultController } from "./mocks/default-controller.mock";
import { MockCustomController } from "./mocks/custom-controller.mock";
import { MockEmptyController } from "./mocks/empty-controller.mock";
import { randomUUID } from "crypto";
import { Socket } from "node:net";
import { NotFoundException } from "@exceptions/not-fount.exception";
import { NoRoutesRegisteredException } from "@exceptions/no-routes-registered.exception";
import { BadRequestException } from "@exceptions/bad-request.exception";
import { HttpMethodEnum, HttpStatusCodeEnum } from "@common/enums";

describe('[Routing & Router]', () => {
  let routing: Routing;
  let params: { request: IncomingMessage, response: Partial<ServerResponse> } = {
    request: new IncomingMessage(new Socket()),
    response: {
      setHeader: jest.fn(),
      writeHead: jest.fn(),
      end: jest.fn()
    },
  };

  let args: () => any = () => null;

  beforeEach(() => {
    routing = new Routing()
    params = {
      request: new IncomingMessage(new Socket()),
      response: {
        setHeader: jest.fn(),
        writeHead: jest.fn(),
        end: jest.fn()
      },
    }
    params.request.url = '/'
    params.request.method = 'GET'
    args = () => Object.values(params);
  })

  const io = {
    to: (id: any) => io,
    emit: (event: any, message: any) => { }
  }

  const input = (method?: HttpMethodEnum, url?: string, body?: object) => {
    const copy = { ...params }
    copy.request.method = method;
    copy.request.url = url;
    if (body) copy.request.push(JSON.stringify(body));
    copy.request.push(null);
    return args = () => Object.values(copy);
  }

  const id = randomUUID();

  it.each([
    {
      should: 'Should store the socket.io instance',
      input: () => input(),
      setup: () => {
        routing.setSocketInstance(io as any)
      },
      expected: () => {
        expect(routing.io).toStrictEqual(io);
      }
    },
    {
      should: 'Should set CORS headers and Content-Type to application/json for any request',
      input: () => input(HttpMethodEnum.GET, '/'),
      setup: () => { },
      expected: () => {
        expect(params.response.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
        expect(params.response.setHeader).toHaveBeenCalledWith('Content-type', 'application/json');
      }
    },
    {
      should: `[INEXISTEND][/]: Should return BadRequestException for an invalid method route`,
      input: () => input('INEXISTEND' as HttpMethodEnum, '/'),
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.BAD_REQUEST)
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: BadRequestException.name,
          message: `Bad request: "INEXISTEND" is a invalid method http`
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.OPTIONS}][/]: Should return ${HttpStatusCodeEnum.NO_CONTENT} status for OPTIONS method`,
      input: () => input(HttpMethodEnum.OPTIONS, '/'),
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.NO_CONTENT);
        expect(params.response.end).toHaveBeenCalled();
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/]: Should return ${HttpStatusCodeEnum.OK} status response from MockDefaultController`,
      input: () => input(HttpMethodEnum.GET, '/'),
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: () => {
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: '/' }));
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.OK);
      }
    },
    {
      should: `[${HttpMethodEnum.POST}][/]: Should return ${HttpStatusCodeEnum.CREATED} status response from MockDefaultController`,
      input: () => input(HttpMethodEnum.POST, '/custom', { id }),
      setup: () => {
        routing = new Routing({ controllers: [MockDefaultController] })
      },
      expected: (err?: any) => {
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'custom', id }));
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.CREATED);
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/]: Should return ${HttpStatusCodeEnum.OK} status response from MockCustomController`,
      input: () => input(HttpMethodEnum.GET, '/custom'),
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: '/' }));
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.OK);
      }
    },
    {
      should: `[${HttpMethodEnum.POST}][/custom] Should return ${HttpStatusCodeEnum.CREATED} status response from MockCustomController`,
      input: () => input(HttpMethodEnum.POST, '/custom/custom', { value: 'value' }),
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: 'custom', body: { value: 'value' } }));
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.CREATED);
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/custom/throw] Should return ${HttpStatusCodeEnum.INTERNAL_SERVER_ERROR} status response from MockCustomController`,
      input: () => input(HttpMethodEnum.GET, '/custom/throw'),
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: Error.name,
          message: 'Throw route'
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/custom/inexistent] Should return ${HttpStatusCodeEnum.NOT_FOUND} status response from MockCustomController`,
      input: () => input(HttpMethodEnum.GET, '/custom/inexistent'),
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.NOT_FOUND);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: NotFoundException.name,
          message: `Route [GET]: /custom/inexistent not found.`
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/] Should return ${HttpStatusCodeEnum.NOT_FOUND} status response for no controllers registered`,
      input: () => input(HttpMethodEnum.GET, '/'),
      setup: () => {
        routing = new Routing({ controllers: [] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.NOT_FOUND);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: NoRoutesRegisteredException.name,
          message: `No routes registered in the router.`
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/empty] Should return ${HttpStatusCodeEnum.NOT_FOUND} status response from MockEmptyController`,
      input: () => input(HttpMethodEnum.GET, '/empty'),
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.NOT_FOUND);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: NoRoutesRegisteredException.name,
          message: `No routes registered in the router.`
        }));
      }
    },
    {
      should: `[undefined][/empty] Should return ${HttpStatusCodeEnum.BAD_REQUEST} status response from MockEmptyController`,
      input: () => input(undefined, '/empty'),
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.BAD_REQUEST);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: BadRequestException.name,
          message: `Bad request: Missing method`
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][undefined] Should return ${HttpStatusCodeEnum.BAD_REQUEST} status response from MockEmptyController`,
      input: () => input(HttpMethodEnum.GET, undefined),
      setup: () => {
        routing = new Routing({ controllers: [MockEmptyController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.BAD_REQUEST);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: BadRequestException.name,
          message: `Bad request: Missing URL`
        }));
      }
    },
    {
      should: `[${HttpMethodEnum.GET}][/custom/param/:id] Should return ${HttpStatusCodeEnum.OK} status response from MockCustomController`,
      input: () => input(HttpMethodEnum.GET, `custom/param/${id}`),
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.OK);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({ success: true, path: `param/${id}` }));
      }
    },
    {
      should: `Should return ${HttpStatusCodeEnum.INTERNAL_SERVER_ERROR} status response when request object is undefined`,
      input: () => {
        const input = { ...params }
        input.request = null as unknown as any
        args = () => Object.values<any>(input)
        return args
      },
      setup: () => {
        routing = new Routing({ controllers: [MockCustomController] })
      },
      expected: () => {
        expect(params.response.writeHead).toHaveBeenCalledWith(HttpStatusCodeEnum.INTERNAL_SERVER_ERROR);
        expect(params.response.end).toHaveBeenCalledWith(JSON.stringify({
          exception: Error.name,
          message: `Invalid Request`
        }));
      }
    },
  ])('$should', async ({ input, expected, setup }) => {
    if (setup) setup();

    if (!input) {
      expected()
      return;
    }

    const values = input();

    await routing.handleRequest(...(values() as [IncomingMessage, ServerResponse]))
    expected()
  }, 0)
})