export interface MyContext {
    request: {
      headers: {
        authorization: string;
      };
    };
}