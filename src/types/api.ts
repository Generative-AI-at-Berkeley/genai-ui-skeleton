/** Response shapes from the API. One interface per endpoint the UI calls. */

export interface Health {
  status: string;
  version?: string;
}
