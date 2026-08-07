import type { BaseError } from "$lib/error";


export type ApiResponse<TData> = {
  success: boolean;
  errors: BaseError[] | null;
  data: TData[] | null;
}