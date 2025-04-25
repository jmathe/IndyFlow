// src/core/shared/types/pagination.ts

/**
 * Parameters for standard pagination in `findMany` queries.
 * Used to specify the number of items to skip (`skip`) and the number of items to take (`take`).
 *
 * @interface FindManyParams
 */
export interface FindManyParams {
  /**
   * Number of items to skip for pagination.
   * Used to offset the initial result set.
   * @type {number}
   */
  skip?: number;

  /**
   * Number of items to retrieve for pagination.
   * Determines the maximum number of results to return.
   * @type {number}
   */
  take?: number;
}
