export class WebSocketService {
  private static instance: WebSocketService;

  constructor() {
    if (WebSocketService.instance) {
      return WebSocketService.instance;
    }

    WebSocketService.instance = this;

    return this;
  }
}

export default WebSocketService;
